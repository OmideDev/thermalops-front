import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AssistantAskResponse } from '../types/assistant'
import { useAssistantAsk } from './useAssistantAsk'

vi.mock('../api/assistant', () => ({
  askAssistant: vi.fn(),
}))

import { askAssistant } from '../api/assistant'

const askAssistantMock = vi.mocked(askAssistant)

function okResponse(answer: string): AssistantAskResponse {
  return {
    answer,
    sources: [{ document_id: 'd1', title: 'Manual', page: 15 }],
  }
}

describe('useAssistantAsk', () => {
  beforeEach(() => {
    askAssistantMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('records a normal successful response', async () => {
    askAssistantMock.mockResolvedValue(okResponse('Pressure drop across filters.'))

    const { result } = renderHook(() => useAssistantAsk())

    act(() => {
      result.current.ask('What does the dirty filter sensor monitor?')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.result?.answer).toBe('Pressure drop across filters.')
    expect(result.current.error).toBeNull()
    expect(askAssistantMock).toHaveBeenCalledOnce()
  })

  it('clears ownership when an aborted request later resolves', async () => {
    let resolveAsk!: (value: AssistantAskResponse) => void
    askAssistantMock.mockImplementation(
      () =>
        new Promise<AssistantAskResponse>((resolve) => {
          resolveAsk = resolve
        }),
    )

    const { result } = renderHook(() => useAssistantAsk())

    act(() => {
      result.current.ask('Slow question')
    })
    expect(result.current.loading).toBe(true)

    act(() => {
      result.current.cancel()
    })

    act(() => {
      resolveAsk(okResponse('Should be ignored'))
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.result).toBeNull()

    askAssistantMock.mockResolvedValue(okResponse('Second answer'))
    act(() => {
      result.current.ask('Follow-up question')
    })

    await waitFor(() => {
      expect(result.current.result?.answer).toBe('Second answer')
    })
    expect(askAssistantMock).toHaveBeenCalledTimes(2)
  })

  it('allows a new ask after cancellation', async () => {
    askAssistantMock.mockImplementation(
      (_request, signal) =>
        new Promise<AssistantAskResponse>((_resolve, reject) => {
          signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
    )

    const { result } = renderHook(() => useAssistantAsk())

    act(() => {
      result.current.ask('First question')
    })

    act(() => {
      result.current.cancel()
    })

    await waitFor(() => {
      expect(result.current.error?.kind).toBe('canceled')
    })

    askAssistantMock.mockResolvedValue(okResponse('After cancel'))
    act(() => {
      result.current.ask('Second question')
    })

    await waitFor(() => {
      expect(result.current.result?.answer).toBe('After cancel')
    })
    expect(result.current.error).toBeNull()
    expect(askAssistantMock).toHaveBeenCalledTimes(2)
  })

  it('ignores obsolete settlement after a newer request starts', async () => {
    let resolveFirst!: (value: AssistantAskResponse) => void
    let resolveSecond!: (value: AssistantAskResponse) => void

    askAssistantMock
      .mockImplementationOnce(
        () =>
          new Promise<AssistantAskResponse>((resolve) => {
            resolveFirst = resolve
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<AssistantAskResponse>((resolve) => {
            resolveSecond = resolve
          }),
      )

    const { result } = renderHook(() => useAssistantAsk())

    act(() => {
      result.current.ask('First')
    })

    act(() => {
      result.current.cancel()
    })

    act(() => {
      result.current.ask('Second')
    })

    expect(askAssistantMock).toHaveBeenCalledTimes(2)
    expect(result.current.loading).toBe(true)

    act(() => {
      resolveFirst(okResponse('Stale first answer'))
    })

    // Give the stale then-handler a turn; must not win.
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.result).toBeNull()
    expect(result.current.loading).toBe(true)

    act(() => {
      resolveSecond(okResponse('Fresh second answer'))
    })

    await waitFor(() => {
      expect(result.current.result?.answer).toBe('Fresh second answer')
    })
    expect(result.current.loading).toBe(false)
  })

  it('aborts safely on unmount without applying a late response', async () => {
    let resolveAsk!: (value: AssistantAskResponse) => void
    const abortSpy = vi.fn()

    askAssistantMock.mockImplementation((_request, signal) => {
      signal?.addEventListener('abort', abortSpy)
      return new Promise<AssistantAskResponse>((resolve) => {
        resolveAsk = resolve
      })
    })

    const { result, unmount } = renderHook(() => useAssistantAsk())

    act(() => {
      result.current.ask('Pending on unmount')
    })

    unmount()
    expect(abortSpy).toHaveBeenCalled()

    act(() => {
      resolveAsk(okResponse('Too late'))
    })

    await act(async () => {
      await Promise.resolve()
    })
    // No throw; ownership was dropped on unmount so state is not updated.
  })
})

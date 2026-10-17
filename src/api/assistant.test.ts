import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from './client'
import { askAssistant } from './assistant'

describe('askAssistant', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('POSTs question to /api/v1/assistant/ask', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        answer: 'Monitors filter loading.',
        sources: [
          {
            document_id: 'doc-1',
            title: 'Greenheck Manual',
            page: 15,
          },
        ],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await askAssistant({
      question: 'What does the dirty filter sensor monitor?',
    })

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/v1/assistant/ask')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toEqual({
      question: 'What does the dirty filter sensor monitor?',
    })
    expect(result.sources[0]?.page).toBe(15)
  })

  it('throws ApiError for 503', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ detail: 'Assistant is unavailable' }),
      }),
    )

    await expect(
      askAssistant({ question: 'How does frost control work?' }),
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 503,
      message: 'Assistant is unavailable',
    } satisfies Partial<ApiError>)
  })

  it('propagates abort without retry', async () => {
    const controller = new AbortController()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url, init: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        })
      }),
    )

    const pending = askAssistant(
      { question: 'What does the manual say about internal filter maintenance?' },
      controller.signal,
    )
    controller.abort()

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })
})

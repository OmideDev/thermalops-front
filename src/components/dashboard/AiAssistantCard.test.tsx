import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  INSUFFICIENT_EVIDENCE_PREFIX,
  SUGGESTED_QUESTIONS,
} from '@/types/assistant'
import { AiAssistantCard } from './AiAssistantCard'

function mockJsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }
}

describe('AiAssistantCard', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('fills and submits a suggested prompt', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue(
      mockJsonResponse(200, {
        answer: 'It monitors pressure drop across the filter.',
        sources: [
          { document_id: 'd1', title: 'Greenheck ERT IOM', page: 15 },
        ],
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<AiAssistantCard />)

    await user.click(
      screen.getByRole('button', { name: SUGGESTED_QUESTIONS[0] }),
    )

    await waitFor(() => {
      expect(screen.getByTestId('assistant-result')).toBeInTheDocument()
    })

    expect(screen.getByText(/Greenheck ERT IOM/)).toBeInTheDocument()
    expect(screen.getByText(/page 15/)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('renders empty-source abstention without inventing citations', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockJsonResponse(200, {
          answer: `${INSUFFICIENT_EVIDENCE_PREFIX} No matching passages.`,
          sources: [],
        }),
      ),
    )

    render(<AiAssistantCard />)

    await user.type(
      screen.getByLabelText('Assistant question'),
      'What about page ninety-nine?',
    )
    await user.click(screen.getByRole('button', { name: 'Ask' }))

    await waitFor(() => {
      expect(screen.getByTestId('assistant-result')).toBeInTheDocument()
    })
    expect(
      screen.getByText('Insufficient evidence', { exact: true }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/^Sources$/i)).not.toBeInTheDocument()
  })

  it('disables submit while loading and shows elapsed wait', async () => {
    const user = userEvent.setup()
    let resolveFetch: ((value: unknown) => void) | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve
          }),
      ),
    )

    render(<AiAssistantCard />)

    await user.type(
      screen.getByLabelText('Assistant question'),
      'How does frost control work?',
    )
    await user.click(screen.getByRole('button', { name: 'Ask' }))

    expect(screen.getByTestId('assistant-loading')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancel wait/i })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Ask' })).not.toBeInTheDocument()

    resolveFetch?.(
      mockJsonResponse(200, {
        answer: 'Frost control cycles the compressor.',
        sources: [{ document_id: 'd1', title: 'Manual', page: 29 }],
      }),
    )

    await waitFor(() => {
      expect(screen.getByTestId('assistant-result')).toBeInTheDocument()
    })
  })

  it.each([
    [429, /busy/i],
    [502, /upstream/i],
    [503, /unavailable/i],
    [504, /timed out/i],
  ] as const)('shows error UI for HTTP %s', async (status, titleMatch) => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockJsonResponse(status, { detail: `status ${status}` }),
      ),
    )

    render(<AiAssistantCard />)
    await user.type(screen.getByLabelText('Assistant question'), 'Test question')
    await user.click(screen.getByRole('button', { name: 'Ask' }))

    await waitFor(() => {
      expect(screen.getByTestId('assistant-error')).toBeInTheDocument()
    })
    expect(screen.getByTestId('assistant-error')).toHaveTextContent(titleMatch)
  })

  it('shows network failure copy', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    )

    render(<AiAssistantCard />)
    await user.type(screen.getByLabelText('Assistant question'), 'Network check')
    await user.click(screen.getByRole('button', { name: 'Ask' }))

    await waitFor(() => {
      expect(screen.getByTestId('assistant-error')).toHaveTextContent(
        /Network error/i,
      )
    })
  })

  it('cancels waiting without claiming server stop', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'))
            })
          }),
      ),
    )

    render(<AiAssistantCard />)
    await user.type(screen.getByLabelText('Assistant question'), 'Slow question')
    await user.click(screen.getByRole('button', { name: 'Ask' }))
    await user.click(screen.getByRole('button', { name: /Cancel wait/i }))

    await waitFor(() => {
      expect(screen.getByTestId('assistant-error')).toHaveTextContent(
        /Request canceled/i,
      )
    })
    expect(screen.getByTestId('assistant-error').textContent).toMatch(
      /browser/i,
    )
  })

  it('shows experimental informational label', () => {
    render(<AiAssistantCard />)
    expect(
      screen.getByText('Experimental', { selector: '[data-slot="badge"]' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Informational only — not verified engineering/i),
    ).toBeInTheDocument()
  })
})

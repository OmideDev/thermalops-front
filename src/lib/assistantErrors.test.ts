import { describe, expect, it } from 'vitest'
import { ApiError } from '../api/client'
import { describeAssistantError } from './assistantErrors'

describe('describeAssistantError', () => {
  it('maps 429 busy', () => {
    const view = describeAssistantError(new ApiError('busy', 429))
    expect(view.kind).toBe('busy')
    expect(view.title).toMatch(/busy/i)
  })

  it('maps 502 protocol failure', () => {
    const view = describeAssistantError(new ApiError('bad gateway', 502))
    expect(view.kind).toBe('upstream_protocol')
  })

  it('maps 503 unavailable', () => {
    const view = describeAssistantError(new ApiError('unavailable', 503))
    expect(view.kind).toBe('unavailable')
  })

  it('maps 504 timeout', () => {
    const view = describeAssistantError(new ApiError('timeout', 504))
    expect(view.kind).toBe('timeout')
  })

  it('maps AbortError without claiming server cancel', () => {
    const view = describeAssistantError(
      new DOMException('The operation was aborted.', 'AbortError'),
    )
    expect(view.kind).toBe('canceled')
    expect(view.message).toMatch(/browser/i)
    expect(view.message).not.toMatch(/stopped on the server/i)
  })

  it('maps generic network failure', () => {
    const view = describeAssistantError(new TypeError('Failed to fetch'))
    expect(view.kind).toBe('network')
  })
})

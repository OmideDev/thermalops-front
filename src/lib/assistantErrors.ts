import { ApiError } from '../api/client'

export type AssistantErrorKind =
  | 'validation'
  | 'busy'
  | 'upstream_protocol'
  | 'unavailable'
  | 'timeout'
  | 'network'
  | 'canceled'
  | 'unknown'

export interface AssistantErrorView {
  kind: AssistantErrorKind
  title: string
  message: string
}

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true
  }
  return error instanceof Error && error.name === 'AbortError'
}

/**
 * Map HTTP / network failures to user-facing copy.
 * Browser abort does not stop backend generation — say so explicitly.
 */
export function describeAssistantError(error: unknown): AssistantErrorView {
  if (isAbortError(error)) {
    return {
      kind: 'canceled',
      title: 'Request canceled',
      message:
        'Waiting was canceled in the browser. The server may still finish generation in the background.',
    }
  }

  if (error instanceof ApiError) {
    switch (error.status) {
      case 422:
        return {
          kind: 'validation',
          title: 'Invalid question',
          message:
            error.message ||
            'Enter a non-empty question within the allowed length.',
        }
      case 429:
        return {
          kind: 'busy',
          title: 'Assistant busy',
          message:
            'Another answer is already being generated. Wait for it to finish, then try again.',
        }
      case 502:
        return {
          kind: 'upstream_protocol',
          title: 'Upstream response error',
          message:
            'The assistant received an invalid response from the local model service. Try again later.',
        }
      case 503:
        return {
          kind: 'unavailable',
          title: 'Assistant unavailable',
          message:
            'The assistant is disabled or the local model service is not reachable. Equipment monitoring is unaffected.',
        }
      case 504:
        return {
          kind: 'timeout',
          title: 'Assistant timed out',
          message:
            'The local model took too long to respond. Answers on CPU can take over a minute — try again.',
        }
      default:
        return {
          kind: 'unknown',
          title: 'Request failed',
          message: error.message || `Unexpected error (${error.status}).`,
        }
    }
  }

  return {
    kind: 'network',
    title: 'Network error',
    message:
      'Could not reach the ThermalOps API. Confirm the backend is running on loopback.',
  }
}

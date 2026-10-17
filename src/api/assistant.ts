import { apiPost } from './client'
import type {
  AssistantAskRequest,
  AssistantAskResponse,
} from '../types/assistant'

/**
 * POST /api/v1/assistant/ask — grounded informational assistant only.
 * Does not call Ollama from the browser.
 */
export function askAssistant(
  request: AssistantAskRequest,
  signal?: AbortSignal,
): Promise<AssistantAskResponse> {
  return apiPost<AssistantAskResponse>(
    '/api/v1/assistant/ask',
    { question: request.question },
    signal,
  )
}

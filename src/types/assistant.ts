/** Typed contracts for POST /api/v1/assistant/ask */

export interface AssistantSource {
  document_id: string
  title: string
  page: number
}

export interface AssistantAskRequest {
  question: string
}

export interface AssistantAskResponse {
  answer: string
  sources: AssistantSource[]
}

/** Prefixes from the backend abstention strings (exact server copy). */
export const INSUFFICIENT_EVIDENCE_PREFIX =
  'Insufficient evidence in the indexed manuals to answer this question.'

export const OPERATIONAL_SAFETY_PREFIX =
  'This experimental assistant cannot provide unverified operational'

export const SUGGESTED_QUESTIONS = [
  'What does the dirty filter sensor monitor?',
  'How does frost control work?',
  'What does the manual say about internal filter maintenance?',
] as const

export type AssistantUiKind =
  | 'answer'
  | 'insufficient_evidence'
  | 'operational_abstention'

export function classifyAssistantAnswer(answer: string): AssistantUiKind {
  if (answer.startsWith(OPERATIONAL_SAFETY_PREFIX)) {
    return 'operational_abstention'
  }
  if (answer.startsWith(INSUFFICIENT_EVIDENCE_PREFIX)) {
    return 'insufficient_evidence'
  }
  return 'answer'
}

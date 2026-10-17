import { describe, expect, it } from 'vitest'
import {
  INSUFFICIENT_EVIDENCE_PREFIX,
  OPERATIONAL_SAFETY_PREFIX,
  classifyAssistantAnswer,
} from './assistant'

describe('classifyAssistantAnswer', () => {
  it('detects insufficient-evidence abstention', () => {
    expect(
      classifyAssistantAnswer(
        `${INSUFFICIENT_EVIDENCE_PREFIX} Try another topic.`,
      ),
    ).toBe('insufficient_evidence')
  })

  it('detects operational abstention', () => {
    expect(
      classifyAssistantAnswer(
        `${OPERATIONAL_SAFETY_PREFIX} guidance for field work.`,
      ),
    ).toBe('operational_abstention')
  })

  it('treats other answers as normal', () => {
    expect(classifyAssistantAnswer('The dirty filter sensor monitors…')).toBe(
      'answer',
    )
  })
})

import { useCallback, useEffect, useRef, useState } from 'react'
import { askAssistant } from '../api/assistant'
import {
  describeAssistantError,
  type AssistantErrorView,
} from '../lib/assistantErrors'
import type { AssistantAskResponse } from '../types/assistant'

export interface AssistantAskState {
  question: string
  setQuestion: (value: string) => void
  result: AssistantAskResponse | null
  error: AssistantErrorView | null
  loading: boolean
  elapsedMs: number
  ask: (overrideQuestion?: string) => void
  cancel: () => void
}

export function useAssistantAsk(): AssistantAskState {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<AssistantAskResponse | null>(null)
  const [error, setError] = useState<AssistantErrorView | null>(null)
  const [loading, setLoading] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)

  const abortRef = useRef<AbortController | null>(null)
  const startedAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (!loading) {
      return
    }

    const tick = () => {
      if (startedAtRef.current != null) {
        setElapsedMs(Date.now() - startedAtRef.current)
      }
    }

    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [loading])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const ask = useCallback((overrideQuestion?: string) => {
    const nextQuestion = (overrideQuestion ?? question).trim()
    if (!nextQuestion) {
      return
    }

    // Block only while a non-aborted request owns the slot. An aborted
    // controller may still be settling; allow a replacement ask.
    const active = abortRef.current
    if (active && !active.signal.aborted) {
      return
    }

    if (overrideQuestion != null) {
      setQuestion(overrideQuestion)
    }

    const controller = new AbortController()
    abortRef.current = controller
    startedAtRef.current = Date.now()
    setElapsedMs(0)
    setLoading(true)
    setError(null)
    setResult(null)

    const settleIfOwner = (apply: () => void) => {
      if (abortRef.current !== controller) {
        return
      }
      apply()
      if (abortRef.current === controller) {
        abortRef.current = null
      }
    }

    askAssistant({ question: nextQuestion }, controller.signal)
      .then((data) => {
        settleIfOwner(() => {
          if (controller.signal.aborted) {
            // Aborted request resolved anyway — clear ownership, skip success.
            setLoading(false)
            return
          }
          setResult(data)
          setLoading(false)
        })
      })
      .catch((err: unknown) => {
        settleIfOwner(() => {
          setError(describeAssistantError(err))
          setLoading(false)
        })
      })
  }, [question])

  useEffect(() => {
    return () => {
      const controller = abortRef.current
      // Drop ownership first so an in-flight settlement cannot setState.
      abortRef.current = null
      controller?.abort()
    }
  }, [])

  return {
    question,
    setQuestion,
    result,
    error,
    loading,
    elapsedMs,
    ask,
    cancel,
  }
}

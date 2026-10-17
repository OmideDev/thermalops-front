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
    if (!nextQuestion || abortRef.current) {
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

    askAssistant({ question: nextQuestion }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return
        }
        setResult(data)
        setLoading(false)
        abortRef.current = null
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          setError(describeAssistantError(err))
          setLoading(false)
          abortRef.current = null
          return
        }
        setError(describeAssistantError(err))
        setLoading(false)
        abortRef.current = null
      })
  }, [question])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
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

import type { FormEvent } from 'react'
import {
  AlertTriangle,
  BookOpen,
  Info,
  Loader2,
  Sparkles,
  Square,
} from 'lucide-react'
import { useAssistantAsk } from '@/hooks/useAssistantAsk'
import {
  SUGGESTED_QUESTIONS,
  classifyAssistantAnswer,
  type AssistantSource,
} from '@/types/assistant'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) {
    return `${seconds}s`
  }
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

function SourcesList({ sources }: { sources: AssistantSource[] }) {
  if (sources.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Sources
      </p>
      <ul className="space-y-1.5">
        {sources.map((source) => (
          <li
            key={`${source.document_id}-${source.page}-${source.title}`}
            className="flex items-start gap-2 rounded-lg border border-line bg-soft/50 px-2.5 py-2 text-[12px] text-ink"
          >
            <BookOpen
              className="mt-0.5 size-3.5 shrink-0 text-brand"
              strokeWidth={2}
              aria-hidden
            />
            <span>
              <span className="font-medium">{source.title}</span>
              <span className="text-muted-foreground"> · page {source.page}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AiAssistantCard() {
  const {
    question,
    setQuestion,
    result,
    error,
    loading,
    elapsedMs,
    ask,
    cancel,
  } = useAssistantAsk()

  const canSubmit = question.trim().length > 0 && !loading
  const answerKind = result ? classifyAssistantAnswer(result.answer) : null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSubmit) {
      return
    }
    ask()
  }

  return (
    <Card className="shadow-card ring-line/80" data-testid="ai-assistant-card">
      <CardHeader className="gap-3 border-b bg-soft/60">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <Sparkles className="size-4" strokeWidth={2} aria-hidden />
            </span>
            <div>
              <CardTitle className="text-sm font-bold tracking-tight text-ink">
                AI Assistant
              </CardTitle>
              <CardDescription className="text-[11px]">
                Manual Q&amp;A from indexed pages
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="rounded-full text-[9px] uppercase">
            Experimental
          </Badge>
        </div>
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden />
          Informational only — not verified engineering or field-service guidance.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Question
            </span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={3}
              disabled={loading}
              placeholder="Ask about indexed manual content…"
              className={cn(
                'w-full resize-y rounded-xl border border-line bg-panel px-3 py-2.5 text-[13px] text-ink shadow-sm outline-none transition',
                'placeholder:text-muted-foreground/70',
                'focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20',
                'disabled:cursor-not-allowed disabled:opacity-60',
              )}
              aria-label="Assistant question"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={loading}
                onClick={() => ask(prompt)}
                className={cn(
                  'rounded-full border border-line bg-soft px-2.5 py-1 text-left text-[11px] font-medium text-ink transition',
                  'hover:border-brand/40 hover:bg-brand-soft hover:text-brand',
                  'disabled:pointer-events-none disabled:opacity-50',
                )}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
              <Button
                type="button"
                variant="outline"
                className="h-9 flex-1"
                onClick={cancel}
              >
                <Square className="size-3.5" strokeWidth={2.2} />
                Cancel wait
              </Button>
            ) : (
              <Button type="submit" className="h-9 flex-1" disabled={!canSubmit}>
                Ask
              </Button>
            )}
          </div>
        </form>

        {loading ? (
          <div
            className="flex items-start gap-2.5 rounded-xl border border-line bg-soft/70 px-3 py-3"
            role="status"
            aria-live="polite"
            data-testid="assistant-loading"
          >
            <Loader2
              className="mt-0.5 size-4 shrink-0 animate-spin text-brand"
              strokeWidth={2}
              aria-hidden
            />
            <div className="min-w-0 space-y-0.5 text-[12px]">
              <p className="font-semibold text-ink">Waiting for answer…</p>
              <p className="text-muted-foreground">
                Elapsed {formatElapsed(elapsedMs)}. Local CPU answers often take
                1–2 minutes. Canceling stops waiting in the browser only.
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-[12px] dark:border-amber-900/50 dark:bg-amber-950/40"
            role="alert"
            data-testid="assistant-error"
          >
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400"
              strokeWidth={2}
              aria-hidden
            />
            <div className="min-w-0 space-y-0.5">
              <p className="font-semibold text-ink">{error.title}</p>
              <p className="text-muted-foreground">{error.message}</p>
            </div>
          </div>
        ) : null}

        {result && !loading ? (
          <div className="space-y-3" data-testid="assistant-result">
            {answerKind === 'insufficient_evidence' ? (
              <div className="rounded-xl border border-line bg-soft/70 px-3 py-3 text-[12px]">
                <p className="font-semibold text-ink">Insufficient evidence</p>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {result.answer}
                </p>
              </div>
            ) : null}

            {answerKind === 'operational_abstention' ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-[12px] dark:border-amber-900/50 dark:bg-amber-950/40">
                <p className="font-semibold text-ink">Operational request declined</p>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {result.answer}
                </p>
              </div>
            ) : null}

            {answerKind === 'answer' ? (
              <div className="rounded-xl border border-line bg-panel px-3 py-3 text-[12px]">
                <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Answer
                </p>
                <p className="leading-relaxed whitespace-pre-wrap text-ink">
                  {result.answer}
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Experimental draft from indexed manuals — verify against source
                  documents before any operational use.
                </p>
              </div>
            ) : null}

            <SourcesList sources={result.sources} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

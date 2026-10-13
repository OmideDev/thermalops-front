import { Card, CardContent } from '@/components/ui/card'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <Card className="shadow-card ring-line/80" role="status" aria-live="polite">
      <CardContent className="flex items-center gap-3 py-6">
        <span
          className="size-5 animate-spin rounded-full border-2 border-line border-t-brand"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

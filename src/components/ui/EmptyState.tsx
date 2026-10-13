import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed shadow-card ring-line/80">
      <CardHeader className="items-center py-10 text-center">
        <CardTitle className="text-base text-ink">{title}</CardTitle>
        <CardDescription className="mx-auto max-w-md text-sm">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

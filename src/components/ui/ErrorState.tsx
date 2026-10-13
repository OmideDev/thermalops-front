import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="border-rose-200 bg-danger-soft shadow-card dark:border-rose-500/30" role="alert">
      <CardHeader>
        <CardTitle className="text-base text-rose-800 dark:text-rose-200">{title}</CardTitle>
        <CardDescription className="text-rose-700 dark:text-rose-300">
          {message}
        </CardDescription>
      </CardHeader>
      {onRetry ? (
        <CardFooter>
          <Button type="button" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  )
}

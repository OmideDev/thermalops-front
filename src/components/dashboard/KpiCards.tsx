import { Activity, AlertTriangle, CircleOff, PlayCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KpiCardsProps {
  totalUnits: number
  runningCount: number
  faultCount: number
  offlineCount: number
  isFiltered: boolean
}

export function KpiCards({
  totalUnits,
  runningCount,
  faultCount,
  offlineCount,
  isFiltered,
}: KpiCardsProps) {
  const scopeLabel = isFiltered
    ? 'Based on filtered equipment results'
    : 'Based on currently loaded equipment'

  const cards = [
    {
      label: 'Equipment loaded',
      value: String(totalUnits),
      hint: 'Records in this view',
      icon: Activity,
      iconClass: 'bg-brand-soft text-brand',
    },
    {
      label: 'Running',
      value: String(runningCount),
      hint: 'Status = running',
      icon: PlayCircle,
      iconClass: 'bg-success-soft text-emerald-600 dark:text-emerald-300',
    },
    {
      label: 'Fault status',
      value: String(faultCount),
      hint: 'Equipment status — not alarm records',
      icon: AlertTriangle,
      iconClass: 'bg-danger-soft text-rose-600 dark:text-rose-300',
    },
    {
      label: 'Offline',
      value: String(offlineCount),
      hint: 'Status = offline',
      icon: CircleOff,
      iconClass: 'bg-soft text-muted-foreground',
    },
  ]

  return (
    <section className="space-y-3">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {scopeLabel}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="shadow-card ring-line/80">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-0">
                <div className="space-y-1">
                  <CardDescription>{card.label}</CardDescription>
                  <CardTitle className="text-2xl font-bold tracking-tight text-ink">
                    {card.value}
                  </CardTitle>
                </div>
                <span
                  className={cn(
                    'grid size-10 place-items-center rounded-xl',
                    card.iconClass,
                  )}
                >
                  <Icon className="size-4" strokeWidth={2} />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{card.hint}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

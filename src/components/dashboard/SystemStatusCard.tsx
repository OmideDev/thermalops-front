import type { Equipment, EquipmentType } from '../../types/equipment'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SystemStatusCardProps {
  items: Equipment[]
}

const SYSTEMS: { label: string; types: EquipmentType[] }[] = [
  { label: 'HVAC (AHU)', types: ['ahu'] },
  { label: 'Chillers / Towers', types: ['chiller', 'cooling_tower'] },
  { label: 'Boilers', types: ['boiler'] },
  { label: 'Pumps', types: ['pump'] },
  { label: 'Other', types: ['other'] },
]

export function SystemStatusCard({ items }: SystemStatusCardProps) {
  const total = items.length

  return (
    <Card className="h-full shadow-card ring-line/80">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-ink">
            Equipment by type
          </CardTitle>
          <Badge variant="secondary" className="rounded-full">
            Loaded only
          </Badge>
        </div>
        <CardDescription>
          Share of each type in the current results — not live system health.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3.5">
          {SYSTEMS.map((system) => {
            const matched = items.filter((item) =>
              system.types.includes(item.equipment_type),
            )
            const count = matched.length
            const pct = total === 0 ? 0 : Math.round((count / total) * 100)
            const running = matched.filter((item) => item.status === 'running').length

            return (
              <li key={system.label} className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                  <span className="min-w-0 font-medium text-ink">{system.label}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs">
                    <span className="font-semibold text-ink tabular-nums">
                      {count} · {pct}%
                    </span>
                    <Badge variant="outline" className="rounded-full font-medium">
                      {running} running
                    </Badge>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-soft">
                  <div
                    className={cn('h-full rounded-full bg-brand transition-all')}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface DonutLegendItem {
  key: string
  label: string
  swatch: string
  value: number
  pct: number
}

interface DonutWithLegendProps {
  title: string
  centerPrimary: string | number
  centerSecondary: string
  gradient: string
  isEmpty: boolean
  legend: DonutLegendItem[]
  footnote?: string
}

export function DonutWithLegend({
  title,
  centerPrimary,
  centerSecondary,
  gradient,
  isEmpty,
  legend,
  footnote,
}: DonutWithLegendProps) {
  return (
    <Card className="@container h-full shadow-card ring-line/80">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold text-ink">{title}</CardTitle>
        {footnote ? (
          <CardDescription className="text-xs leading-relaxed">{footnote}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex flex-col items-center gap-4 @sm:flex-row @sm:items-center @sm:gap-5">
          <div
            className="relative grid size-28 shrink-0 place-items-center rounded-full @sm:size-32"
            style={{
              background: isEmpty
                ? 'conic-gradient(var(--line) 0 100%)'
                : `conic-gradient(${gradient})`,
            }}
            aria-hidden="true"
          >
            <div className="grid size-[4.75rem] place-items-center rounded-full bg-card text-center @sm:size-[5.25rem]">
              <p className="text-xl font-bold tracking-tight text-ink @sm:text-2xl">
                {centerPrimary}
              </p>
              <p className="max-w-[4.5rem] text-[9px] leading-tight font-medium text-muted-foreground @sm:max-w-none @sm:text-[10px]">
                {centerSecondary}
              </p>
            </div>
          </div>

          <ul className="w-full min-w-0 flex-1 space-y-2.5">
            {legend.map((item) => (
              <li
                key={item.key}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 text-xs @sm:text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                  <span className={cn('size-2.5 shrink-0 rounded-full', item.swatch)} />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="shrink-0 text-right font-semibold whitespace-nowrap text-ink tabular-nums">
                  {item.value}{' '}
                  <span className="font-medium text-muted-foreground">
                    ({Math.round(item.pct)}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

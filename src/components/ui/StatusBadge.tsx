import type { EquipmentStatus } from '../../types/equipment'
import { formatEquipmentStatus } from '../../lib/format'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: EquipmentStatus
  className?: string
}

const styles: Record<EquipmentStatus, string> = {
  running: 'bg-success-soft text-emerald-700 dark:text-emerald-300 ring-emerald-500/25',
  stopped: 'bg-soft text-muted-foreground ring-line',
  fault: 'bg-danger-soft text-rose-700 dark:text-rose-300 ring-rose-500/25',
  maintenance: 'bg-warning-soft text-amber-700 dark:text-amber-300 ring-amber-500/25',
  offline: 'bg-soft text-muted-foreground ring-line',
}

const dots: Record<EquipmentStatus, string> = {
  running: 'bg-emerald-500',
  stopped: 'bg-slate-400',
  fault: 'bg-rose-500',
  maintenance: 'bg-amber-500',
  offline: 'bg-slate-400',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        styles[status],
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', dots[status])} aria-hidden="true" />
      {formatEquipmentStatus(status)}
    </span>
  )
}

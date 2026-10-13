import type { Equipment, EquipmentStatus } from '../../types/equipment'
import { DonutWithLegend } from './DonutWithLegend'

interface EquipmentStatusCardProps {
  items: Equipment[]
}

const STATUS_META: {
  key: EquipmentStatus
  label: string
  color: string
  swatch: string
}[] = [
  { key: 'running', label: 'Running', color: '#10b981', swatch: 'bg-emerald-500' },
  { key: 'maintenance', label: 'Maintenance', color: '#f59e0b', swatch: 'bg-amber-500' },
  { key: 'fault', label: 'Fault', color: '#f43f5e', swatch: 'bg-rose-500' },
  { key: 'stopped', label: 'Stopped', color: '#64748b', swatch: 'bg-slate-500' },
  { key: 'offline', label: 'Offline', color: '#94a3b8', swatch: 'bg-slate-400' },
]

export function EquipmentStatusCard({ items }: EquipmentStatusCardProps) {
  const counts = Object.fromEntries(
    STATUS_META.map((meta) => [meta.key, 0]),
  ) as Record<EquipmentStatus, number>

  for (const item of items) {
    counts[item.status] += 1
  }

  const total = items.length || 1
  let offset = 0
  const segments = STATUS_META.map((meta) => {
    const value = counts[meta.key]
    const pct = (value / total) * 100
    const segment = { ...meta, value, pct, offset }
    offset += pct
    return segment
  })

  const gradient = segments
    .filter((segment) => segment.pct > 0)
    .map((segment) => `${segment.color} ${segment.offset}% ${segment.offset + segment.pct}%`)
    .join(', ')

  return (
    <DonutWithLegend
      title="Status in current results"
      centerPrimary={items.length}
      centerSecondary="Loaded units"
      gradient={gradient}
      isEmpty={items.length === 0}
      legend={segments.map((segment) => ({
        key: segment.key,
        label: segment.label,
        swatch: segment.swatch,
        value: segment.value,
        pct: segment.pct,
      }))}
      footnote="Counts from the loaded equipment list. Not a global fleet total."
    />
  )
}

import type { Equipment } from '../../types/equipment'
import { DonutWithLegend } from './DonutWithLegend'

interface EquipmentHealthCardProps {
  items: Equipment[]
}

/**
 * Buckets are a transparent mapping from equipment.status — not sensor health.
 * Kept only as a status-derived summary of the loaded results.
 */
const BUCKETS = [
  { key: 'running', label: 'Running', color: '#10b981', swatch: 'bg-emerald-500', statuses: ['running'] },
  {
    key: 'attention',
    label: 'Needs attention',
    color: '#f59e0b',
    swatch: 'bg-amber-500',
    statuses: ['maintenance', 'stopped'],
  },
  { key: 'fault', label: 'Fault', color: '#f43f5e', swatch: 'bg-rose-500', statuses: ['fault'] },
  { key: 'offline', label: 'Offline', color: '#94a3b8', swatch: 'bg-slate-400', statuses: ['offline'] },
] as const

export function EquipmentHealthCard({ items }: EquipmentHealthCardProps) {
  const total = items.length || 1
  let offset = 0

  const segments = BUCKETS.map((bucket) => {
    const value = items.filter((item) =>
      (bucket.statuses as readonly string[]).includes(item.status),
    ).length
    const pct = (value / total) * 100
    const segment = {
      key: bucket.key,
      label: bucket.label,
      swatch: bucket.swatch,
      color: bucket.color,
      value,
      pct,
      offset,
    }
    offset += pct
    return segment
  })

  const gradient = segments
    .filter((segment) => segment.pct > 0)
    .map((segment) => `${segment.color} ${segment.offset}% ${segment.offset + segment.pct}%`)
    .join(', ')

  const runningShare =
    items.length === 0
      ? 0
      : Math.round((items.filter((item) => item.status === 'running').length / items.length) * 100)

  return (
    <DonutWithLegend
      title="Status-derived summary"
      centerPrimary={`${runningShare}%`}
      centerSecondary="Running share"
      gradient={gradient}
      isEmpty={items.length === 0}
      legend={segments.map((segment) => ({
        key: segment.key,
        label: segment.label,
        swatch: segment.swatch,
        value: segment.value,
        pct: segment.pct,
      }))}
      footnote="Derived from equipment.status in loaded results — not a sensor health score."
    />
  )
}

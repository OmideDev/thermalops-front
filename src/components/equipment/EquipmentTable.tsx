import { useMemo, useState } from 'react'
import type { Equipment, EquipmentType } from '../../types/equipment'
import { formatDateTime, formatEquipmentType, shortId } from '../../lib/format'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { StatusBadge } from '../ui/StatusBadge'

interface EquipmentTableProps {
  items: Equipment[]
  buildingsById: Map<string, string>
  selectedId?: string | null
  onSelect?: (item: Equipment) => void
}

const TABS: { id: 'all' | EquipmentType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ahu', label: 'HVAC' },
  { id: 'chiller', label: 'Chillers' },
  { id: 'boiler', label: 'Boilers' },
  { id: 'pump', label: 'Pumps' },
  { id: 'cooling_tower', label: 'Towers' },
  { id: 'other', label: 'Other' },
]

export function EquipmentTable({
  items,
  buildingsById,
  selectedId,
  onSelect,
}: EquipmentTableProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('all')

  const filtered = useMemo(
    () => (tab === 'all' ? items : items.filter((item) => item.equipment_type === tab)),
    [items, tab],
  )

  return (
    <Card className="overflow-hidden shadow-card ring-line/80">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 border-b">
        <div>
          <CardTitle className="text-sm font-semibold text-ink">Recent equipment</CardTitle>
          <CardDescription>
            {filtered.length} of {items.length} loaded records
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                tab === item.id
                  ? 'bg-brand-soft text-brand'
                  : 'text-muted-foreground hover:bg-soft hover:text-ink',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Building</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const selected = selectedId === item.id
                const buildingName = buildingsById.get(item.building_id)

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      'cursor-pointer border-b border-line last:border-0 transition',
                      selected ? 'bg-brand-soft/70' : 'hover:bg-soft/80',
                    )}
                    onClick={() => onSelect?.(item)}
                  >
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td
                      className="px-4 py-3 font-mono text-xs font-semibold text-ink"
                      title={item.id}
                    >
                      {shortId(item.id, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatEquipmentType(item.equipment_type)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground" title={item.building_id}>
                      {buildingName ?? 'Unknown building'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(item.created_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="flex items-center justify-between gap-3 px-4 py-6">
            <p className="text-sm text-muted-foreground">
              No equipment matches this type in the current results.
            </p>
            <Badge variant="secondary" className="rounded-full">
              Try another tab
            </Badge>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

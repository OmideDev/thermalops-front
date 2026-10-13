import type { ReactNode } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { EQUIPMENT_STATUSES, type EquipmentStatus } from '../../types/equipment'
import type { Building } from '../../types/building'
import { formatEquipmentStatus } from '../../lib/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EquipmentFiltersProps {
  buildings: Building[]
  buildingsLoading?: boolean
  buildingsError?: string | null
  buildingId: string
  status: string
  onBuildingChange: (buildingId: string) => void
  onStatusChange: (status: string) => void
  disabled?: boolean
}

function FilterSelect({
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <label className="relative min-w-[150px] flex-1">
      <span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-10 w-full appearance-none rounded-xl border border-line bg-panel py-2 pr-9 pl-3 text-sm font-medium text-ink outline-none transition hover:border-muted-foreground/30 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 bottom-3 size-4 text-muted-foreground"
        strokeWidth={1.9}
      />
    </label>
  )
}

export function EquipmentFilters({
  buildings,
  buildingsLoading = false,
  buildingsError = null,
  buildingId,
  status,
  onBuildingChange,
  onStatusChange,
  disabled = false,
}: EquipmentFiltersProps) {
  const buildingOptionsDisabled = disabled || buildingsLoading || Boolean(buildingsError)

  return (
    <div className="space-y-2">
      <Card className="shadow-card ring-line/80" role="group" aria-label="Equipment filters">
        <CardContent className="flex flex-wrap items-end gap-3 pt-4">
          <FilterSelect
            label="Building"
            value={buildingId}
            onChange={onBuildingChange}
            disabled={buildingOptionsDisabled}
          >
            <option value="">
              {buildingsLoading
                ? 'Loading buildings…'
                : buildingsError
                  ? 'Buildings unavailable'
                  : buildings.length === 0
                    ? 'No buildings found'
                    : 'All buildings'}
            </option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
                {building.location ? ` — ${building.location}` : ''}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            label="Time range"
            value="unavailable"
            onChange={() => undefined}
            disabled
          >
            <option value="unavailable">Coming soon</option>
          </FilterSelect>

          <FilterSelect
            label="Systems"
            value="unavailable"
            onChange={() => undefined}
            disabled
          >
            <option value="unavailable">Coming soon</option>
          </FilterSelect>

          <FilterSelect
            label="Status"
            value={status}
            onChange={onStatusChange}
            disabled={disabled}
          >
            <option value="">All statuses</option>
            {EQUIPMENT_STATUSES.map((value: EquipmentStatus) => (
              <option key={value} value={value}>
                {formatEquipmentStatus(value)}
              </option>
            ))}
          </FilterSelect>

          <Button
            type="button"
            variant="outline"
            className="h-10"
            disabled
            title="More filters are coming soon"
          >
            <SlidersHorizontal />
            More filters
            <Badge variant="secondary" className="rounded-full">
              Soon
            </Badge>
          </Button>
        </CardContent>
      </Card>

      {buildingsError ? (
        <p className="text-xs text-rose-600 dark:text-rose-300" role="alert">
          Could not load buildings: {buildingsError}
        </p>
      ) : null}

      {!buildingsLoading && !buildingsError && buildings.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No buildings are available yet.
        </p>
      ) : null}
    </div>
  )
}

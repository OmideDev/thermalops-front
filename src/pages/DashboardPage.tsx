import { useEffect, useMemo, useState } from 'react'
import { Building2, CalendarDays } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ActiveUnitPanel } from '../components/dashboard/ActiveUnitPanel'
import { EquipmentHealthCard } from '../components/dashboard/EquipmentHealthCard'
import { EquipmentStatusCard } from '../components/dashboard/EquipmentStatusCard'
import { KpiCards } from '../components/dashboard/KpiCards'
import { SystemStatusCard } from '../components/dashboard/SystemStatusCard'
import { EquipmentFilters } from '../components/equipment/EquipmentFilters'
import { EquipmentTable } from '../components/equipment/EquipmentTable'
import { Badge } from '../components/ui/badge'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { buildingNameMap, useBuildings } from '../hooks/useBuildings'
import { useEquipmentList } from '../hooks/useEquipmentList'
import { countByStatus, greetingForHour } from '../lib/health'
import {
  EQUIPMENT_STATUSES,
  type Equipment,
  type EquipmentListFilters,
  type EquipmentStatus,
} from '../types/equipment'

function parseStatus(value: string | null): EquipmentStatus | undefined {
  if (!value) {
    return undefined
  }
  return EQUIPMENT_STATUSES.includes(value as EquipmentStatus)
    ? (value as EquipmentStatus)
    : undefined
}

function formatDashboardDate(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const buildingId = searchParams.get('building_id') ?? ''
  const statusParam = searchParams.get('status') ?? ''
  const status = parseStatus(statusParam)

  const filters: EquipmentListFilters = useMemo(
    () => ({
      buildingId: buildingId || undefined,
      status,
    }),
    [buildingId, status],
  )

  const [retryToken, setRetryToken] = useState(0)
  const { data, loading, error } = useEquipmentList(filters, retryToken)
  const {
    buildings,
    loading: buildingsLoading,
    error: buildingsError,
  } = useBuildings(retryToken)
  const buildingsById = useMemo(() => buildingNameMap(buildings), [buildings])
  const [selected, setSelected] = useState<Equipment | null>(null)

  useEffect(() => {
    if (data.length === 0) {
      setSelected(null)
      return
    }

    setSelected((current) => {
      if (current && data.some((item) => item.id === current.id)) {
        return current
      }
      return data[0] ?? null
    })
  }, [data])

  function updateFilter(key: 'building_id' | 'status', value: string) {
    const next = new URLSearchParams(searchParams)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    setSearchParams(next, { replace: true })
  }

  const runningCount = countByStatus(data, 'running')
  const faultCount = countByStatus(data, 'fault')
  const offlineCount = countByStatus(data, 'offline')
  const isFiltered = Boolean(buildingId || status)
  const selectedBuildingName = buildingId
    ? buildingsById.get(buildingId) ?? null
    : null

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 xl:flex-row xl:items-start">
      <div className="min-w-0 flex-1 space-y-6 overflow-hidden">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-[1.85rem]">
                {greetingForHour()}, OMID
              </h1>
              {isFiltered ? (
                <Badge variant="secondary" className="rounded-full">
                  Filtered view
                </Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" strokeWidth={1.9} />
                {formatDashboardDate()}
              </span>
              {selectedBuildingName ? (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="size-4" strokeWidth={1.9} />
                  {selectedBuildingName}
                </span>
              ) : (
                <span>Facility overview for the equipment currently loaded</span>
              )}
            </div>
          </div>
        </header>

        <EquipmentFilters
          buildings={buildings}
          buildingsLoading={buildingsLoading}
          buildingsError={buildingsError}
          buildingId={buildingId}
          status={status ?? ''}
          onBuildingChange={(value) => updateFilter('building_id', value)}
          onStatusChange={(value) => updateFilter('status', value)}
          disabled={loading && data.length === 0}
        />

        {loading ? <LoadingState label="Loading equipment…" /> : null}

        {!loading && error ? (
          <ErrorState
            message={error}
            onRetry={() => setRetryToken((value) => value + 1)}
          />
        ) : null}

        {!loading && !error && data.length === 0 ? (
          <EmptyState
            title="No equipment to show"
            description={
              buildingId || status
                ? 'Nothing matches the current filters. Clear a filter to broaden the view.'
                : 'Add equipment records to start monitoring this facility.'
            }
          />
        ) : null}

        {!loading && !error && data.length > 0 ? (
          <>
            <KpiCards
              totalUnits={data.length}
              runningCount={runningCount}
              faultCount={faultCount}
              offlineCount={offlineCount}
              isFiltered={isFiltered}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              <EquipmentStatusCard items={data} />
              <SystemStatusCard items={data} />
              <div className="lg:col-span-2 2xl:col-span-1">
                <EquipmentHealthCard items={data} />
              </div>
            </div>

            <EquipmentTable
              items={data}
              buildingsById={buildingsById}
              selectedId={selected?.id}
              onSelect={setSelected}
            />
          </>
        ) : null}
      </div>

      <aside className="w-full min-w-0 shrink-0 space-y-4 xl:sticky xl:top-20 xl:max-w-[340px] xl:flex-[0_0_340px]">
        <ActiveUnitPanel
          equipment={selected}
          buildingName={
            selected ? buildingsById.get(selected.building_id) ?? null : null
          }
        />
      </aside>
    </div>
  )
}

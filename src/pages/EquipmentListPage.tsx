import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EquipmentFilters } from '../components/equipment/EquipmentFilters'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { buildingNameMap, useBuildings } from '../hooks/useBuildings'
import { useEquipmentList } from '../hooks/useEquipmentList'
import {
  formatDateTime,
  formatEquipmentType,
  shortId,
} from '../lib/format'
import {
  EQUIPMENT_STATUSES,
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

export function EquipmentListPage() {
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

  function updateFilter(key: 'building_id' | 'status', value: string) {
    const next = new URLSearchParams(searchParams)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    setSearchParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Equipment</h1>
        <p className="text-sm text-muted-foreground">
          Browse and filter facility equipment across your buildings.
        </p>
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
          title="No equipment found"
          description={
            buildingId || status
              ? 'Nothing matches the current filters. Clear a filter to broaden the list.'
              : 'Add equipment records to populate this inventory.'
          }
        />
      ) : null}

      {!loading && !error && data.length > 0 ? (
        <Card className="overflow-hidden shadow-card ring-line/80">
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b">
            <div>
              <CardTitle className="text-sm font-semibold">All equipment</CardTitle>
              <CardDescription>
                {data.length} unit{data.length === 1 ? '' : 's'} in the current view
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Building</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-line last:border-0 transition hover:bg-soft/80"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/equipment/${item.id}`}
                          className="font-semibold text-brand hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p
                          className="mt-0.5 font-mono text-[11px] text-muted-foreground"
                          title={item.id}
                        >
                          {shortId(item.id, 8).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatEquipmentType(item.equipment_type)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground" title={item.building_id}>
                        {buildingsById.get(item.building_id) ?? 'Unknown building'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDateTime(item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

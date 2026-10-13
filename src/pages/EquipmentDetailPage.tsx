import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { buildingNameMap, useBuildings } from '../hooks/useBuildings'
import { useEquipmentDetail } from '../hooks/useEquipmentDetail'
import {
  formatDateTime,
  formatEquipmentType,
} from '../lib/format'

export function EquipmentDetailPage() {
  const { equipmentId } = useParams<{ equipmentId: string }>()
  const { data, loading, error, notFound } = useEquipmentDetail(equipmentId)
  const { buildings, loading: buildingsLoading } = useBuildings()
  const buildingsById = useMemo(() => buildingNameMap(buildings), [buildings])

  const buildingName = data
    ? buildingsById.get(data.building_id) ?? null
    : null

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Button asChild variant="ghost" className="w-fit px-0 text-muted-foreground hover:text-brand">
        <Link to="/equipment">
          <ArrowLeft />
          Back to equipment
        </Link>
      </Button>

      {loading ? <LoadingState label="Loading equipment details…" /> : null}

      {!loading && notFound ? (
        <EmptyState
          title="Equipment not found"
          description="This equipment is not available. Return to the list and choose another unit."
        />
      ) : null}

      {!loading && error && !notFound ? (
        <ErrorState title="Unable to load equipment" message={error} />
      ) : null}

      {!loading && data ? (
        <Card className="shadow-card ring-line/80">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 border-b">
            <div>
              <CardDescription className="text-[11px] font-bold tracking-[0.12em] uppercase">
                Equipment record
              </CardDescription>
              <CardTitle className="mt-1 text-2xl font-bold tracking-tight text-ink">
                {data.name}
              </CardTitle>
            </div>
            <StatusBadge status={data.status} />
          </CardHeader>

          <CardContent className="pt-5">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-soft px-4 py-3">
                <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Type
                </dt>
                <dd className="mt-1 font-semibold text-ink">
                  {formatEquipmentType(data.equipment_type)}
                </dd>
              </div>
              <div className="rounded-xl bg-soft px-4 py-3">
                <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Status
                </dt>
                <dd className="mt-1 font-semibold text-ink">{data.status}</dd>
              </div>
              <div className="rounded-xl bg-soft px-4 py-3">
                <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Building
                </dt>
                <dd className="mt-1 font-semibold text-ink">
                  {buildingsLoading && !buildingName
                    ? 'Loading building…'
                    : (buildingName ?? 'Unknown building')}
                </dd>
              </div>
              <div className="rounded-xl bg-soft px-4 py-3">
                <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Building ID
                </dt>
                <dd className="mt-1 font-mono text-sm text-ink" title={data.building_id}>
                  {data.building_id}
                </dd>
              </div>
              <div className="rounded-xl bg-soft px-4 py-3">
                <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Equipment ID
                </dt>
                <dd className="mt-1 font-mono text-sm text-ink" title={data.id}>
                  {data.id}
                </dd>
              </div>
              <div className="rounded-xl bg-soft px-4 py-3">
                <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Created
                </dt>
                <dd className="mt-1 font-semibold text-ink">
                  {formatDateTime(data.created_at)}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-sm text-muted-foreground">
              This page shows inventory fields available today. Telemetry, alarms, and work
              orders will be added in later phases.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

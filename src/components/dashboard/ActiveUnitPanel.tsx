import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Equipment } from '../../types/equipment'
import {
  formatDateTime,
  formatEquipmentStatus,
  formatEquipmentType,
  shortId,
} from '../../lib/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '../ui/StatusBadge'

interface ActiveUnitPanelProps {
  equipment: Equipment | null
  buildingName?: string | null
}

export function ActiveUnitPanel({ equipment, buildingName }: ActiveUnitPanelProps) {
  if (!equipment) {
    return (
      <Card className="shadow-card ring-line/80">
        <CardHeader>
          <CardTitle className="text-sm">Selected equipment</CardTitle>
          <CardDescription>
            Choose a row from the equipment list to review its details here.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="shadow-card ring-line/80">
      <CardHeader className="gap-3 border-b bg-soft/60">
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status={equipment.status} />
          <Badge variant="outline" className="rounded-full">
            Overview
          </Badge>
        </div>
        <div>
          <CardTitle className="text-lg font-bold tracking-tight text-ink">
            {equipment.name}
          </CardTitle>
          <CardDescription className="mt-1">
            {formatEquipmentType(equipment.equipment_type)}
            {' · '}
            {buildingName ?? 'Unknown building'}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {['Overview', 'Performance', 'Maintenance', 'Documents'].map((tab, index) => (
            <Badge
              key={tab}
              variant={index === 0 ? 'default' : 'outline'}
              className={
                index === 0
                  ? 'rounded-full'
                  : 'rounded-full cursor-not-allowed opacity-60'
              }
              title={index === 0 ? undefined : 'Coming soon'}
            >
              {tab}
              {index !== 0 ? ' · Soon' : ''}
            </Badge>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-2.5">
          {[
            {
              label: 'Equipment ID',
              value: shortId(equipment.id, 8).toUpperCase(),
              mono: true,
              title: equipment.id,
            },
            {
              label: 'Status',
              value: formatEquipmentStatus(equipment.status),
            },
            {
              label: 'Type',
              value: formatEquipmentType(equipment.equipment_type),
            },
            {
              label: 'Created',
              value: formatDateTime(equipment.created_at),
            },
          ].map((field) => (
            <div key={field.label} className="rounded-xl bg-soft px-3 py-2.5">
              <dt className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                {field.label}
              </dt>
              <dd
                className={
                  field.mono
                    ? 'mt-0.5 font-mono text-xs font-semibold text-ink'
                    : 'mt-0.5 text-xs font-semibold text-ink'
                }
                title={field.title}
              >
                {field.value}
              </dd>
            </div>
          ))}
          <div className="col-span-2 rounded-xl bg-soft px-3 py-2.5">
            <dt className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              Building
            </dt>
            <dd className="mt-0.5 text-xs font-semibold text-ink">
              {buildingName ?? 'Unknown building'}
            </dd>
          </div>
        </dl>

        <Separator />

        <p className="rounded-xl border border-dashed border-line bg-soft/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          Live telemetry such as temperature, fan speed, and runtime will appear here
          when sensor data is connected.
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t bg-transparent">
        <Button asChild className="w-full" size="lg">
          <Link to={`/equipment/${equipment.id}`}>
            View full details
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled
          title="Work orders are coming soon"
        >
          <Plus />
          Create work order
          <Badge variant="secondary" className="ml-1 rounded-full">
            Soon
          </Badge>
        </Button>
      </CardFooter>
    </Card>
  )
}

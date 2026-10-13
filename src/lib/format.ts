import type { EquipmentStatus, EquipmentType } from '../types/equipment'

export function formatEquipmentType(type: EquipmentType): string {
  const labels: Record<EquipmentType, string> = {
    ahu: 'AHU',
    chiller: 'Chiller',
    boiler: 'Boiler',
    pump: 'Pump',
    cooling_tower: 'Cooling tower',
    other: 'Other',
  }
  return labels[type]
}

export function formatEquipmentStatus(status: EquipmentStatus): string {
  const labels: Record<EquipmentStatus, string> = {
    running: 'Running',
    stopped: 'Stopped',
    fault: 'Fault',
    maintenance: 'Maintenance',
    offline: 'Offline',
  }
  return labels[status]
}

/** Shorten UUIDs for UI labels until a buildings API exists. */
export function shortId(id: string, size = 8): string {
  return id.slice(0, size)
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

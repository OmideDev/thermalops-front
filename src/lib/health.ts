import type { Equipment, EquipmentStatus } from '../types/equipment'

/** Deterministic demo health score derived from status until telemetry exists. */
export function healthFromStatus(status: EquipmentStatus): number {
  switch (status) {
    case 'running':
      return 92
    case 'maintenance':
      return 78
    case 'stopped':
      return 64
    case 'offline':
      return 41
    case 'fault':
      return 28
  }
}

export function healthTone(score: number): 'good' | 'warn' | 'bad' {
  if (score >= 80) return 'good'
  if (score >= 55) return 'warn'
  return 'bad'
}

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function countByStatus(items: Equipment[], status: EquipmentStatus) {
  return items.filter((item) => item.status === status).length
}

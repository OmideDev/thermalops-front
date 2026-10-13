/** Mirrors backend EquipmentType enum values. */
export type EquipmentType =
  | 'ahu'
  | 'chiller'
  | 'boiler'
  | 'pump'
  | 'cooling_tower'
  | 'other'

/** Mirrors backend EquipmentStatus enum values. */
export type EquipmentStatus =
  | 'running'
  | 'stopped'
  | 'fault'
  | 'maintenance'
  | 'offline'

/** Mirrors EquipmentResponse from the FastAPI schema. */
export interface Equipment {
  id: string
  building_id: string
  name: string
  equipment_type: EquipmentType
  status: EquipmentStatus
  created_at: string
}

export interface EquipmentListFilters {
  buildingId?: string
  status?: EquipmentStatus
}

export const EQUIPMENT_STATUSES: EquipmentStatus[] = [
  'running',
  'stopped',
  'fault',
  'maintenance',
  'offline',
]

export const EQUIPMENT_TYPES: EquipmentType[] = [
  'ahu',
  'chiller',
  'boiler',
  'pump',
  'cooling_tower',
  'other',
]

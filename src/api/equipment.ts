import { apiGet } from './client'
import type { Equipment, EquipmentListFilters } from '../types/equipment'

function buildListQuery(filters: EquipmentListFilters = {}): string {
  const params = new URLSearchParams()

  if (filters.buildingId) {
    params.set('building_id', filters.buildingId)
  }
  if (filters.status) {
    params.set('status', filters.status)
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

export function listEquipment(
  filters: EquipmentListFilters = {},
  signal?: AbortSignal,
): Promise<Equipment[]> {
  return apiGet<Equipment[]>(`/api/v1/equipment${buildListQuery(filters)}`, signal)
}

export function getEquipment(
  equipmentId: string,
  signal?: AbortSignal,
): Promise<Equipment> {
  return apiGet<Equipment>(`/api/v1/equipment/${equipmentId}`, signal)
}

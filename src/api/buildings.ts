import { apiGet } from './client'
import type { Building } from '../types/building'

export function listBuildings(signal?: AbortSignal): Promise<Building[]> {
  return apiGet<Building[]>('/api/v1/buildings/', signal)
}

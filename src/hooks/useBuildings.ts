import { useEffect, useState } from 'react'
import { listBuildings } from '../api/buildings'
import { ApiError } from '../api/client'
import type { Building } from '../types/building'

interface UseBuildingsResult {
  buildings: Building[]
  loading: boolean
  error: string | null
}

export function useBuildings(retryToken = 0): UseBuildingsResult {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setLoading(true)
    setError(null)

    listBuildings(controller.signal)
      .then((items) => {
        if (!active) return
        setBuildings(items)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return
        if (err instanceof ApiError) {
          setError(err.message)
        } else if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Unable to load buildings')
        }
        setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [retryToken])

  return { buildings, loading, error }
}

export function buildingNameMap(buildings: Building[]): Map<string, string> {
  return new Map(buildings.map((building) => [building.id, building.name]))
}

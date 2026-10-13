import { useEffect, useState } from 'react'
import { listEquipment } from '../api/equipment'
import { ApiError } from '../api/client'
import type { Equipment, EquipmentListFilters } from '../types/equipment'

interface EquipmentListState {
  data: Equipment[]
  loading: boolean
  error: string | null
}

export function useEquipmentList(
  filters: EquipmentListFilters,
  refreshKey = 0,
) {
  const buildingId = filters.buildingId
  const status = filters.status
  const [state, setState] = useState<EquipmentListState>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    const requestFilters: EquipmentListFilters = {
      buildingId,
      status,
    }

    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }))

    listEquipment(requestFilters, controller.signal)
      .then((data) => {
        setState({ data, loading: false, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        const message =
          error instanceof ApiError
            ? error.message
            : 'Unable to load equipment from the API.'

        setState({ data: [], loading: false, error: message })
      })

    return () => controller.abort()
  }, [buildingId, status, refreshKey])

  return state
}

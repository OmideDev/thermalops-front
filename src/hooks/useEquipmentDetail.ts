import { useEffect, useState } from 'react'
import { getEquipment } from '../api/equipment'
import { ApiError } from '../api/client'
import type { Equipment } from '../types/equipment'

interface EquipmentDetailState {
  data: Equipment | null
  loading: boolean
  error: string | null
  notFound: boolean
}

export function useEquipmentDetail(equipmentId: string | undefined) {
  const [state, setState] = useState<EquipmentDetailState>({
    data: null,
    loading: true,
    error: null,
    notFound: false,
  })

  useEffect(() => {
    if (!equipmentId) {
      setState({
        data: null,
        loading: false,
        error: 'Missing equipment id.',
        notFound: true,
      })
      return
    }

    const controller = new AbortController()

    setState({
      data: null,
      loading: true,
      error: null,
      notFound: false,
    })

    getEquipment(equipmentId, controller.signal)
      .then((data) => {
        setState({ data, loading: false, error: null, notFound: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        if (error instanceof ApiError && error.status === 404) {
          setState({
            data: null,
            loading: false,
            error: 'Equipment not found.',
            notFound: true,
          })
          return
        }

        const message =
          error instanceof ApiError
            ? error.message
            : 'Unable to load this equipment record.'

        setState({
          data: null,
          loading: false,
          error: message,
          notFound: false,
        })
      })

    return () => controller.abort()
  }, [equipmentId])

  return state
}

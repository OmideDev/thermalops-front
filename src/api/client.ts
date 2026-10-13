/**
 * Shared HTTP helpers for talking to the ThermalOps FastAPI backend.
 *
 * In development, leave VITE_API_BASE_URL empty so requests go to the
 * Vite proxy (same origin). In production, set it to the API origin.
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
  /\/$/,
  '',
) ?? ''

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    let detail = `Request failed (${response.status})`
    try {
      const body = (await response.json()) as { detail?: string }
      if (typeof body.detail === 'string') {
        detail = body.detail
      }
    } catch {
      // Keep the generic status message when the body is not JSON.
    }
    throw new ApiError(detail, response.status)
  }

  return (await response.json()) as T
}

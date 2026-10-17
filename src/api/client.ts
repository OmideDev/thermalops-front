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

function detailFromBody(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') {
    return fallback
  }

  const detail = (body as { detail?: unknown }).detail
  if (typeof detail === 'string' && detail.trim()) {
    return detail
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: unknown }
    if (typeof first?.msg === 'string' && first.msg.trim()) {
      return first.msg
    }
  }

  return fallback
}

async function parseError(response: Response): Promise<ApiError> {
  const fallback = `Request failed (${response.status})`
  try {
    const body: unknown = await response.json()
    return new ApiError(detailFromBody(body, fallback), response.status)
  } catch {
    return new ApiError(fallback, response.status)
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
    throw await parseError(response)
  }

  return (await response.json()) as T
}

/**
 * JSON POST helper. Does not apply a short client timeout — callers that need
 * cancellation should pass an AbortSignal (e.g. user cancel). Local assistant
 * generation may take well over 90 seconds.
 */
export async function apiPost<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  return (await response.json()) as T
}

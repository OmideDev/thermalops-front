/** Mirrors BuildingResponse from the FastAPI schema. */
export interface Building {
  id: string
  organization_id: string
  name: string
  location: string | null
  timezone: string
  created_at: string
}

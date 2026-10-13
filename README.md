# ThermalOps Frontend

Phase 1 React + TypeScript UI for the ThermalOps HVAC operations API.

## Stack

- Vite
- React 19
- TypeScript
- React Router

## Features

- Equipment dashboard fed by `GET /api/v1/equipment/`
- Building and status filters via FastAPI query parameters
- Equipment detail page via `GET /api/v1/equipment/{id}`
- Light / dark themes
- Loading, empty, and error states

No fabricated telemetry, alerts, or AI answers are shown.

## Develop

From the `frontend` directory:

```powershell
npm install
npm run dev
```

Keep the FastAPI backend running on `http://127.0.0.1:8000`.

Vite proxies `/api` and `/health` to that origin during development.

Optional `.env` (see `.env.example`):

```env
VITE_API_BASE_URL=
```

Leave empty for the Vite proxy. Set an absolute API origin only when the UI is served separately from the API.

## Build

```powershell
npm run build
npm run preview
```

## Extensibility

Route/nav placeholders exist for future Assistant, Maps, and visualization work. Keep new API clients under `src/api/` and feature pages under `src/pages/`.

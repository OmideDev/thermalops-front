import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { useTheme } from './hooks/useTheme'
import { DashboardPage } from './pages/DashboardPage'
import { EquipmentDetailPage } from './pages/EquipmentDetailPage'
import { EquipmentListPage } from './pages/EquipmentListPage'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={<AppShell theme={theme} onToggleTheme={toggleTheme} />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="equipment" element={<EquipmentListPage />} />
          <Route path="equipment/:equipmentId" element={<EquipmentDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import type { ThemeMode } from '../../hooks/useTheme'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

interface AppShellProps {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function AppShell({ theme, onToggleTheme }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface text-ink">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onNavigate={() => setMobileNavOpen(false)}
      />

      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenNav={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

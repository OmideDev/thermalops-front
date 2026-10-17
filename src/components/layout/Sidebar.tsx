import {
  BarChart3,
  Brain,
  Building2,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Wrench,
  Zap,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const primaryNav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/buildings', label: 'Buildings', icon: Building2, soon: true },
  { to: '/equipment', label: 'Equipment', icon: Wrench, end: false },
  { to: '/operations', label: 'Operations', icon: ClipboardList, soon: true },
  { to: '/energy', label: 'Energy', icon: Zap, soon: true },
  { to: '/ai', label: 'AI Insights', icon: Brain, end: true },
  { to: '/work-orders', label: 'Work Orders', icon: ClipboardList, soon: true },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, soon: true },
  { to: '/reports', label: 'Reports', icon: FileText, soon: true },
] as const

const systemNav = [
  { label: 'Settings', icon: Settings },
  { label: 'Help & Support', icon: HelpCircle },
] as const

interface SidebarProps {
  mobileOpen?: boolean
  onNavigate?: () => void
}

export function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-screen w-[min(100vw-3rem,248px)] shrink-0 flex-col border-r border-line bg-panel transition-transform duration-200 lg:static lg:z-auto lg:w-[248px] lg:translate-x-0',
        mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0',
      )}
    >
      <div className="flex items-center gap-3 border-b border-line px-5 py-5">
        <span
          className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-sm"
          aria-hidden="true"
        >
          <Zap className="size-4" strokeWidth={2.4} />
        </span>
        <div>
          <p className="text-[15px] font-bold tracking-tight text-ink">ThermalOps</p>
          <p className="text-[11px] font-medium text-muted-foreground">HVAC Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        <ul className="space-y-0.5">
          {primaryNav.map((item) => {
            const Icon = item.icon
            if ('soon' in item && item.soon) {
              return (
                <li key={item.label}>
                  <span
                    className="flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground/70"
                    title="Coming soon"
                  >
                    <Icon className="size-4 shrink-0" strokeWidth={1.9} />
                    <span className="flex-1">{item.label}</span>
                    <Badge variant="secondary" className="rounded-full px-1.5 text-[9px]">
                      Soon
                    </Badge>
                  </span>
                </li>
              )
            }

            return (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                      isActive
                        ? 'border-l-[3px] border-brand bg-brand-soft pl-[9px] text-brand'
                        : 'text-muted-foreground hover:bg-soft hover:text-ink',
                    )
                  }
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.9} />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <p className="mb-1 mt-6 px-3 text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
          System
        </p>
        <ul className="space-y-0.5">
          {systemNav.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.label}>
                <span
                  className="flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground"
                  title="Coming soon"
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.9} />
                  <span className="flex-1">{item.label}</span>
                  <Badge variant="secondary" className="rounded-full px-1.5 text-[9px]">
                    Soon
                  </Badge>
                </span>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="hidden border-t border-line p-3 sm:block">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white shadow-card">
          <div
            className="h-16 bg-cover bg-center opacity-80"
            style={{
              backgroundImage:
                'linear-gradient(120deg, rgba(37,99,235,0.55), rgba(15,23,42,0.35)), url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=60)',
            }}
          />
          <div className="space-y-1 p-3">
            <p className="text-[12px] font-semibold leading-snug">
              Smarter buildings.
              <br />
              Healthier people.
            </p>
            <p className="text-[10px] text-slate-300">ThermalOps Platform</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

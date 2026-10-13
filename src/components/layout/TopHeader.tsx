import { Bell, Menu, Search, User } from 'lucide-react'
import type { ThemeMode } from '../../hooks/useTheme'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '../ui/ThemeToggle'

interface TopHeaderProps {
  theme: ThemeMode
  onToggleTheme: () => void
  onOpenNav?: () => void
}

export function TopHeader({ theme, onToggleTheme, onOpenNav }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-line bg-panel/90 px-3 backdrop-blur-md sm:gap-4 sm:px-6">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0 lg:hidden"
        aria-label="Open navigation"
        onClick={onOpenNav}
      >
        <Menu />
      </Button>

      <label className="relative min-w-0 flex-1 sm:mx-auto sm:max-w-xl">
        <span className="sr-only">Search (coming soon)</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.9}
        />
        <input
          type="search"
          placeholder="Search equipment and buildings"
          disabled
          className="h-10 w-full cursor-not-allowed rounded-xl border border-line bg-surface pr-20 pl-10 text-sm text-muted-foreground outline-none"
          title="Search is coming soon"
        />
        <Badge
          variant="secondary"
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full"
        >
          Soon
        </Badge>
      </label>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled
          aria-label="Notifications (coming soon)"
          title="Notifications are coming soon"
        >
          <Bell />
        </Button>

        <div className="flex items-center gap-2 rounded-xl border border-line bg-panel py-1.5 pr-2 pl-1.5 sm:gap-2.5 sm:pr-3">
          <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand">
            <User className="size-4" strokeWidth={2} />
          </span>
          <div className="hidden leading-tight min-[420px]:block">
            <p className="text-[13px] font-semibold text-ink">OMID</p>
            <p className="hidden text-[11px] text-muted-foreground sm:block">
              Facilities Manager
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

import { Moon, Sun } from 'lucide-react'
import type { ThemeMode } from '../../hooks/useTheme'
import { Button } from '@/components/ui/button'

interface ThemeToggleProps {
  theme: ThemeMode
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const next = theme === 'light' ? 'dark' : 'light'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  )
}

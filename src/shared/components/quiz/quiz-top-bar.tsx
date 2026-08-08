import { Moon, Sun, User2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '@/app/providers/theme-provider'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

type QuizTopBarProps = {
  className?: string
  showAdminLink?: boolean
}

export function QuizTopBar({
  className,
  showAdminLink = true,
}: QuizTopBarProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-end gap-2 px-4 pt-4 pb-2',
        className,
      )}
    >
      {showAdminLink ? (
        <Button
          asChild
          variant="secondary"
          size="icon"
          className="size-10 cursor-pointer rounded-full border border-border/70"
        >
          <Link to="/admin/login" aria-label="Área administrativa" title="Área administrativa">
            <User2 className="size-4 text-primary" />
          </Link>
        </Button>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={toggleTheme}
        className="size-10 cursor-pointer rounded-full border border-border/70"
        aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        title={isDark ? 'Tema claro' : 'Tema escuro'}
      >
        {isDark ? (
          <Sun className="size-4 text-primary" />
        ) : (
          <Moon className="size-4 text-primary" />
        )}
      </Button>
    </header>
  )
}

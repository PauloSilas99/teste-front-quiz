import { Link, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/features/auth'
import { useTheme } from '@/app/providers/theme-provider'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  function handleLogout() {
    logout()
    void navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
            <Link
              to="/admin/leads"
              className="truncate font-semibold tracking-tight text-foreground"
            >
              <span className="sm:hidden">Admin</span>
              <span className="hidden sm:inline">Admin · Quiz ENEM</span>
            </Link>
            <nav className="hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
              <Link
                to="/admin/leads"
                className="transition-colors hover:text-primary"
              >
                Leads
              </Link>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {user?.email ? (
              <span className="hidden max-w-[10rem] truncate text-sm text-muted-foreground md:inline lg:max-w-xs">
                {user.email}
              </span>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={toggleTheme}
              className="size-9 cursor-pointer rounded-full border border-border/70"
              aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {isDark ? (
                <Sun className="size-4 text-primary" />
              ) : (
                <Moon className="size-4 text-primary" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 px-2.5 sm:px-3"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>
      <Separator className="opacity-40" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  )
}

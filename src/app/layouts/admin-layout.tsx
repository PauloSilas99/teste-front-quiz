import { Link, Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    void navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border/70 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              to="/admin/leads"
              className="font-semibold tracking-tight text-foreground"
            >
              Admin · Quiz ENEM
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                to="/admin/leads"
                className="transition-colors hover:text-primary"
              >
                Leads
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user?.email ? (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
            ) : null}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <Separator className="opacity-40" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

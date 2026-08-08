import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}

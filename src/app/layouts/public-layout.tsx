import { Outlet } from 'react-router-dom'
import { QuizShell } from '@/shared/components/quiz'

export function PublicLayout() {
  return (
    <QuizShell>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </QuizShell>
  )
}

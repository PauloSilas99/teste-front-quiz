import { Outlet } from 'react-router-dom'
import { QuizShell, QuizTopBar } from '@/shared/components/quiz'

export function PublicLayout() {
  return (
    <QuizShell>
      <QuizTopBar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </QuizShell>
  )
}

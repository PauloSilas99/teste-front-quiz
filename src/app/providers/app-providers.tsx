import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth'
import { QuizSessionProvider } from '@/features/quiz/quiz-session-context'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <QuizSessionProvider>{children}</QuizSessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  )
}

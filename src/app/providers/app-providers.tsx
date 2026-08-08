import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  )
}

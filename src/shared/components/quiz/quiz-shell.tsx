import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

type QuizShellProps = {
  children: ReactNode
  className?: string
}

/** Ambient dark canvas shared by the public quiz flow. */
export function QuizShell({ children, className }: QuizShellProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-svh flex-col overflow-hidden bg-background',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--glow),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[120%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,oklch(0.35_0.08_195_/_0.25),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative z-10 flex min-h-svh flex-1 flex-col">
        {children}
      </div>
    </div>
  )
}

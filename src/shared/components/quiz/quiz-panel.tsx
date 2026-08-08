import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'

type QuizPanelProps = {
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footer?: ReactNode
}

/** Elevated glassy card used as the main content vessel in the quiz flow. */
export function QuizPanel({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  footer,
}: QuizPanelProps) {
  return (
    <Card
      className={cn(
        'gap-0 overflow-hidden rounded-3xl border-border/60 bg-card/90 py-0 shadow-[0_20px_60px_oklch(0_0_0_/_0.4)] backdrop-blur-sm',
        className,
      )}
    >
      {title || description ? (
        <CardHeader className={cn('space-y-2 px-6 pt-6 pb-4', headerClassName)}>
          {title ? (
            <CardTitle className="text-xl font-bold tracking-tight text-balance sm:text-2xl">
              {title}
            </CardTitle>
          ) : null}
          {description ? (
            <CardDescription className="text-sm leading-relaxed text-pretty sm:text-base">
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn('px-6 pb-6', contentClassName)}>
        {children}
      </CardContent>
      {footer}
    </Card>
  )
}

import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Progress } from '@/shared/components/ui/progress'

type StepProgressProps = {
  current: number
  total: number
  className?: string
  showLabel?: boolean
}

export function StepProgress({
  current,
  total,
  className,
  showLabel = true,
}: StepProgressProps) {
  const safeTotal = Math.max(total, 1)
  const clamped = Math.min(Math.max(current, 0), safeTotal)
  const percent = Math.round((clamped / safeTotal) * 100)

  return (
    <div className={cn('w-full space-y-3', className)}>
      {showLabel ? (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Pergunta {clamped} de {safeTotal}
          </span>
          <span className="tabular-nums text-muted-foreground">{percent}%</span>
        </div>
      ) : null}

      <Progress value={percent} className="h-2.5 bg-secondary/80" />

      <div className="flex items-center justify-between gap-1" aria-hidden>
        {Array.from({ length: safeTotal }, (_, i) => {
          const step = i + 1
          const done = step < clamped
          const active = step === clamped
          return (
            <span
              key={step}
              className={cn(
                'flex size-3.5 shrink-0 items-center justify-center rounded-md transition-colors sm:size-4',
                done && 'bg-primary text-primary-foreground',
                active && 'bg-primary shadow-[0_0_10px_var(--glow)]',
                !done && !active && 'border border-border bg-transparent',
              )}
            >
              {done ? <Check className="size-2.5" strokeWidth={3} /> : null}
            </span>
          )
        })}
      </div>
    </div>
  )
}

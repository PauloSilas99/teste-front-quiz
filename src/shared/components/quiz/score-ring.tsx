import { cn } from '@/shared/lib/utils'

type ScoreRingProps = {
  /** 0–100; omit for pending/placeholder state */
  score?: number | null
  label?: string
  className?: string
}

export function ScoreRing({
  score,
  label = 'Score',
  className,
}: ScoreRingProps) {
  const value = score == null ? 0 : Math.min(100, Math.max(0, score))
  const display = score == null ? '—' : String(value)
  const circumference = 2 * Math.PI * 52
  const offset = circumference - (value / 100) * circumference

  return (
    <div
      className={cn(
        'relative mx-auto flex size-44 items-center justify-center',
        className,
      )}
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 size-full -rotate-90"
        aria-hidden
      >
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-secondary"
        />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={score == null ? circumference : offset}
          className="text-primary transition-[stroke-dashoffset] duration-700 ease-out drop-shadow-[0_0_12px_var(--glow)]"
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-4xl font-extrabold tabular-nums tracking-tight">
          {display}
        </span>
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  )
}

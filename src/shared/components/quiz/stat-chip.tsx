import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

type StatChipProps = {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}

export function StatChip({ icon: Icon, label, value, className }: StatChipProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl border border-border/70 bg-surface-elevated/90 px-3 py-3 text-center',
        className,
      )}
    >
      <Icon className="size-4 text-primary" aria-hidden />
      <span className="text-lg font-bold tabular-nums tracking-tight text-foreground">
        {value}
      </span>
      <span className="text-[11px] leading-tight text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

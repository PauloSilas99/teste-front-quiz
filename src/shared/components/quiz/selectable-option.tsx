import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

type SelectableOptionProps = {
  label: string
  selected?: boolean
  onSelect?: () => void
  icon?: ReactNode
  disabled?: boolean
  className?: string
}

export function SelectableOption({
  label,
  selected = false,
  onSelect,
  icon,
  disabled,
  className,
}: SelectableOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-[0_8px_28px_var(--glow)] scale-[1.01]'
          : 'border-border/80 bg-surface-elevated text-foreground hover:border-primary/40 hover:bg-accent/40',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {icon ? (
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full',
            selected ? 'bg-primary-foreground/15' : 'bg-secondary',
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="text-pretty leading-snug">{label}</span>
    </button>
  )
}

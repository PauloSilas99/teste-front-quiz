import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

type QuizIconBadgeProps = {
  icon: LucideIcon
  className?: string
  size?: 'md' | 'lg'
}

export function QuizIconBadge({
  icon: Icon,
  className,
  size = 'md',
}: QuizIconBadgeProps) {
  return (
    <div
      className={cn(
        'mx-auto flex items-center justify-center rounded-full border border-primary/30 bg-surface-elevated/80 shadow-[0_0_32px_var(--glow)]',
        size === 'md' ? 'size-16' : 'size-20',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary/15 text-primary',
          size === 'md' ? 'size-12' : 'size-14',
        )}
      >
        <Icon className={size === 'md' ? 'size-6' : 'size-7'} strokeWidth={2} />
      </div>
    </div>
  )
}

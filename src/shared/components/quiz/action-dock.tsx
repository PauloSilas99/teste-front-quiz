import type { ReactNode } from 'react'
import { ChevronsRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

type ActionDockProps = {
  primaryLabel: string
  onPrimary?: () => void
  primaryDisabled?: boolean
  primaryType?: 'button' | 'submit'
  secondary?: ReactNode
  className?: string
}

/**
 * Sticky bottom bar: secondary control + primary CTA (Continue / Submit).
 */
export function ActionDock({
  primaryLabel,
  onPrimary,
  primaryDisabled,
  primaryType = 'button',
  secondary,
  className,
}: ActionDockProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-20 mt-auto border-t border-border/60 bg-background/85 px-4 py-4 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-lg items-center gap-3 rounded-full border border-border/70 bg-surface-elevated p-1.5 pr-1.5 shadow-[var(--shadow-dock)]">
        {secondary ? (
          <div className="shrink-0 pl-1">{secondary}</div>
        ) : (
          <div className="w-2 shrink-0" />
        )}
        <Button
          type={primaryType}
          onClick={onPrimary}
          disabled={primaryDisabled}
          size="lg"
          className="h-12 flex-1 cursor-pointer rounded-full text-base font-semibold tracking-wide shadow-[var(--shadow-cta)]"
        >
          {primaryLabel}
          <ChevronsRight className="size-5 opacity-80" />
        </Button>
      </div>
    </div>
  )
}

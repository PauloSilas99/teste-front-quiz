import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

type CarouselApi = UseEmblaCarouselType[1]

type CarouselContextValue = {
  api: CarouselApi | undefined
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  selectedIndex: number
  scrollSnaps: number[]
  scrollTo: (index: number) => void
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const ctx = useContext(CarouselContext)
  if (!ctx) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return ctx
}

type CarouselProps = {
  children: ReactNode
  className?: string
  opts?: Parameters<typeof useEmblaCarousel>[0]
}

function Carousel({ children, className, opts }: CarouselProps) {
  const [emblaRef, api] = useEmblaCarousel({
    align: 'start',
    loop: false,
    ...opts,
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return
    setCanScrollPrev(carouselApi.canScrollPrev())
    setCanScrollNext(carouselApi.canScrollNext())
    setSelectedIndex(carouselApi.selectedScrollSnap())
  }, [])

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])
  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api],
  )

  useEffect(() => {
    if (!api) return
    setScrollSnaps(api.scrollSnapList())
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api, onSelect])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollNext()
    }
  }

  return (
    <CarouselContext.Provider
      value={{
        api,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        selectedIndex,
        scrollSnaps,
        scrollTo,
      }}
    >
      <div
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        onKeyDownCapture={handleKeyDown}
      >
        <div ref={emblaRef} className="overflow-hidden">
          {children}
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex touch-pan-y', className)}>{children}</div>
  )
}

function CarouselItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
    >
      {children}
    </div>
  )
}

function CarouselPrevious({ className }: { className?: string }) {
  const { canScrollPrev, scrollPrev } = useCarousel()
  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className={cn(
        'size-9 rounded-full border border-border/60 disabled:opacity-40',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Anterior"
    >
      <ChevronLeft className="size-4" />
    </Button>
  )
}

function CarouselNext({ className }: { className?: string }) {
  const { canScrollNext, scrollNext } = useCarousel()
  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className={cn(
        'size-9 rounded-full border border-border/60 disabled:opacity-40',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Próximo"
    >
      <ChevronRight className="size-4" />
    </Button>
  )
}

function CarouselDots({ className }: { className?: string }) {
  const { selectedIndex, scrollSnaps, scrollTo } = useCarousel()
  if (scrollSnaps.length <= 1) return null

  return (
    <div
      className={cn('flex items-center justify-center gap-1.5', className)}
      role="tablist"
      aria-label="Slides"
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === selectedIndex}
          aria-label={`Ir para resposta ${index + 1}`}
          className={cn(
            'h-1.5 rounded-full transition-all',
            index === selectedIndex
              ? 'w-5 bg-primary'
              : 'w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/55',
          )}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  )
}

function CarouselCounter({ className }: { className?: string }) {
  const { selectedIndex, scrollSnaps } = useCarousel()
  if (scrollSnaps.length === 0) return null
  return (
    <p
      className={cn(
        'text-center text-xs font-medium tabular-nums text-muted-foreground',
        className,
      )}
    >
      {selectedIndex + 1} / {scrollSnaps.length}
    </p>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselCounter,
  useCarousel,
}

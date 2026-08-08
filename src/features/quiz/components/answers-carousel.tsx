import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel'
import type { LeadAnswer } from '@/shared/api/types'

type AnswersCarouselProps = {
  answers: LeadAnswer[]
}

export function AnswersCarousel({ answers }: AnswersCarouselProps) {
  if (answers.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Suas respostas
      </p>
      <Carousel className="w-full">
        <CarouselContent>
          {answers.map((answer, index) => (
            <CarouselItem key={answer.id}>
              <article className="flex min-h-[7.5rem] flex-col justify-between gap-3 rounded-2xl border border-border/50 bg-card/60 px-4 py-3.5 text-sm">
                <div className="space-y-2">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="font-medium text-pretty text-foreground">
                    {answer.questionText}
                  </p>
                  <p className="text-pretty text-muted-foreground">
                    {answer.alternativeText}
                  </p>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-3 flex items-center justify-between gap-2">
          <CarouselPrevious />
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <CarouselDots />
            <CarouselCounter />
          </div>
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  )
}

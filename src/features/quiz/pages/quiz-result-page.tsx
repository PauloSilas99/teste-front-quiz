import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Medal, RotateCcw, Sparkles } from 'lucide-react'
import { AnswersCarousel } from '../components/answers-carousel'
import { useQuizSession } from '../quiz-session-context'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  ActionDock,
  QuizIconBadge,
  QuizPanel,
  ScoreRing,
} from '@/shared/components/quiz'

export function QuizResultPage() {
  const navigate = useNavigate()
  const { result, resetSession } = useQuizSession()

  if (!result) {
    return <Navigate to="/" replace />
  }

  function handleAgain() {
    resetSession()
    void navigate('/')
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 pt-10 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6"
        >
          <div className="space-y-4 text-center">
            <QuizIconBadge icon={Medal} size="lg" />
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Seu diagnóstico
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Resultado pronto
              </h1>
            </div>
          </div>

          <ScoreRing score={result.score} label="pontos" />

          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="rounded-full border border-primary/25 bg-primary/15 px-4 py-1.5 text-sm font-semibold text-primary"
            >
              {result.bandLabel}
            </Badge>
          </div>

          <QuizPanel title="O que isso significa" description={result.message}>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/40 p-3 text-sm text-muted-foreground">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-pretty">
                  Faixa{' '}
                  <span className="font-semibold text-foreground">
                    {result.bandLabel}
                  </span>
                  {' · '}
                  {result.score} pontos no diagnóstico.
                </p>
              </div>

              <AnswersCarousel answers={result.answers} />
            </div>
          </QuizPanel>
        </motion.div>
      </div>

      <ActionDock
        primaryLabel="Fazer novamente"
        onPrimary={handleAgain}
        secondary={
          <Button
            asChild
            variant="secondary"
            size="icon"
            className="size-11 rounded-full border border-border/60"
            aria-label="Reiniciar"
          >
            <Link to="/" onClick={() => resetSession()}>
              <RotateCcw className="size-4" />
            </Link>
          </Button>
        }
      />
    </div>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchQuestions } from '@/shared/api'
import { useQuizSession } from '../quiz-session-context'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  ActionDock,
  QuizIconBadge,
  QuizPanel,
  SelectableOption,
  StepProgress,
} from '@/shared/components/quiz'

export function QuizPage() {
  const navigate = useNavigate()
  const { getAnswer, setAnswer } = useQuizSession()
  const [stepIndex, setStepIndex] = useState(0)

  const questionsQuery = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  })

  const questions = questionsQuery.data ?? []
  const total = questions.length
  const question = questions[stepIndex]
  const selectedId = question ? getAnswer(question.id) : undefined
  const isLast = total > 0 && stepIndex === total - 1

  useEffect(() => {
    if (total > 0 && stepIndex >= total) {
      setStepIndex(total - 1)
    }
  }, [total, stepIndex])

  if (questionsQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 pt-8">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="mx-auto size-16 rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    )
  }

  if (questionsQuery.isError || total === 0) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          {questionsQuery.isError
            ? 'Não foi possível carregar as perguntas. Verifique se a API está no ar.'
            : 'Nenhuma pergunta ativa no banco de dados.'}
        </p>
        <Button type="button" variant="secondary" onClick={() => void navigate('/')}>
          Voltar
        </Button>
      </div>
    )
  }

  function handlePrimary() {
    if (!question || !selectedId) return
    if (isLast) {
      void navigate('/captura')
      return
    }
    setStepIndex((i) => i + 1)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 pt-8 pb-4">
        <StepProgress current={stepIndex + 1} total={total} />

        <QuizIconBadge icon={Target} />

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28 }}
          >
            <QuizPanel title={question.title} className="bg-card">
              <div className="flex flex-col gap-2.5">
                {question.alternatives.map((alt) => (
                  <SelectableOption
                    key={alt.id}
                    label={alt.label}
                    selected={selectedId === alt.id}
                    onSelect={() => setAnswer(question.id, alt.id)}
                  />
                ))}
              </div>
            </QuizPanel>
          </motion.div>
        </AnimatePresence>
      </div>

      <ActionDock
        primaryLabel={isLast ? 'Continuar' : 'Próxima'}
        primaryDisabled={!selectedId}
        onPrimary={handlePrimary}
        secondary={
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-11 rounded-full border border-border/60"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            aria-label="Pergunta anterior"
          >
            <ChevronLeft className="size-5" />
          </Button>
        }
      />
    </div>
  )
}

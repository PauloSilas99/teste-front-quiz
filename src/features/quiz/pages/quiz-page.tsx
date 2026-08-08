import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Target } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import {
  ActionDock,
  QuizIconBadge,
  QuizPanel,
  SelectableOption,
  StepProgress,
} from '@/shared/components/quiz'

const PLACEHOLDER_OPTIONS = [
  'Estou no 1º ou 2º ano do ensino médio',
  'Estou no 3º ano',
  'Já terminei o ensino médio e estudo por conta',
  'Já terminei e faço cursinho',
]

const TOTAL_QUESTIONS = 10

export function QuizPage() {
  const navigate = useNavigate()
  const [current] = useState(1)
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 pt-8 pb-4">
        <StepProgress current={current} total={TOTAL_QUESTIONS} />

        <QuizIconBadge icon={Target} />

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28 }}
          >
            <QuizPanel
              title="Em que etapa dos estudos você está?"
              description="As perguntas virão do backend. Esta é uma prévia visual da experiência."
              className="bg-card"
            >
              <div className="flex flex-col gap-2.5">
                {PLACEHOLDER_OPTIONS.map((label, index) => (
                  <SelectableOption
                    key={label}
                    label={label}
                    selected={selected === index}
                    onSelect={() => setSelected(index)}
                  />
                ))}
              </div>
            </QuizPanel>
          </motion.div>
        </AnimatePresence>
      </div>

      <ActionDock
        primaryLabel="Continuar"
        primaryDisabled={selected === null}
        onPrimary={() => {
          void navigate('/captura')
        }}
        secondary={
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-11 rounded-full border border-border/60"
            disabled
            aria-label="Pergunta anterior"
          >
            <ChevronLeft className="size-5" />
          </Button>
        }
      />
    </div>
  )
}

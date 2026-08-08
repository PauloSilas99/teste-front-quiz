import { motion } from 'framer-motion'
import { ClipboardList, Clock3, Target, Trophy } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import {
  ActionDock,
  QuizIconBadge,
  QuizPanel,
  StatChip,
} from '@/shared/components/quiz'

export function QuizHomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pt-10 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-1 flex-col gap-8"
        >
          <div className="space-y-5 text-center">
            <QuizIconBadge icon={Trophy} size="lg" />
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Diagnóstico ENEM
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Qual é a sua chance real de passar no ENEM?
              </h1>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                10 perguntas rápidas. Um resultado personalizado. Descubra onde
                você está e o que focar agora.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <StatChip icon={ClipboardList} label="Perguntas" value="10" />
            <StatChip icon={Clock3} label="Minutos" value="~3" />
            <StatChip icon={Target} label="Score" value="0–100" />
          </div>

          <QuizPanel
            title="Como funciona"
            description="Responda com honestidade. No final você deixa seus dados e vê a faixa de preparação com um resumo das escolhas."
            className="border-primary/15 bg-primary/5"
          >
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  1
                </span>
                Responda uma pergunta por vez — pode voltar e alterar.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  2
                </span>
                Informe nome, e-mail e telefone para liberar o resultado.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  3
                </span>
                Receba pontuação e faixa de diagnóstico na hora.
              </li>
            </ul>
          </QuizPanel>

          <p className="pb-20 text-center text-sm text-muted-foreground">
            <Link
              to="/admin/login"
              className="underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Área administrativa
            </Link>
          </p>
        </motion.div>
      </div>

      <ActionDock
        primaryLabel="Jogar quiz"
        onPrimary={() => void navigate('/quiz')}
        secondary={
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-11 rounded-full border border-border/60"
            aria-label="Quiz diagnóstico"
          >
            <Trophy className="size-4 text-primary" />
          </Button>
        }
      />
    </div>
  )
}

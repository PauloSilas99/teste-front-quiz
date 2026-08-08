import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ChevronLeft, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { fetchQuestions, submitQuiz } from '@/shared/api'
import { ApiError } from '@/shared/lib/api-client'
import { useQuizSession } from '@/features/quiz/quiz-session-context'
import {
  formatPhoneBr,
  leadCaptureSchema,
  phoneDigits,
  type LeadCaptureFormValues,
} from './lead-capture-schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import {
  ActionDock,
  QuizIconBadge,
  QuizPanel,
  StepProgress,
} from '@/shared/components/quiz'

export function LeadCapturePage() {
  const navigate = useNavigate()
  const { answers, setResult } = useQuizSession()

  const questionsQuery = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  })

  const form = useForm<LeadCaptureFormValues>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
    mode: 'onBlur',
  })

  const mutation = useMutation({
    mutationFn: submitQuiz,
    onSuccess: (result) => {
      setResult(result)
      void navigate('/resultado', { replace: true })
    },
  })

  const totalQuestions = questionsQuery.data?.length ?? 0
  const answersComplete =
    totalQuestions > 0 && answers.length === totalQuestions

  function onSubmit(values: LeadCaptureFormValues) {
    if (!answersComplete) {
      void navigate('/quiz')
      return
    }

    mutation.mutate({
      name: values.name,
      email: values.email,
      phone: phoneDigits(values.phone),
      answers,
    })
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Não foi possível enviar o quiz. Tente de novo.'
        : null

  return (
    <div className="flex flex-1 flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col"
          noValidate
        >
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 pt-8 pb-4">
            <StepProgress
              current={Math.max(totalQuestions, 1)}
              total={Math.max(totalQuestions, 1)}
              showLabel
            />

            <QuizIconBadge icon={UserRound} />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuizPanel
                title="Quase lá!"
                description="Deixe seus dados para desbloquear o diagnóstico."
              >
                {!answersComplete && (
                  <p className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    Responda todas as perguntas do quiz antes de continuar.
                  </p>
                )}
                {errorMessage && (
                  <p className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errorMessage}
                  </p>
                )}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="name"
                            placeholder="Seu nome"
                            className="h-12 rounded-2xl border-border/80 bg-secondary/50"
                            {...field}
                            onBlur={(event) => {
                              field.onChange(event.target.value.trim())
                              field.onBlur()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder="voce@email.com"
                            className="h-12 rounded-2xl border-border/80 bg-secondary/50"
                            {...field}
                            onChange={(event) => {
                              field.onChange(event.target.value.replace(/\s/g, ''))
                            }}
                            onBlur={(event) => {
                              field.onChange(
                                event.target.value.trim().toLowerCase(),
                              )
                              field.onBlur()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone celular</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            placeholder="(11) 98765-4321"
                            maxLength={15}
                            className="h-12 rounded-2xl border-border/80 bg-secondary/50"
                            {...field}
                            onChange={(event) => {
                              field.onChange(formatPhoneBr(event.target.value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </QuizPanel>
            </motion.div>
          </div>

          <ActionDock
            primaryLabel={
              mutation.isPending ? 'Enviando…' : 'Ver meu resultado'
            }
            primaryType="submit"
            primaryDisabled={mutation.isPending || !answersComplete}
            secondary={
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="size-11 cursor-pointer rounded-full border border-border/60"
                onClick={() => void navigate('/quiz')}
                aria-label="Voltar ao quiz"
              >
                <ChevronLeft className="size-5" />
              </Button>
            }
          />
        </form>
      </Form>
    </div>
  )
}

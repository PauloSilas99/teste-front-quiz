import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ChevronLeft, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  formatPhoneBr,
  leadCaptureSchema,
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

  const form = useForm<LeadCaptureFormValues>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
    mode: 'onBlur',
  })

  function onSubmit(_values: LeadCaptureFormValues) {
    void navigate('/resultado')
  }

  return (
    <div className="flex flex-1 flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col"
          noValidate
        >
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 pt-8 pb-4">
            <StepProgress current={10} total={10} showLabel />

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
                              field.onChange(event.target.value.trim().toLowerCase())
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
            primaryLabel="Ver meu resultado"
            primaryType="submit"
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

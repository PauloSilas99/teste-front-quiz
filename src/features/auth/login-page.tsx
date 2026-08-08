import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './auth-context'
import { loginSchema, type LoginFormValues } from './login-schema'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { QuizPanel, QuizShell, QuizIconBadge } from '@/shared/components/quiz'
import { Shield } from 'lucide-react'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ?? '/admin/leads'

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/admin/leads" replace />
  }

  function onSubmit(values: LoginFormValues) {
    login({
      email: values.email,
      token: 'dev-token',
    })
    void navigate(from, { replace: true })
  }

  return (
    <QuizShell>
      <div className="flex min-h-svh items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <QuizIconBadge icon={Shield} />
          <QuizPanel
            title="Área administrativa"
            description="Entre com suas credenciais para acompanhar os leads do quiz."
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="username"
                          placeholder="admin@exemplo.com"
                          className="h-12 rounded-2xl border-border/80 bg-secondary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="h-12 rounded-2xl border-border/80 bg-secondary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="h-12 w-full rounded-full text-base font-semibold shadow-[0_0_20px_var(--glow)]"
                >
                  Entrar
                </Button>
              </form>
            </Form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Link
                to="/"
                className="underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                Voltar ao quiz
              </Link>
            </p>
          </QuizPanel>
        </div>
      </div>
    </QuizShell>
  )
}

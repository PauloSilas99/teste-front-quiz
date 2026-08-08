import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { loginAdmin } from '@/shared/api'
import { ApiError } from '@/shared/lib/api-client'
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
import {
  QuizPanel,
  QuizShell,
  QuizIconBadge,
  QuizTopBar,
} from '@/shared/components/quiz'
import { Eye, EyeOff, Shield } from 'lucide-react'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const from =
    (location.state as { from?: string } | null)?.from ?? '/admin/leads'

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      loginAdmin(values.email, values.password),
    onSuccess: (data) => {
      login({
        email: data.user.email,
        token: data.accessToken,
      })
      void navigate(from, { replace: true })
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/admin/leads" replace />
  }

  function onSubmit(values: LoginFormValues) {
    mutation.mutate(values)
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Falha no login. Tente novamente.'
        : null

  return (
    <QuizShell>
      <QuizTopBar showAdminLink={false} />
      <div className="flex flex-1 items-center justify-center px-4 pt-2 pb-10">
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
                {errorMessage && (
                  <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errorMessage}
                  </p>
                )}
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
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="h-12 rounded-2xl border-border/80 bg-secondary/50 pr-12"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-1.5 size-9 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={
                              showPassword ? 'Ocultar senha' : 'Mostrar senha'
                            }
                            aria-pressed={showPassword}
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="h-12 w-full rounded-full text-base font-semibold shadow-[0_0_20px_var(--glow)]"
                >
                  {mutation.isPending ? 'Entrando…' : 'Entrar'}
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

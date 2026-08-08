import { z } from 'zod'

export const leadCaptureSchema = z.object({
  name: z.string().min(3, 'Informe ao menos 3 caracteres'),
  email: z.email('Informe um e-mail válido'),
  phone: z
    .string()
    .min(10, 'Telefone deve incluir DDD')
    .regex(/^[\d\s()+-]+$/, 'Telefone inválido'),
})

export type LeadCaptureFormValues = z.infer<typeof leadCaptureSchema>

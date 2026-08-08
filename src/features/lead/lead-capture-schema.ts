import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Informe o e-mail')
  .email('Informe um e-mail válido')
  .transform((value) => value.toLowerCase())

/** Only digits from phone input */
export function phoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

/**
 * Brazilian mobile/landline with DDD.
 * Display: (11) 98765-4321 or (11) 3456-7890
 */
export function formatPhoneBr(value: string) {
  const digits = phoneDigits(value).slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function isValidBrazilianPhone(value: string) {
  const digits = phoneDigits(value)
  // DDD 11–99 (rough), number 8–9 digits after DDD
  if (digits.length !== 10 && digits.length !== 11) return false
  const ddd = Number(digits.slice(0, 2))
  if (ddd < 11 || ddd > 99) return false
  // Mobile (11 digits): third digit should be 9
  if (digits.length === 11 && digits[2] !== '9') return false
  return true
}

export const leadCaptureSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Informe ao menos 3 caracteres'),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .min(1, 'Informe o telefone')
    .refine(isValidBrazilianPhone, {
      message: 'Telefone inválido. Use DDD + número (ex.: 11 98765-4321)',
    }),
})

export type LeadCaptureFormValues = z.infer<typeof leadCaptureSchema>

import { z } from 'zod'

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .refine((value) => value.trim().length > 0, 'Nome é obrigatório')
      .max(30, 'O nome deve ter no máximo 30 caracteres')
      .regex(/^[\p{L}\s]+$/u, 'Use apenas letras e espaços'),
    email: z
      .string()
      .min(1, 'E-mail é obrigatório')
      .max(40, 'O e-mail deve ter no máximo 40 caracteres')
      .email('Informe um e-mail válido'),
    registration: z
      .string()
      .min(4, 'A matrícula deve ter no mínimo 4 números')
      .max(10, 'A matrícula deve ter no máximo 10 números')
      .regex(/^\d+$/, 'Use apenas números'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .regex(/^[a-zA-Z0-9]{6}$/, 'Use exatamente 6 caracteres alfanuméricos'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type CreateUserFormValues = z.infer<typeof createUserSchema>

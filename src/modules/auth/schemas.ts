import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(40, 'Username must be at most 40 characters long')
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      'Username must be lowercase letters, numbers and hyphens. It must start and end with a letter or number.'
    )
    .refine((val) => !val.includes('--'), 'Username cannot contain consecutive hyphens')
    .transform((val) => val.toLowerCase())
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

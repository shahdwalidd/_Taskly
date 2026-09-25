import z from 'zod'

export const passwordSchema = z
  .string()
  .min(1, 'Password is required.')
  .min(8, 'Password must be at least 8 characters.')
  .max(64, 'Password must be at most 64 characters.')
  .regex(/^\S*$/, 'Password must not contain spaces.')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter.')
  .regex(/\d/, 'Password must include at least one numeric digit.')
  .regex(
    /[^\p{L}\p{N}\s]/u,
    'Password must include at least one special character.',
  )

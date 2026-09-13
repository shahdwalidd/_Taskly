import z from 'zod'
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required.')
      .min(3, 'Name must be at least 3 characters.')
      .max(50, 'Name must be at most 50 characters.')
      .regex(
        /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u,
        'Name must contain letters only, with single spaces between words.',
      ),
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Please enter a valid email address.'),
    password: z
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
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    jobTitle: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
export type SignupFormValues = z.infer<typeof signupSchema>

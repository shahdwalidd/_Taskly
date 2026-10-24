import { z } from 'zod'

export const inviteMemberEmailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .email('Please enter a valid email address.')

export const projectIdSchema = z.string().uuid('This project could not be identified.')

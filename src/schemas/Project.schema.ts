import { z } from 'zod'

export const addProjectSchema = z.object({
  title: z
    .string()
    .min(3, 'Project title must be at least 3 characters.')
    .max(100, 'Project title must not exceed 100 characters.'),

  description: z.string().max(500).optional(),
})

export type AddProjectFormValues = z.infer<typeof addProjectSchema>

export const editProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters.')
    .max(100, 'Project name must not exceed 100 characters.'),
  description: z.string().max(500).optional(),
})

export type EditProjectFormValues = z.infer<typeof editProjectSchema>

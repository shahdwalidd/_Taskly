import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import {
  addProjectSchema,
  type AddProjectFormValues,
} from '@/schemas/Project.schema'
import { createProject } from '@/services/ProjectService'
import { getSession } from '@/store/Authstore'

export function useAddProject() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProjectFormValues>({
    resolver: zodResolver(addProjectSchema),
  })

  const descriptionValue =
    useWatch({
      control,
      name: 'description',
    }) ?? ''

  async function onSubmit(values: AddProjectFormValues) {
    const session = getSession()

    if (!session) {
      toast.error('Your session has expired. Please log in again.')
      navigate('/login', { replace: true })
      return
    }

    try {
      await createProject(
        {
          name: values.title,
          description: values.description,
        },
        session.access_token,
      )

      toast.success('Project created successfully')
      reset()
      navigate('/project')
    } catch {
      toast.error('Failed to add new project. Try again later.')
    }
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    descriptionValue,
  }
}

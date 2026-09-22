import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useState } from 'react'

import {
  editProjectSchema,
  type EditProjectFormValues,
} from '@/schemas/Project.schema'
import { useProject } from './useProject'
import { updateProject } from '@/services/ProjectService'
import { getSession } from '@/store/Authstore'

export function useEditProject() {
  const navigate = useNavigate()


  const {
    projectId,
    project,
    loading: isFetching,
    error: fetchError,
  } = useProject()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditProjectFormValues>({
    resolver: zodResolver(editProjectSchema),
    values: project
      ? {
          name: project.name,
          description: project.description,
        }
      : undefined,
  })

  const descriptionValue =
    useWatch({
      control,
      name: 'description',
    }) ?? ''

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  async function onSubmit(values: EditProjectFormValues) {
    if (!projectId) return

    setIsSaving(true)
    setSaveError(null)

    try {
      const session = getSession()

      if (!session?.access_token) {
        throw new Error('Authentication required')
      }

      await updateProject(
        projectId,
        values,
        session.access_token,
      )

      toast.success('Project updated successfully')
      navigate('/project')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update project'

      setSaveError(message)
    } finally {
      setIsSaving(false)
    }
  }

  function onCancel() {
    navigate('/project')
  }

  return {
    projectName: project?.name ?? '',
    status: isFetching
      ? 'loading'
      : fetchError
        ? 'error'
        : 'success',
    fetchError,

    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,

    isSubmitting: isSaving,
    saveError,

    descriptionValue,
    onCancel,
  }
}
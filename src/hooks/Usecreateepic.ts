import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useProject } from '@/hooks/useProject'
import { useProjectMembers } from '@/hooks/useProjectMembers'
import { epicSchema, type EpicFormValues } from '@/schemas/Epic.schema'
import { createEpic } from '@/services/EpicService'
import { getSession } from '@/store/Authstore'

export function useCreateEpic() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()

  const { project } = useProject(projectId)
  const {
    status: membersStatus,
    members,
    refetch: refetchMembers,
  } = useProjectMembers(projectId)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EpicFormValues>({
    resolver: zodResolver(epicSchema),
    defaultValues: {
      title: '',
      description: '',
      assignee_id: '',
      deadline: '',
    },
  })

  const descriptionValue =
    useWatch({ control, name: 'description' }) ?? ''
  const assigneeValue = useWatch({ control, name: 'assignee_id' }) ?? ''
  const deadlineValue = useWatch({ control, name: 'deadline' }) ?? ''

  
  const memberOptions = members.map((member) => ({
    label: `${member.name} (${member.role})`,
    value: member.id,
  }))

  const isMembersEmpty = membersStatus === 'success' && members.length === 0
  const isAssigneeDisabled = membersStatus !== 'success' || isMembersEmpty

  const assigneePlaceholder =
    membersStatus === 'loading'
      ? 'Loading members...'
      : membersStatus === 'error'
        ? 'Members unavailable'
        : isMembersEmpty
          ? 'No members in this project'
          : 'Select a member...'

  function handleCancel() {
    navigate(`/project/${projectId}/epics`)
  }

  async function onSubmit(values: EpicFormValues) {
    if (!projectId) {
      toast.error('Project not found.')
      return
    }

    const session = getSession()
    if (!session) {
      toast.error('Your session has expired. Please log in again.')
      navigate('/login', { replace: true })
      return
    }

    try {
      await createEpic(
        projectId,
        {
          title: values.title.trim(),
          description: values.description?.trim() ||" ",
          assignee_id: values.assignee_id?.trim() || undefined,
          deadline: values.deadline || undefined,
        },
        session.access_token,
      )

      toast.success('Epic created successfully')
      reset()
      navigate(`/project/${projectId}/epics`)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create epic. Please try again.',
      )
    }
  }

  return {
    projectId: projectId ?? '',
    projectName: project?.name ?? 'Project',
    register,
    handleSubmit,
    setValue,
    onSubmit,
    handleCancel,
    errors,
    isSubmitting,
    descriptionValue,
    assigneeValue,
    deadlineValue,
    memberOptions,
    membersStatus,
    isMembersEmpty,
    isAssigneeDisabled,
    assigneePlaceholder,
    refetchMembers,
  }
}
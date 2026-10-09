import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { TaskFormValues } from '@/types/addTask.types'
import { taskStatuses } from '@/components/tasks-board/TaskStatus'
import { useProjectEpics } from '@/hooks/useProjectEpics'
import { useProjectMembers } from '@/hooks/useProjectMembers'
import { createTask, toCreateTaskPayload } from '@/services/TaskService'
import { getSession } from '@/store/Authstore'

 
const DEFAULT_STATUS = 'TO_DO'
const MAX_EPIC_TITLE_LENGTH = 100
 
const emptyValues: TaskFormValues = {
  title: '',
  description: '',
  status: DEFAULT_STATUS,
  assigneeId: '',
  epicId: '',
  dueDate: '',
}
 
interface OpenAddTaskOptions {
  statusId?: string
  epicId?: string
}
 
function formatEpicLabel(epic: { code: string; title: string }) {
  const title =
    epic.title.length > MAX_EPIC_TITLE_LENGTH
      ? `${epic.title.slice(0, MAX_EPIC_TITLE_LENGTH)}...`
      : epic.title
  return `(${epic.code}) ${title}`
}
 
export function useAddTask(projectId: string, onCreated?: () => void) {
  const navigate = useNavigate()
 
  const [isOpen, setIsOpen] = useState(false)
  const [values, setValues] = useState<TaskFormValues>(emptyValues)
  const [titleError, setTitleError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
 
  const { members, status: membersStatus } = useProjectMembers(projectId)
  const { epics, status: epicsStatus } = useProjectEpics(
    projectId,
    false,
    true,
    isOpen,
  )
 
  const statusOptions = useMemo(
    () =>
      taskStatuses.map((status) => ({
        value: status.id,
        label: status.label,
      })),
    [],
  )
 
  
  const assigneeOptions = useMemo(
    () => members.map((member) => ({ label: member.name, value: member.id })),
    [members],
  )
 
 
  const epicOptions = useMemo(
    () => epics.map((epic) => ({ value: epic.id, label: formatEpicLabel(epic) })),
    [epics],
  )
 
  const assigneeDisabled = membersStatus !== 'success' || members.length === 0
  const assigneePlaceholder =
    membersStatus === 'loading'
      ? 'Loading members...'
      : membersStatus === 'error'
        ? 'Unable to load members'
        : members.length === 0
          ? 'No members in this project'
          : 'Select Team Member'
 
  const epicDisabled = epicsStatus !== 'success' || epics.length === 0
  const epicPlaceholder =
    epicsStatus === 'loading'
      ? 'Loading epics...'
      : epicsStatus === 'error'
        ? 'Unable to load epics'
        : epics.length === 0
          ? 'No epics in this project'
          : 'Select Epic'
 
  
  const openAddTask = useCallback((options: OpenAddTaskOptions = {}) => {
    setValues({
      ...emptyValues,
      status: options.statusId ?? DEFAULT_STATUS,
      epicId: options.epicId ?? '',
    })
    setTitleError(undefined)
    setIsOpen(true)
  }, [])
 
  const reset = useCallback(() => {
    setIsOpen(false)
    setValues(emptyValues)
    setTitleError(undefined)
  }, [])
 
  const closeAddTask = useCallback(() => {
    if (isSubmitting) return
    reset()
  }, [isSubmitting, reset])
 
  const changeValue = useCallback(
    (field: keyof TaskFormValues, value: string) => {
      setValues((previous) => ({ ...previous, [field]: value }))
      if (field === 'title') setTitleError(undefined)
    },
    [],
  )
 
  const submit = useCallback(async () => {
    if (isSubmitting) return
 
    if (!values.title.trim()) {
      setTitleError('Title is required')
      return
    }
 
    if (!projectId) {
      toast.error('Project not found.')
      return
    }
 
    const session = getSession()
    if (!session?.access_token) {
      toast.error('Your session has expired. Please log in again.')
      navigate('/login', { replace: true })
      return
    }
 
    setIsSubmitting(true)
    try {
      await createTask(toCreateTaskPayload(projectId, values), session.access_token)
      toast.success('Task created successfully')
      reset()
      onCreated?.()
    } catch (error) {
      
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create task. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, values, projectId, navigate, reset, onCreated])
 
  return {
    isOpen,
    openAddTask,
    modalProps: {
      values,
      onChange: changeValue,
      statusOptions,
      assigneeOptions,
      epicOptions,
      assigneePlaceholder,
      assigneeDisabled,
      epicPlaceholder,
      epicDisabled,
      titleError,
      isSubmitting,
      onClose: closeAddTask,
      onSubmit: () => {
        void submit()
      },
    },
  }
}


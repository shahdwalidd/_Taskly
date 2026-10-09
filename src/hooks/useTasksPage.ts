
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { TaskFormValues } from '@/types/addTask.types'
import { taskStatuses } from '@/components/tasks-board/TaskStatus'
import { useProject } from '@/hooks/useProject'
import { useProjectEpics } from '@/hooks/useProjectEpics'
import { useProjectMembers } from '@/hooks/useProjectMembers'

const emptyTaskValues: TaskFormValues = {
  title: '',
  description: '',
  status: taskStatuses[0].id,
  assigneeId: '',
  epicId: '',
  dueDate: '',
}

export function useTasksPage() {
  const { projectId = '' } = useParams<{ projectId: string }>()
  const { project } = useProject(projectId)
  const { members } = useProjectMembers(projectId)
  const { epics } = useProjectEpics(projectId, false, true)

  const [search, setSearch] = useState('')
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [taskValues, setTaskValues] = useState<TaskFormValues>(emptyTaskValues)

  const statusOptions = useMemo(
    () => taskStatuses.map((status) => ({ label: status.label, value: status.id })),
    [],
  )

 
  const assigneeOptions = useMemo(
    () => members.map((member) => ({ label: member.name, value: member.id })),
    [members],
  )

 
  const epicOptions = epics.map((epic) => ({
    label: epic.title,
    value: epic.id,
  }))

 
  const openAddTask = useCallback((statusId?: string, epicId?: string) => {
    setTaskValues({
      ...emptyTaskValues,
      status: statusId ?? emptyTaskValues.status,
      epicId: epicId ?? emptyTaskValues.epicId,
    })
    setIsAddTaskOpen(true)
  }, [])

  const closeAddTask = useCallback(() => {
    setIsAddTaskOpen(false)
    setTaskValues(emptyTaskValues)
  }, [])

  const changeTaskValue = useCallback(
    (field: keyof TaskFormValues, value: string) => {
      setTaskValues((previous) => ({ ...previous, [field]: value }))
    },
    [],
  )

  // TODO: create the task through the API in the next task
  const submitTask = useCallback(() => {}, [])

  return {
    projectId,
    projectName: project?.name ?? 'Project',
    search,
    setSearch,
    isAddTaskOpen,
    taskValues,
    statusOptions,
    assigneeOptions,
    epicOptions,
    openAddTask,
    closeAddTask,
    changeTaskValue,
    submitTask,
  }
}
import type {
  CreateTaskPayload,
  Task,
  TaskDetails,
  TaskFormValues,
  TaskStatusValue,
  TaskStatusValue as TaskStatus,
} from '@/types/addTask.types'
import { apiRequest } from './apiClient'

export function toCreateTaskPayload(
  projectId: string,
  values: TaskFormValues,
): CreateTaskPayload {
  const description = values.description.trim()

  return {
    project_id: projectId,
    title: values.title.trim(),
    status: values.status as TaskStatusValue,
    ...(description ? { description } : {}),
    ...(values.epicId ? { epic_id: values.epicId } : {}),
    ...(values.assigneeId ? { assignee_id: values.assigneeId } : {}),
    ...(values.dueDate ? { due_date: `${values.dueDate}T12:00:00Z` } : {}),
  }
}

export async function getProjectTasks(
  projectId: string,
  status: TaskStatus,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Task[]> {
  const query = new URLSearchParams({
    project_id: `eq.${projectId}`,
    status: `eq.${status}`,
  })

  return apiRequest<Task[]>(`/rest/v1/project_tasks?${query.toString()}`, {
    accessToken,
    signal,
  })
}

export class TaskNotFoundError extends Error {
  constructor() {
    super('Task not found')
    this.name = 'TaskNotFoundError'
  }
}

export async function getTaskDetails(
  projectId: string,
  taskId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<TaskDetails> {
  const query = new URLSearchParams({
    project_id: `eq.${projectId}`,
    id: `eq.${taskId}`,
  })
  const result = await apiRequest<unknown>(
    `/rest/v1/project_tasks?${query.toString()}`,
    { accessToken, signal },
  )

  if (!Array.isArray(result)) {
    throw new Error('Invalid task details response')
  }
  if (result.length === 0) throw new TaskNotFoundError()

  const task = result[0]
  if (
    typeof task !== 'object' ||
    task === null ||
    !('id' in task) ||
    typeof task.id !== 'string' ||
    !('project_id' in task) ||
    typeof task.project_id !== 'string' ||
    !('status' in task) ||
    typeof task.status !== 'string'
  ) {
    throw new Error('Invalid task details response')
  }

  return task as TaskDetails
}

export async function getEpicTasks(
  epicId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Task[]> {
  const query = new URLSearchParams({ epic_id: `eq.${epicId}` })

  return apiRequest<Task[]>(`/rest/v1/project_tasks?${query.toString()}`, {
    accessToken,
    signal,
  })
}

export async function createTask(
  payload: CreateTaskPayload,
  accessToken: string,
): Promise<void> {
  await apiRequest('/rest/v1/tasks', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(payload),
  })
}

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

export class TaskNotFoundError extends Error {
  constructor() {
    super('Task not found')
    this.name = 'TaskNotFoundError'
  }
}

export async function getProjectTasks(
  projectId: string,
  status: TaskStatus,
  accessToken: string,
  options: {
    limit: number
    offset: number
    searchTerm?: string
    signal?: AbortSignal
  },
): Promise<{ tasks: Task[]; totalCount: number }> {
  const query = new URLSearchParams({
    project_id: `eq.${projectId}`,
    status: `eq.${status}`,
    limit: String(options.limit),
    offset: String(options.offset),
  })
  const searchTerm = options.searchTerm?.trim()
  if (searchTerm) {
    const escapedSearchTerm = searchTerm.replace(/[\\%_]/g, '\\$&')
    query.set('title', `ilike.%${escapedSearchTerm}%`)
  }

  const result = await apiRequest<Task[]>(
    `/rest/v1/project_tasks?${query.toString()}`,
    {
      accessToken,
      signal: options.signal,
      includeHeaders: true,
      headers: { Prefer: 'count=exact' },
    },
  )

  if (!Array.isArray(result.data)) {
    throw new Error('The project tasks response was invalid')
  }

  const countMatch = result.headers.get('Content-Range')?.match(/\/(\d+)$/)
  const totalCount = countMatch ? Number(countMatch[1]) : 0

  return { tasks: result.data, totalCount }
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

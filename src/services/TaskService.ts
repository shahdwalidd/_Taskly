import type {
  CreateTaskPayload,
  Task,
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
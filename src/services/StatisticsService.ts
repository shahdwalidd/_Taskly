import type { TaskStatusValue } from '@/types/addTask.types'
import { apiRequest } from '@/services/apiClient'

export interface TasksCalendarStats {
  daily: Array<{
    day: string
    statuses: Partial<Record<TaskStatusValue, number>>
  }>
  totals: Partial<Record<TaskStatusValue, number>>
  total_tasks: number
  done_tasks: number
  overdue_tasks: number
}

export interface ProjectTaskCount {
  project_id: string
  project_name: string
  tasks_count: number
}

export interface CalendarStatsFilters {
  startDate: string
  endDate: string
  projectId: string | null
  status: TaskStatusValue | null
}

export async function getTasksCalendarStats(
  filters: CalendarStatsFilters,
  accessToken: string,
  signal?: AbortSignal,
): Promise<TasksCalendarStats> {
  const result = await apiRequest<unknown>(
    '/rest/v1/rpc/get_tasks_calendar_stats',
    {
      method: 'POST',
      accessToken,
      signal,
      body: JSON.stringify({
        p_start_date: filters.startDate,
        p_end_date: filters.endDate,
        p_project_id: filters.projectId,
        p_status: filters.status,
      }),
    },
  )

  if (
    typeof result !== 'object' || result === null ||
    !('daily' in result) || !Array.isArray(result.daily) ||
    !('totals' in result) || typeof result.totals !== 'object' || result.totals === null ||
    !('total_tasks' in result) || typeof result.total_tasks !== 'number' ||
    !('done_tasks' in result) || typeof result.done_tasks !== 'number' ||
    !('overdue_tasks' in result) || typeof result.overdue_tasks !== 'number'
  ) {
    throw new Error('The task statistics response was invalid')
  }

  return result as TasksCalendarStats
}

export async function getTasksCountPerProject(
  startDate: string,
  endDate: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<ProjectTaskCount[]> {
  const result = await apiRequest<unknown>(
    '/rest/v1/rpc/get_tasks_count_per_project',
    {
      method: 'POST',
      accessToken,
      signal,
      body: JSON.stringify({
        p_start_date: startDate,
        p_end_date: endDate,
      }),
    },
  )

  if (
    !Array.isArray(result) ||
    !result.every((item) =>
      typeof item === 'object' && item !== null &&
      'project_id' in item && typeof item.project_id === 'string' &&
      'project_name' in item && typeof item.project_name === 'string' &&
      'tasks_count' in item && typeof item.tasks_count === 'number'
    )
  ) {
    throw new Error('The project statistics response was invalid')
  }

  return result as ProjectTaskCount[]
}

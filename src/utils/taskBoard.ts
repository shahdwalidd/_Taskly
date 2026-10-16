import type { TaskCardProps } from '@/components/tasks-board/TaskCard'
import { taskStatuses } from '@/components/tasks-board/TaskStatus'
import type { Task, TaskCardState, TaskStatusValue } from '@/types/addTask.types'
import { getTodayISO } from '@/utils/formatDate'

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]

export function formatTaskDate(dueDate: string): string {
  const [, month, day] = dueDate.slice(0, 10).split('-')
  return `${MONTHS[Number(month) - 1]} ${day}`
}

export function getTaskCardState(task: Task): TaskCardState {
  if (task.status === 'DONE') return 'completed'
  if (!task.dueDate) return 'default'

  const due = task.dueDate.slice(0, 10)
  const today = getTodayISO()
  if (due < today) return 'delayed'
  if (due === today) return 'today'
  return 'default'
}

export function toTaskCardProps(task: Task): TaskCardProps {
  return {
    code: task.code,
    title: task.title,
    statusId: task.status,
    assigneeName: task.assigneeName,
    state: getTaskCardState(task),
    dateLabel: task.dueDate ? formatTaskDate(task.dueDate) : undefined,
  }
}

export function groupTasksByStatus(tasks: Task[]): Record<TaskStatusValue, Task[]> {
  const groups = Object.fromEntries(
    taskStatuses.map((status) => [status.id, [] as Task[]]),
  ) as Record<TaskStatusValue, Task[]>

  for (const task of tasks) groups[task.status]?.push(task)
  return groups
}
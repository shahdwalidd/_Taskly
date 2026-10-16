import type { TaskCardProps } from '@/components/tasks-board/TaskCard'
import type { Task, TaskCardState } from '@/types/addTask.types'
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
  if (!task.due_date) return 'default'

  const due = task.due_date.slice(0, 10)
  const today = getTodayISO()
  if (due < today) return 'delayed'
  if (due === today) return 'today'
  return 'default'
}

export function toTaskCardProps(task: Task): TaskCardProps {
  return {
    code: task.task_id == null ? undefined : String(task.task_id),
    title: task.title?.trim() || 'Untitled task',
    description: task.description?.trim() || undefined,
    epicName: task.epic?.title?.trim() || undefined,
    statusId: task.status,
    assigneeName:
      task.assignee?.name ?? task.assignee?.user_metadata?.name ?? undefined,
    state: getTaskCardState(task),
    dateLabel: task.due_date ? formatTaskDate(task.due_date) : undefined,
  }
}

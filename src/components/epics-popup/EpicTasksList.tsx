import type { Task } from '@/types/addTask.types'
import { formDate, getTodayISO } from '@/utils/formatDate'
import { EpicTaskCard } from './EpicTaskCard'

interface EpicTasksListProps {
  tasks: Task[]
}

function formatDueDate(dueDate: string | null): string {
  if (!dueDate || Number.isNaN(new Date(dueDate).getTime())) {
    return 'No due date'
  }

  return formDate(dueDate)
}

export function EpicTasksList({ tasks }: EpicTasksListProps) {
  return (
    <ul className="divide-surface-low flex flex-col gap-3 md:gap-0 md:divide-y md:overflow-hidden md:rounded-lg md:border md:border-surface-highest/60 md:bg-authcard">
      {tasks.map((task) => {
        const assigneeName =
          task.assignee?.name?.trim() ||
          task.assignee?.user_metadata?.name?.trim() ||
          undefined
        const assigneeAvatar =
          task.assignee?.avatar_url ??
          task.assignee?.user_metadata?.avatar_url ??
          task.assignee?.picture ??
          task.assignee?.user_metadata?.picture ??
          undefined
        const dueDate = task.due_date
        const validDueDate =
          dueDate !== null && !Number.isNaN(new Date(dueDate).getTime())

        return (
          <li key={task.id}>
            <EpicTaskCard
              title={task.title?.trim() || 'Untitled task'}
              assigneeName={assigneeName}
              assigneeAvatar={assigneeAvatar}
              dueDate={formatDueDate(dueDate)}
              isOverdue={
                validDueDate && dueDate.slice(0, 10) < getTodayISO()
              }
            />
          </li>
        )
      })}
    </ul>
  )
}
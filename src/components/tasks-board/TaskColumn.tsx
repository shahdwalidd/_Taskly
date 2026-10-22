import { useProjectTasks } from '@/hooks/useProjectTasks'
import { toTaskCardProps } from '@/utils/taskBoard'
import { AddNewTaskSlot } from './AddNewTaskSlot'
import { EmptyTaskPanel } from './EmptyTaskPanel'
import { TaskCard } from './TaskCard'
import { TaskColumnHeader } from './TaskColumnHeader'
import type { TaskStatus } from './TaskStatus'
import type { Task } from '@/types/addTask.types'

interface TaskColumnProps {
  projectId: string
  status: TaskStatus
  onAddTask: (statusId?: string) => void
  onTaskClick: (task: Task) => void
}

function TaskLoadingState() {
  return (
    <div aria-label="Loading tasks" className="flex flex-col gap-3" role="status">
      {[0, 1].map((item) => (
        <div
          key={item}
          className="border-surface-low bg-authcard flex h-28 animate-pulse flex-col gap-3 rounded-md border p-4"
        >
          <div className="bg-surface-low h-2.5 w-1/3 rounded" />
          <div className="bg-surface-low h-3 w-4/5 rounded" />
          <div className="bg-surface-low h-2.5 w-1/2 rounded" />
        </div>
      ))}
    </div>
  )
}

export function TaskColumn({ projectId, status, onAddTask, onTaskClick }: TaskColumnProps) {
  const { tasks, status: loadStatus, error, refetch } = useProjectTasks(
    projectId,
    status.id,
  )

  return (
    <section
      aria-label={status.label}
      className="flex w-72 shrink-0 flex-col gap-3"
    >
      <div className="pb-1">
        <TaskColumnHeader
          label={status.label}
          count={loadStatus === 'success' ? tasks.length : 0}
          dotClass={status.dotClass}
          badgeClass={status.badgeClass}
        />
      </div>

      <AddNewTaskSlot onClick={() => onAddTask(status.id)} />

      {loadStatus === 'loading' ? (
        <TaskLoadingState />
      ) : loadStatus === 'error' ? (
        <div
          className="border-error/20 bg-error/5 flex flex-col items-start gap-3 rounded-md border p-4"
          role="alert"
        >
          <p className="text-error wrap-break-word text-sm">
            {error ?? 'Failed to load tasks'}
          </p>
          <button
            type="button"
            onClick={refetch}
            className="text-primary text-sm font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : tasks.length > 0 ? (
        <ul className="flex flex-col gap-3.5">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard {...toTaskCardProps(task)} onClick={() => onTaskClick(task)} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyTaskPanel className="min-h-160 flex-1" />
      )}
    </section>
  )
}

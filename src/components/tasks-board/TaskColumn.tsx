import type { Task } from '@/types/addTask.types'
import { toTaskCardProps } from '@/utils/taskBoard'
import { AddNewTaskSlot } from './AddNewTaskSlot'
import { EmptyTaskPanel } from './EmptyTaskPanel'
import { TaskCard } from './TaskCard'
import { TaskColumnHeader } from './TaskColumnHeader'
import type { TaskStatus } from './TaskStatus'

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask: (statusId?: string) => void
}

export function TaskColumn({ status, tasks, onAddTask }: TaskColumnProps) {
  return (
    <section
      aria-label={status.label}
      className="flex w-72 shrink-0 flex-col gap-3"
    >
      <div className="pb-1">
        <TaskColumnHeader
          label={status.label}
          count={tasks.length}
          dotClass={status.dotClass}
          badgeClass={status.badgeClass}
        />
      </div>

      <AddNewTaskSlot onClick={() => onAddTask(status.id)} />

      {tasks.length > 0 ? (
        <ul className="flex flex-col gap-3.5">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard {...toTaskCardProps(task)} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyTaskPanel className="min-h-160 flex-1" />
      )}
    </section>
  )
}
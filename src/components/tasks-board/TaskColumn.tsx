import type { ReactNode } from "react";
import type { TaskStatus } from './TaskStatus'
import { AddNewTaskSlot } from './AddNewTaskSlot'
import {  EmptyTaskPanel} from './EmptyTaskPanel'
import { TaskColumnHeader } from './TaskColumnHeader'
 
interface TaskColumnProps {
  status: TaskStatus
  count?: number
  children?: ReactNode 
  onAddTask: () => void
}
export function TaskColumn({ status, count = 0, children, onAddTask }: TaskColumnProps) {
  return (
    <section
      aria-label={status.label}
      className="flex w-72 shrink-0 flex-col gap-3"
    >
      <div className="pb-1">
        <TaskColumnHeader
          label={status.label}
          count={count}
          dotClass={status.dotClass}
          badgeClass={status.badgeClass}
        />
      </div>
 
      <AddNewTaskSlot onClick={onAddTask} />
 
      {children ?? <EmptyTaskPanel className="min-h-160 flex-1" />}
    </section>
  )
}
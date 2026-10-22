import { TaskColumn } from './TaskColumn'
import { taskStatuses } from './TaskStatus'
import type { Task } from '@/types/addTask.types'

interface TaskBoardProps {
  projectId: string
  onAddTask: (statusId?: string) => void
  onTaskClick: (task: Task) => void
}

export function TaskBoard({ projectId, onAddTask, onTaskClick }: TaskBoardProps) {
  return (
    <div className="scrollbar-board -mr-4 overflow-x-auto pb-4 md:-mr-8">
      <div className="flex w-max items-stretch gap-6 pr-8">
        {taskStatuses.map((status) => (
          <TaskColumn
            key={status.id}
            projectId={projectId}
            status={status}
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  )
}

import { TaskColumn } from './TaskColumn'
import { taskStatuses } from './TaskStatus'

interface TaskBoardProps {
  onAddTask: () => void
}

export function TaskBoard({ onAddTask }: TaskBoardProps) {
  return (
    
    <div className="scrollbar-board md:-mr-8 overflow-x-auto pb-4">
      <div className="flex w-max items-stretch gap-6 pr-8">
        {taskStatuses.map((status) => (
          <TaskColumn key={status.id} status={status} onAddTask={onAddTask} />
        ))}
      </div>
    </div>
  )
}
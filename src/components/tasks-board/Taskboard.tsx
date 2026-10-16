import type { Task } from '@/types/addTask.types'
import { groupTasksByStatus } from '@/utils/taskBoard'
import { TaskColumn } from './TaskColumn'
import { taskStatuses } from './TaskStatus'

interface TaskBoardProps {
  tasks?: Task[]
  onAddTask: (statusId?: string) => void
}

export function TaskBoard({ tasks = [], onAddTask }: TaskBoardProps) {
  const tasksByStatus = groupTasksByStatus(tasks)

  return (
    <div className="scrollbar-board md:-mr-8 overflow-x-auto pb-4">
      <div className="flex w-max items-stretch gap-6 pr-8">
        {taskStatuses.map((status) => (
          <TaskColumn
            key={status.id}
            status={status}
            tasks={tasksByStatus[status.id]}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </div>
  )
}
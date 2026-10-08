import { TaskColumn } from './TaskColumn'
import { taskStatuses } from './TaskStatus'

export function TaskBoard() {
  return (
    
    <div className="scrollbar-board md:-mr-8 overflow-x-auto pb-4">
      <div className="flex w-max items-stretch gap-6 pr-8">
        {taskStatuses.map((status) => (
          <TaskColumn key={status.id} status={status} />
        ))}
      </div>
    </div>
  )
}
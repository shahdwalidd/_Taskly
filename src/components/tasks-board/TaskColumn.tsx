import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
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
  searchTerm: string
  isLoading: boolean
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  onAddTask: (statusId?: string) => void
  onTaskClick: (taskId: string) => void
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

export function TaskColumn({
  status,
  tasks,
  searchTerm,
  isLoading,
  hasMore,
  loadingMore,
  onLoadMore,
  onAddTask,
  onTaskClick,
}: TaskColumnProps) {
  const sentinelRef = useInfiniteScroll(
    onLoadMore,
    hasMore && !loadingMore && tasks.length > 0,
  )

  return (
    <section aria-label={status.label} className="flex w-72 shrink-0 flex-col gap-3">
      <div className="pb-1">
        <TaskColumnHeader
          label={status.label}
          count={tasks.length}
          dotClass={status.dotClass}
          badgeClass={status.badgeClass}
        />
      </div>

      <AddNewTaskSlot onClick={() => onAddTask(status.id)} />

      {isLoading ? (
        <TaskLoadingState />
      ) : tasks.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3.5">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCard {...toTaskCardProps(task)} onClick={() => onTaskClick(task.id)} />
              </li>
            ))}
          </ul>
          {hasMore && tasks.length > 0 && <div ref={sentinelRef} className="h-1" />}
        </>
      ) : (
        <EmptyTaskPanel
          className="min-h-160 flex-1"
          message={searchTerm.trim() ? 'No matching tasks' : 'No tasks'}
        />
      )}
    </section>
  )
}

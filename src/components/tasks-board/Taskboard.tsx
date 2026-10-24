import type { Task } from '@/types/addTask.types'
import { ErrorState } from '@/components/shared/ErrorState'
import { TaskColumn } from './TaskColumn'
import { taskStatuses } from './TaskStatus'

interface TaskBoardProps {
  tasks: Task[]
  searchTerm: string
  status: 'loading' | 'success' | 'error'
  error: string | null
  hasMore: boolean
  loadingMore: boolean
  loadMoreFailed: boolean
  onRetry: () => void
  onLoadMore: () => void
  onAddTask: (statusId?: string) => void
  onTaskClick: (taskId: string) => void
}

export function TaskBoard({
  tasks,
  searchTerm,
  status,
  error,
  hasMore,
  loadingMore,
  loadMoreFailed,
  onRetry,
  onLoadMore,
  onAddTask,
  onTaskClick,
}: TaskBoardProps) {
  if (status === 'error' && tasks.length === 0) {
    return <ErrorState message={error ?? 'Failed to load tasks'} onRetry={onRetry} />
  }

  return (
    <div className="scrollbar-board -mr-4 overflow-x-auto pb-4 md:-mr-8">
      <div className="flex w-max items-stretch gap-6 pr-8">
        {taskStatuses.map((taskStatus) => (
          <TaskColumn
            key={taskStatus.id}
            status={taskStatus}
            tasks={tasks.filter((task) => task.status === taskStatus.id)}
            searchTerm={searchTerm}
            isLoading={status === 'loading' && tasks.length === 0}
            hasMore={hasMore && !loadMoreFailed}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-4">
          <span
            role="status"
            aria-label="Loading more tasks"
            className="border-t-primary size-6 animate-spin rounded-full border-2 border-gray-300"
          />
        </div>
      )}

      {loadMoreFailed && (
        <div className="flex flex-col items-center gap-2 py-4" role="alert">
          <p className="text-error text-sm">Failed to load more tasks</p>
          <button
            type="button"
            onClick={onLoadMore}
            className="text-primary text-sm font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

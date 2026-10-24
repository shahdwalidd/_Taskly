import { ErrorState } from '@/components/shared/ErrorState'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import type { Task } from '@/types/addTask.types'
import { AddNewTaskSlot } from './AddNewTaskSlot'
import { EmptyTaskPanel } from './EmptyTaskPanel'
import { TaskList } from './TaskList'

interface TasksListViewProps {
  tasks: Task[]
  searchTerm: string
  status: 'loading' | 'success' | 'error'
  error: string | null
  hasMore: boolean
  loadingMore: boolean
  loadMoreFailed: boolean
  onRetry: () => void
  onLoadMore: () => void
  onAddTask: () => void
  onTaskClick: (taskId: string) => void
}

function TaskListLoadingState() {
  return (
    <div className="flex flex-col gap-3.5" role="status" aria-label="Loading tasks">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="border-surface-low bg-authcard h-28 animate-pulse rounded-md border p-4"
        >
          <div className="bg-surface-low mb-4 h-3 w-1/4 rounded" />
          <div className="bg-surface-low mb-3 h-4 w-3/4 rounded" />
          <div className="bg-surface-low h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  )
}

export function TasksListView({
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
}: TasksListViewProps) {
  const sentinelRef = useInfiniteScroll(
    onLoadMore,
    status === 'success' && hasMore && !loadingMore && !loadMoreFailed,
  )

  if (status === 'error' && tasks.length === 0) {
    return <ErrorState message={error ?? 'Failed to load tasks'} onRetry={onRetry} />
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <AddNewTaskSlot onClick={onAddTask} />

      {status === 'loading' && tasks.length === 0 ? (
        <TaskListLoadingState />
      ) : tasks.length > 0 ? (
        <TaskList tasks={tasks} onTaskClick={onTaskClick} />
      ) : (
        <EmptyTaskPanel
          className="min-h-60"
          message={searchTerm.trim() ? 'No matching tasks' : 'No tasks'}
        />
      )}

      {hasMore && <div ref={sentinelRef} className="h-1 w-full" />}

      {loadingMore && (
        <div className="flex justify-center py-3">
          <span
            role="status"
            aria-label="Loading more tasks"
            className="border-t-primary size-6 animate-spin rounded-full border-2 border-gray-300"
          />
        </div>
      )}

      {loadMoreFailed && (
        <div className="flex flex-col items-center gap-2" role="alert">
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

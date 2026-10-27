import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Task } from '@/types/addTask.types'
import type { TaskStatusValue } from '@/types/addTask.types'
import { ErrorState } from '@/components/shared/ErrorState'
import { TaskColumn } from './TaskColumn'
import { taskStatuses } from './TaskStatus'

interface TaskBoardProps {
  tasks: Task[]
  pendingTaskIds: ReadonlySet<string>
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
  onStatusChange: (taskId: string, status: TaskStatusValue) => void
}

export function TaskBoard({
  tasks,
  pendingTaskIds,
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
  onStatusChange,
}: TaskBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) return

    const taskId = active.data.current?.taskId
    const sourceStatus = active.data.current?.statusId
    const destinationStatus = over.data.current?.statusId
    const isSupportedStatus = taskStatuses.some(
      ({ id }) => id === destinationStatus,
    )

    if (
      typeof taskId !== 'string' ||
      !isSupportedStatus ||
      sourceStatus === destinationStatus
    ) {
      return
    }

    onStatusChange(taskId, destinationStatus as TaskStatusValue)
  }

  if (status === 'error' && tasks.length === 0) {
    return <ErrorState message={error ?? 'Failed to load tasks'} onRetry={onRetry} />
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="scrollbar-board -mr-4 overflow-x-auto pb-4 md:-mr-8">
        <div className="flex w-max items-stretch gap-6 pr-8">
          {taskStatuses.map((taskStatus) => (
            <TaskColumn
              key={taskStatus.id}
              status={taskStatus}
              tasks={tasks.filter((task) => task.status === taskStatus.id)}
              pendingTaskIds={pendingTaskIds}
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
    </DndContext>
  )
}

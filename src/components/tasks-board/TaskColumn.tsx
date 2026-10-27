import { useDroppable } from '@dnd-kit/core'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import type { Task } from '@/types/addTask.types'
import { AddNewTaskSlot } from './AddNewTaskSlot'
import { DraggableTaskCard } from './DraggableTaskCard'
import { EmptyTaskPanel } from './EmptyTaskPanel'
import { TaskColumnHeader } from './TaskColumnHeader'
import type { TaskStatus } from './TaskStatus'

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  pendingTaskIds: ReadonlySet<string>
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
  pendingTaskIds,
  searchTerm,
  isLoading,
  hasMore,
  loadingMore,
  onLoadMore,
  onAddTask,
  onTaskClick,
}: TaskColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${status.id}`,
    data: { statusId: status.id },
  })
  const sentinelRef = useInfiniteScroll(
    onLoadMore,
    hasMore && !loadingMore && tasks.length > 0,
  )

  return (
    <section
      ref={setNodeRef}
      aria-label={status.label}
      className={`flex w-72 shrink-0 flex-col gap-3 rounded-md transition-colors ${isOver ? 'bg-primary/5 ring-2 ring-primary/30' : ''}`}
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

      {isLoading ? (
        <TaskLoadingState />
      ) : tasks.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3.5">
            {tasks.map((task) => (
              <li key={task.id}>
                <DraggableTaskCard
                  task={task}
                  disabled={pendingTaskIds.has(task.id)}
                  onTaskClick={onTaskClick}
                />
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

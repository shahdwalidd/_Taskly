import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/types/addTask.types'
import { toTaskCardProps } from '@/utils/taskBoard'
import { TaskCard } from './TaskCard'

interface DraggableTaskCardProps {
  task: Task
  disabled: boolean
  onTaskClick: (taskId: string) => void
}

export function DraggableTaskCard({
  task,
  disabled,
  onTaskClick,
}: DraggableTaskCardProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
  } = useDraggable({
    id: task.id,
    disabled,
    data: { taskId: task.id, statusId: task.status },
  })

  return (
    <TaskCard
      {...toTaskCardProps(task)}
      onClick={() => onTaskClick(task.id)}
      cardRef={setNodeRef}
      cardStyle={{
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? undefined : 'transform 200ms ease',
      }}
      isDragging={isDragging}
      dragHandle={
        <button
          ref={setActivatorNodeRef}
          type="button"
          disabled={disabled}
          aria-label={`Drag task ${task.title?.trim() || 'Untitled task'}`}
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="text-slate-medium hover:text-primary focus-visible:text-primary touch-none cursor-grab rounded-xs p-1 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          <svg
            aria-hidden="true"
            className="size-4"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <circle cx="5" cy="3" r="1" />
            <circle cx="11" cy="3" r="1" />
            <circle cx="5" cy="8" r="1" />
            <circle cx="11" cy="8" r="1" />
            <circle cx="5" cy="13" r="1" />
            <circle cx="11" cy="13" r="1" />
          </svg>
        </button>
      }
    />
  )
}

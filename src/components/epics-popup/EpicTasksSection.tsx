import PlusIcon from '@/assets/plusiconblue.svg?react'
import type { Task } from '@/types/addTask.types'
import { EpicTasksEmpty } from './EpicTasksEmpty'
import { EpicTasksList } from './EpicTasksList'

type TasksStatus = 'idle' | 'loading' | 'success' | 'error'

interface EpicTasksSectionProps {
  tasks: Task[]
  status: TasksStatus
  error: string | null
  onRetry: () => void
  onAddTask?: () => void
  onTaskClick?: (taskId: string) => void
}

export function EpicTasksSection({
  tasks,
  status,
  error,
  onRetry,
  onAddTask,
  onTaskClick,
}: EpicTasksSectionProps) {
  return (
    <section className="mt-6 md:mt-9">
      <div className="flex min-h-7 items-center justify-between">
        <h3 className="text-slate-dark text-sm font-bold uppercase md:text-lg md:font-semibold md:normal-case">
          Epic Tasks
        </h3>

        <button
          type="button"
          onClick={onAddTask}
          className="text-primary flex cursor-pointer items-center gap-1 text-sm font-semibold"
        >
          <PlusIcon aria-hidden="true" className="size-3" />
          Add New Task
        </button>
      </div>

      <div className="mt-5 md:mt-6">
        {status === 'loading' && (
          <div aria-label="Loading epic tasks" className="flex flex-col gap-3" role="status">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="border-surface-highest/60 bg-authcard shadow-button grid animate-pulse grid-cols-[minmax(0,1fr)_auto] gap-4 rounded-lg border px-4 py-4 md:grid-cols-[minmax(0,1fr)_minmax(8rem,auto)_8rem] md:rounded-md md:shadow-none"
              >
                <div className="col-span-2 h-4 w-3/4 rounded bg-surface-highest md:col-span-1" />
                <div className="h-4 w-24 rounded bg-surface-highest" />
                <div className="h-4 w-20 rounded bg-surface-highest" />
              </div>
            ))}
          </div>
        )}

        {status === 'success' && tasks.length === 0 && (
          <EpicTasksEmpty onAddTask={onAddTask} />
        )}

        {status === 'success' && tasks.length > 0 && (
          <EpicTasksList tasks={tasks} onTaskClick={onTaskClick} />
        )}

        {status === 'error' && (
          <div role="alert" className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-slate-medium text-sm">
              {error ?? 'Unable to load epic tasks.'}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="text-primary text-sm font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

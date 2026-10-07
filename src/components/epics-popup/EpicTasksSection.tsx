import PlusIcon from '@/assets/plusiconblue.svg?react'
import { EpicTasksEmpty } from './EpicTasksEmpty'

interface EpicTasksSectionProps {
  onAddTask?: () => void
}

export function EpicTasksSection({ onAddTask }: EpicTasksSectionProps) {
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
        <EpicTasksEmpty onAddTask={onAddTask} />
      </div>
    </section>
  )
}

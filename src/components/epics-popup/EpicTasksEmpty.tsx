import PlusIcon from '@/assets/plusiconwhite.svg?react'
import TaskListIcon from '@/assets/TaskListIcon.svg?react'

interface EpicTasksEmptyProps {
  onAddTask?: () => void
}

export function EpicTasksEmpty({ onAddTask }: EpicTasksEmptyProps) {
  return (
    <div className="border-slate-light/70 bg-surface-low flex flex-col items-center gap-4 rounded-lg border-2 border-dashed px-4 py-8 md:py-12">
      <div
        aria-hidden="true"
        className="bg-surface-highest text-primary flex size-12 items-center justify-center rounded-lg"
      >
        <TaskListIcon />
      </div>

      <p className="text-slate-dark max-w-44 text-center text-base font-medium md:max-w-none">
        No tasks have been added to this epic yet
      </p>

      <button
        type="button"
        onClick={onAddTask}
        className="bg-primary -mt-1 flex h-8 cursor-pointer items-center gap-2 rounded-xs px-4 text-sm font-semibold text-white md:mt-0 md:h-11 md:px-6 md:text-base"
      >
        <PlusIcon aria-hidden="true" className="size-3.5 md:size-4"  />
        Add New Task
      </button>
    </div>
  )
}
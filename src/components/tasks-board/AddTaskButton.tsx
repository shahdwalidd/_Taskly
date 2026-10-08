import PlusIcon from '@/assets/plusiconwhite.svg?react'


export function AddTaskButton() {
  return (
    <button
      type="button"
      className="bg-gradient flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-sm text-[11px] font-bold tracking-widest text-white uppercase"
    >
      <PlusIcon aria-hidden="true" className="size-3.5" />
      Add new task
    </button>
  )
}
import PlusIcon from '@/assets/plusiconwhite.svg?react'

interface AddTaskButtonProps {
  onClick: () => void
}

export function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-gradient flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-sm text-[11px] font-bold tracking-widest text-white uppercase"
    >
      <PlusIcon aria-hidden="true" className="size-3.5" />
      Add new task
    </button>
  )
}
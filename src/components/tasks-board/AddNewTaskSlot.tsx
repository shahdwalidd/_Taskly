import AddCircleIcon from '@/assets/AddCircleIcon.svg?react'

interface AddNewTaskSlotProps {
  onClick: () => void
}

export function AddNewTaskSlot({ onClick }: AddNewTaskSlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-slate-light/60 text-slate-medium/80 flex h-13 w-full cursor-pointer items-center justify-center gap-4 rounded-md border-2 border-dashed text-[11px] font-bold tracking-widest uppercase"
    >
      <AddCircleIcon aria-hidden="true" className="size-4" />
      Add new task
    </button>
  )
}
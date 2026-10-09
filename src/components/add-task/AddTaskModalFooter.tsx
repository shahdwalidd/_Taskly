interface AddTaskModalFooterProps {
  onClose: () => void
}


export function AddTaskModalFooter({ onClose }: AddTaskModalFooterProps) {
  return (
    <div className="bg-surface-low hidden h-18 shrink-0 items-center justify-between px-8 md:flex">
      <button
        type="button"
        onClick={onClose}
        className="bg-surface-highest text-slate-dark h-9 cursor-pointer rounded-sm px-4 text-sm font-semibold"
      >
        Close
      </button>

      <button
        type="submit"
        className="bg-primary h-10 cursor-pointer rounded-sm px-8 text-sm font-semibold text-white"
      >
        Add Task
      </button>
    </div>
  )
}
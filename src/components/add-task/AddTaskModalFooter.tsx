interface AddTaskModalFooterProps {
  onClose: () => void
  isSubmitting?: boolean
}


export function AddTaskModalFooter({ onClose, isSubmitting = false }: AddTaskModalFooterProps) {
  return (
    <div className="bg-surface-low hidden h-18 shrink-0 items-center justify-between px-8 md:flex">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="bg-surface-highest text-slate-dark h-9 cursor-pointer rounded-sm px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        Close
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary h-10 cursor-pointer rounded-sm px-8 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </div>
  )
}
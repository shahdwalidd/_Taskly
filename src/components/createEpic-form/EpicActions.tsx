interface EpicActionsProps {
  onCancel: () => void
  submitLabel: string
  isSubmitting?: boolean
}

export function EpicActions({
  onCancel,
  submitLabel,
  isSubmitting = false,
}:EpicActionsProps) {
  return (
    <div className="border-border-subtle mt-8 flex flex-col-reverse gap-4 border-t pt-8 md:flex-row md:items-center md:justify-end md:gap-8">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="text-button text-slate-medium hover:text-slate-dark cursor-pointer text-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient shadow-invite-button text-button h-12 w-full cursor-pointer rounded-md px-8 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {isSubmitting ? 'Creating...' : submitLabel}
      </button>
    </div>
  )
}
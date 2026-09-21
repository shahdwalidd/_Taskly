interface FormActionsProps {
  onBack: () => void
  submitLabel: string
  isSubmitting?: boolean
}

export function FormActions({
  onBack,
  submitLabel,
  isSubmitting = false,
}: FormActionsProps) {
  return (
    <div className="mt-8 flex flex-col-reverse items-center gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
      <button
        type="button"
        onClick={onBack}
        className="text-boy-sm text-slate-medium hover:text-slate-dark font-bold"
      >
        Back
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-authcard w-full rounded-sm px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {isSubmitting ? 'Creating...' : submitLabel}
      </button>
    </div>
  )
}

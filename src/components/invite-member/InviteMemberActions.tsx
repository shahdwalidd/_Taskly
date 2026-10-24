interface InviteMemberActionsProps {
  onCancel: () => void
  isSubmitting?: boolean
}

export function InviteMemberActions({
  onCancel,
  isSubmitting = false,
}: InviteMemberActionsProps) {
  return (
    <div className="mt-10 flex flex-col-reverse gap-2.5 md:grid md:grid-cols-2 md:gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="text-grey md:text-slate-medium h-12 cursor-pointer rounded-md text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient shadow-invite-button h-13 cursor-pointer rounded-lg text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 md:h-12 md:rounded-md"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span
              className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              aria-hidden="true"
            />
            Sending...
          </span>
        ) : (
          'Send Invitation'
        )}
      </button>
    </div>
  )
}

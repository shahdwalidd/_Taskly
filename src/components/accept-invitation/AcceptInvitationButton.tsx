interface AcceptInvitationButtonProps {
  onAccept?: () => void
  disabled?: boolean
  isLoading?: boolean
}

export function AcceptInvitationButton({
  onAccept,
  disabled = false,
  isLoading = false,
}: AcceptInvitationButtonProps) {
  return (
    <button
      className="flex h-13 w-full items-center justify-center gap-2 rounded-xs bg-invitation-button px-6 py-4 text-sm leading-5 font-semibold text-white shadow-invite-button transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
      type="button"
      onClick={onAccept}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
      )}
      {isLoading ? 'Accepting Invitation...' : 'Accept Invitation'}
    </button>
  )
}

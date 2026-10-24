interface AcceptInvitationButtonProps {
  onAccept?: () => void
}

export function AcceptInvitationButton({ onAccept }: AcceptInvitationButtonProps) {
  return (
    <button
      className="flex h-13 w-full cursor-pointer items-center justify-center rounded-xs bg-invitation-button px-6 py-4 text-sm leading-5 font-semibold text-white shadow-invite-button transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
      type="button"
      onClick={onAccept}
    >
      Accept Invitation
    </button>
  )
}

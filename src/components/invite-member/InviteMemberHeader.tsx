import CloseIcon from '@/assets/CloseIcon (2).svg?react'
import InviteTeamIcon from '@/assets/InviteTeamIcon.svg?react'

interface InviteMemberHeaderProps {
  onClose: () => void
  isSubmitting?: boolean
}

export function InviteMemberHeader({
  onClose,
  isSubmitting = false,
}: InviteMemberHeaderProps) {
  return (
    <div className="flex items-start justify-between md:items-center">
      <span
        aria-hidden="true"
        className="bg-surface-low text-primary flex size-12 items-center justify-center rounded-lg"
      >
        <InviteTeamIcon className="size-icon-eye-width" />
      </span>

      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        aria-label="Close"
        className="text-slate-medium flex size-8 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-60 md:-mr-2"
      >
        <CloseIcon aria-hidden="true" className="size-6" />
      </button>
    </div>
  )
}
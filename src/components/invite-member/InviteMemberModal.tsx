import { createPortal } from 'react-dom'
import { InviteEmailField } from './InviteEmailField'
import { InviteMemberActions } from './InviteMemberActions'
import { InviteMemberHeader } from './InviteMemberHeader'

interface InviteMemberModalProps {
  email: string
  onEmailChange: (value: string) => void
  emailError?: string
  requestError?: string
  successMessage?: string
  workspaceName?: string
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: () => void
}

export function InviteMemberModal({
  email,
  onEmailChange,
  emailError,
  requestError,
  successMessage,
  workspaceName = 'Architectural Studio',
  isSubmitting = false,
  onClose,
  onSubmit,
}: InviteMemberModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        aria-hidden="true"
        onClick={isSubmitting ? undefined : onClose}
        className="bg-slate-dark/40 absolute inset-0 backdrop-blur-sm"
      />

      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-member-title"
        aria-busy={isSubmitting}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
        className="bg-authcard shadow-card relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl p-8 md:w-md md:rounded-lg"
      >
        {/* Mobile bottom-sheet handle */}
        <div
          aria-hidden="true"
          className="bg-surface-highest mx-auto mb-2.5 h-1.5 w-12 rounded-full md:hidden"
        />

        <InviteMemberHeader onClose={onClose} isSubmitting={isSubmitting} />

        <h2
          id="invite-member-title"
          className="text-slate-dark mt-1 text-2xl font-bold tracking-tight md:mt-2.5"
        >
          Invite Team Member
        </h2>

        <p className="text-slate-medium mt-4 text-sm md:mt-1.5">
          Send an invitation to join the {workspaceName} workspace.
        </p>

        <div className="mt-4 md:mt-6">
          <InviteEmailField
            value={email}
            onChange={onEmailChange}
            error={emailError}
          />
        </div>

        {requestError && (
          <p className="text-label-sm text-error mt-4" role="alert">
            {requestError}
          </p>
        )}

        {successMessage && (
          <p
            className="text-label-sm text-darkgreen mt-4"
            role="status"
            aria-live="polite"
          >
            {successMessage}
          </p>
        )}

        <InviteMemberActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </div>,
    document.body,
  )
}

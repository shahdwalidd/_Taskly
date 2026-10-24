import { AcceptInvitationButton } from './AcceptInvitationButton'
import { ProjectInvitationBadge } from './ProjectInvitationBadge'

interface InvitationCardProps {
  onAccept?: () => void
}

export function InvitationCard({ onAccept }: InvitationCardProps) {
  return (
    <section
      className="relative isolate flex w-full flex-col items-center overflow-hidden rounded-md bg-authcard p-12 shadow-invitation-card max-sm:px-6 max-sm:py-10"
      aria-labelledby="invitation-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-0 h-1 bg-invitation-accent"
      />
      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="flex self-center pb-6">
          <ProjectInvitationBadge />
        </div>

        <h1
          className="mb-4 flex min-h-18 w-full max-w-invitation-title items-center justify-center text-center text-pp text-slate-dark max-sm:text-invitation-mobile"
          id="invitation-title"
        >
          You've been invited to join new project
        </h1>

        <AcceptInvitationButton onAccept={onAccept} />
      </div>
    </section>
  )
}

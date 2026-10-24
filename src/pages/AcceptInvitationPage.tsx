import { InvitationBrand } from '@/components/accept-invitation/InvitationBrand'
import { InvitationCard } from '@/components/accept-invitation/InvitationCard'

interface AcceptInvitationPageProps {
  onAccept?: () => void
}

export function AcceptInvitationPage({ onAccept }: AcceptInvitationPageProps) {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center bg-background px-6 py-12 max-sm:py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-invitation-glow bg-no-repeat"
      />
      <div className="relative z-10 flex w-full max-w-(--layout-auth-width) flex-col items-center gap-12 max-sm:gap-8">
        <InvitationBrand />
        <InvitationCard onAccept={onAccept} />
      </div>
    </main>
  )
}

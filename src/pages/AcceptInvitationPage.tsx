import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { InvitationBrand } from '@/components/accept-invitation/InvitationBrand'
import { InvitationCard } from '@/components/accept-invitation/InvitationCard'
import { useAcceptInvitation } from '@/hooks/useAcceptInvitation'
import { useAuth } from '@/hooks/useAuth'

export function AcceptInvitationPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { isauth, isloading } = useAuth()
  const token = searchParams.get('token')?.trim() ?? ''
  const { state, error, accept } = useAcceptInvitation(token)
  const invitationPath = `${location.pathname}${location.search}`

  if (token && !isloading && !isauth) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(invitationPath)}`}
        replace
      />
    )
  }

  const pageContent = (
    <main className="relative isolate flex min-h-dvh items-center justify-center bg-background px-6 py-12 max-sm:py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-invitation-glow bg-no-repeat"
      />
      <div className="relative z-10 flex w-full max-w-(--layout-auth-width) flex-col items-center gap-12 max-sm:gap-8">
        <InvitationBrand />
        {isloading && token ? (
          <div className="flex min-h-48 w-full items-center justify-center" role="status" aria-label="Checking your session">
            <span className="size-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
          </div>
        ) : (
          <>
            <InvitationCard
              onAccept={() => void accept()}
              disabled={!token || state === 'success'}
              isLoading={state === 'submitting'}
              error={
                token
                  ? error
                  : 'This invitation link is missing its token. Please request a new invitation from the project admin.'
              }
              successMessage={
                state === 'success' ? 'Invitation accepted successfully.' : null
              }
            />
            {!token && (
              <Link className="text-sm font-semibold text-primary underline underline-offset-4" to="/project">
                Back to projects
              </Link>
            )}
          </>
        )}
      </div>
    </main>
  )

  return pageContent
}

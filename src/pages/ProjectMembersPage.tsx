import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { InviteMemberButton } from '@/components/project-members/invitememberbutton'
import { MembersSkeleton } from '@/components/project-members/Membersskeleton'
import { MembersTable } from '@/components/project-members/Memberstable'
import { PageBreadcrumb } from '@/components/project-form/PageBreadcrumb'
import { ErrorState } from '@/components/shared/ErrorState'

import type { Member } from '@/types/projectmembers.types'

interface ProjectMembersPageProps {
  projectId: string
  projectName: string
  members?: Member[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onInvite: () => void
}

export function ProjectMembersPage({
  projectId,
  projectName,
  members = [],
  isLoading,
  isError,
  onRetry,
  onInvite,
}: ProjectMembersPageProps) {
  return (
    <AuthenticatedLayout projectId={projectId} projectName={projectName}>
      <div className="flex flex-col gap-12 px-6 py-8 md:px-10">
        {isLoading ? (
          <MembersSkeleton />
        ) : isError ? (
          <ErrorState
            message="We couldn't load this project's information. Please try again."
            onRetry={onRetry}
          />
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <PageBreadcrumb
                items={[
                  { label: 'Projects' },
                  { label: projectName },
                  { label: 'Members', isActive: true },
                ]}
              />

              <div className="flex items-center justify-between gap-4">
                <h1 className="text-headline-lg text-slate-dark w-full text-center md:w-auto md:text-left">
                  Project Members
                </h1>
                <InviteMemberButton onClick={onInvite} />
              </div>
            </div>

            <MembersTable members={members} />
          </>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

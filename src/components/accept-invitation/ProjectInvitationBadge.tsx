import ProjectsIcon from '@/assets/icons/sideBaricons/ProjectsIcon.svg?react'

export function ProjectInvitationBadge() {
  return (
    <div className="flex min-h-invitation-badge items-center justify-center gap-1.5 rounded-lg bg-invitation-badge px-3 py-1 text-center text-label-sm text-grey uppercase whitespace-nowrap">
      <ProjectsIcon aria-hidden="true" className="h-invitation-icon-height w-3 shrink-0 opacity-80" />
      <span>New Project Invitation</span>
    </div>
  )
}

import { cn } from '@/utils/cn'
import type { MemberRole } from '@/types/projectmembers.types'
const roleStyles: Record<MemberRole, string> = {
  owner: 'bg-primary-container text-white',
  admin: 'bg-surface-highest text-grey',
  member: 'bg-surface-highest text-grey',
  viewer: 'bg-lightblue text-grey',
}

interface RoleBadgeProps {
  role: MemberRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'text-label-sm inline-flex items-center rounded-lg px-3 py-1 uppercase',
        roleStyles[role],
      )}
    >
      {role}
    </span>
  )
}

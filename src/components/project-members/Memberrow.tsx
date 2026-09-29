import { cn } from '@/utils/cn'
import type { Member } from '@/types/projectmembers.types'
import { MemberIdentity } from './MemberIdentity'
import { RoleBadge } from './Rolebadge'

interface MemberRowProps {
  member: Member
}

export function MemberRow({ member }: MemberRowProps) {
  return (
    <li
      className={cn(
        'bg-authcard md:border-border-subtle flex items-center justify-between gap-4 rounded-lg p-4 md:grid md:grid-cols-[1fr_200px] md:rounded-none md:border-b md:px-9 md:py-6 md:last:border-b-0',
      )}
    >
      <MemberIdentity name={member.name} email={member.email} />
      <div>
        <RoleBadge role={member.role} />
      </div>
    </li>
  )
}

import type { Member } from '@/types/projectmembers.types'
import { MemberRow } from './Memberrow'

interface MembersTableProps {
  members: Member[]
}

export function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="md:bg-authcard md:shadow-card mx-auto w-full max-w-2xl md:overflow-hidden md:rounded-lg">
      <div className="bg-surface-low text-label-sm text-grey hidden grid-cols-[1fr_200px] px-9 py-6 uppercase md:grid">
        <span className="text-grey text-label-sm">Member</span>
        <span className="text-grey text-label-sm">Role</span>
      </div>

      <ul className="flex flex-col gap-3 md:gap-0">
        {members.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </ul>
    </div>
  )
}

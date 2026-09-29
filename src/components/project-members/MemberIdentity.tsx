import { getInitials } from '@/utils/getInitials'
interface MemberIdentityProps {
  name: string
  email: string
}
export function MemberIdentity({ name, email }: MemberIdentityProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        aria-hidden="true"
        className="bg-surface-highest text-title-md text-primary flex size-12 shrink-0 items-center justify-center rounded-lg font-bold md:size-14"
      >
        {getInitials(name)}
      </div>
      <div className="min-w-0">
        <p className="text-slate-dark truncate text-base font-medium">{name}</p>
        <p className="text-body-md text-grey truncate">{email}</p>
      </div>
    </div>
  )
}

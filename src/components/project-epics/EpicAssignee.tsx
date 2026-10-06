import { getInitials } from '@/utils/getInitials'

interface EpicAssigneeProps {
  name: string
  avatarUrl?: string
}

export function EpicAssignee({ name, avatarUrl }: EpicAssigneeProps) {
  return (
    <div className="flex items-center gap-3">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="size-7 shrink-0 rounded-full object-cover md:size-10"
        />
      ) : (
        <div
          aria-hidden="true"
          className="bg-primary flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white md:size-10 md:rounded-lg md:text-sm"
        >
          {getInitials(name)}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-grey text-xs">Assignee</p>
        <p className="text-slate-dark truncate text-sm font-semibold">{name}</p>
      </div>
    </div>
  )
}

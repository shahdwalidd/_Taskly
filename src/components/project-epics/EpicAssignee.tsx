import { getInitials } from '@/utils/getInitials'

interface EpicAssigneeProps {
  name: string
}

export function EpicAssignee({ name }: EpicAssigneeProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="bg-primary flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white md:size-10 md:rounded-lg md:text-sm"
      >
        {getInitials(name)}
      </div>
      <div className="min-w-0">
        <p className="text-grey text-xs">Assignee</p>
        <p className="text-slate-dark truncate text-sm font-semibold">{name}</p>
      </div>
    </div>
  )
}
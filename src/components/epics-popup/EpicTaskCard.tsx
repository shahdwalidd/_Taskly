import AlertTriangleIcon from '@/assets/AlertTriangleIcon.svg?react'
import CalendarIcon from '@/assets/CalendarIcon.svg?react'
import { EpicTaskAvatar } from './EpicTaskAvatar'

interface EpicTaskCardProps {
  title: string
  assigneeName?: string
  assigneeAvatar?: string
  dueDate?: string
  isOverdue?: boolean
  onClick?: () => void
}

export function EpicTaskCard({
  title,
  assigneeName,
  assigneeAvatar,
  dueDate,
  isOverdue = false,
  onClick,
}: EpicTaskCardProps) {
  return (
    <button type="button" onClick={onClick} className="border-surface-highest/60 bg-authcard shadow-button grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 rounded-lg border px-4 pt-3.5 pb-4 text-left md:rounded-none md:border-0 md:py-4 md:pr-11 md:shadow-none">
      <h4
        title={title}
        className="text-slate-dark col-span-2 truncate text-sm leading-6 font-medium md:col-span-1 md:text-base"
      >
        {title}
      </h4>

      <div className="mt-2.5 flex min-w-0 items-center gap-2 md:mt-1">
        <EpicTaskAvatar name={assigneeName} avatarUrl={assigneeAvatar} />
        <span className="text-slate-medium truncate text-xs">
          {assigneeName ?? 'Unassigned'}
        </span>
      </div>

      {dueDate && (
        <div className="mt-2.5 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:text-right">
          <p
            className={`flex items-center gap-1.5 text-xs uppercase md:hidden ${
              isOverdue ? 'text-error font-bold' : 'text-slate-medium font-medium'
            }`}
          >
            {isOverdue ? (
              <AlertTriangleIcon aria-hidden="true" className="size-3 shrink-0" />
            ) : (
              <CalendarIcon aria-hidden="true" className="size-3 shrink-0" />
            )}
            {isOverdue ? 'OVERDUE' : dueDate}
          </p>

          <div className="hidden md:block">
            <p className="text-overlay-gray text-[9px] leading-4 font-bold tracking-wider uppercase">
              Due date
            </p>
            <p
              className={`text-xs leading-4 ${isOverdue ? 'text-error font-medium' : 'text-slate-dark'}`}
            >
              {isOverdue ? 'OVERDUE' : dueDate}
            </p>
          </div>
        </div>
      )}
    </button>
  )
}

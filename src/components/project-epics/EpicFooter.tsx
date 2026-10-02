import CalendarIcon from '@/assets/CalendarIcon.svg?react'
import CreatedByIcon from '@/assets/CreatedByIcon.svg?react'
import { formDate } from '@/utils/formatDate'

interface EpicCardFooterProps {
  createdBy: string
  date: string
}

export function EpicCardFooter({ createdBy, date }: EpicCardFooterProps) {
  return (
    <div className="border-border-subtle text-slate-medium mt-6 flex items-center justify-between gap-2 border-t pt-4 text-[11px]">
      <p className="flex min-w-0 items-center gap-1.5">
        <CreatedByIcon className="shrink-0" />
        <span className="truncate">
          Created by:{' '}
          <span className="text-slate-dark font-medium">{createdBy}</span>
        </span>
      </p>

      <p className="flex shrink-0 items-center gap-1.5">
        <CalendarIcon />
        {date ? formDate(date) : 'No deadline'}
      </p>
    </div>
  )
}
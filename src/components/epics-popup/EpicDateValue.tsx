import CalendarIcon from '@/assets/CalendarIcon.svg?react'
import { EpicValueBox } from './Epicvaluebox'

interface EpicDateValueProps {
  date?: string 
  withChevron?: boolean
}

export function EpicDateValue({
  date,
  withChevron = false,
}: EpicDateValueProps) {
  return (
    <EpicValueBox withChevron={withChevron}>
      <CalendarIcon aria-hidden="true" className="text-grey size-4 shrink-0" />
      {date ? (
        <span className="truncate">{date}</span>
      ) : (
        <span className="text-slate-medium">No deadline</span>
      )}
    </EpicValueBox>
  )
}
import CalendarIcon from '@/assets/CalendarIcon.svg?react'
import ChevronIcon from '@/assets/selecticon.svg?react'
import { TaskField } from './TaskField'
import { formDate } from '@/utils/formatDate'

interface TaskDateFieldProps {
  id: string
  label: string
  value: string // YYYY-MM-DD or ''
  onChange: (value: string) => void
}



export function TaskDateField({
  id,
  label,
  value,
  onChange,
}: TaskDateFieldProps) {
  return (
    <TaskField id={id} label={label}>
      <div className="border-surface-highest bg-authcard focus-within:ring-primary-container relative flex h-10 items-center gap-2 rounded-md border px-2 text-xs focus-within:ring-2">
        <CalendarIcon aria-hidden="true" className="text-grey size-4 shrink-0" />

        {value ? (
          <span className="text-slate-dark truncate font-medium">
            {formDate(value)}
          </span>
        ) : (
          <span className="text-slate-medium">mm/dd/yyyy</span>
        )}

        <ChevronIcon aria-hidden="true" className="text-grey ml-auto shrink-0" />

        <input
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={(event) => event.currentTarget.showPicker?.()}
          className="absolute inset-0 size-full cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
      </div>
    </TaskField>
  )
}
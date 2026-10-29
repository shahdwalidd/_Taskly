import CalendarIcon from '@/assets/CalendarIcon.svg?react'
import ChevronIcon from '@/assets/selecticon.svg?react'
import { TaskField } from './TaskField'
import { formDate, formatTaskDetailsDate } from '@/utils/formatDate'

interface TaskDateFieldProps {
  id: string
  label: string
  value: string // YYYY-MM-DD or ''
  onChange: (value: string) => void
  readOnly?: boolean
  disabled?: boolean
  min?: string
  clearable?: boolean
  emptyLabel?: string
}



export function TaskDateField({
  id,
  label,
  value,
  onChange,
  readOnly = false,
  disabled = false,
  min,
  clearable = false,
  emptyLabel = '—',
}: TaskDateFieldProps) {
  return (
    <TaskField id={id} label={label}>
      <div className={`border-surface-highest bg-authcard focus-within:ring-primary-container relative flex h-10 items-center gap-2 rounded-md border px-2 text-xs focus-within:ring-2 ${disabled ? 'opacity-60' : ''}`}>
        <CalendarIcon aria-hidden="true" className="text-grey size-4 shrink-0" />

        {value ? (
          <span className="text-slate-dark truncate font-medium">
            {readOnly ? formatTaskDetailsDate(value) : formDate(value)}
          </span>
        ) : (
          <span className="text-slate-medium">{readOnly ? emptyLabel : 'mm/dd/yyyy'}</span>
        )}

        <ChevronIcon aria-hidden="true" className="text-grey ml-auto shrink-0" />

        {clearable && value && !readOnly && (
          <button
            type="button"
            aria-label={`Clear ${label.toLowerCase()}`}
            disabled={disabled}
            onClick={() => onChange('')}
            className="text-grey relative z-10 -mr-1 flex size-6 shrink-0 items-center justify-center text-base leading-none disabled:opacity-60"
          >
            ×
          </button>
        )}

        {!readOnly && <input
          id={id}
          type="date"
          value={value}
          min={min}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onClick={(event) => event.currentTarget.showPicker?.()}
          className={`absolute inset-y-0 left-0 z-0 cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer ${clearable ? 'right-8' : 'right-0'}`}
        />}
      </div>
    </TaskField>
  )
}

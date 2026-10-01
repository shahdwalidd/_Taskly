import ErrorIcon from '@/assets/erroricon.svg?react'
import { getTodayISO } from '@/utils/formatDate'

interface DeadlineFieldProps {
  id: string
  value?: string
  onChange: (value: string) => void
  error?: string
  min?: string
}

export function DeadlineField({
  id,
  value = '',
  onChange,
  error,
  min,
}: DeadlineFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-label-sm text-grey uppercase">
        Deadline
      </label>

      <input
        id={id}
        type="date"
        value={value}
        min={min ?? getTodayISO()}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="bg-surface-highest text-slate-dark focus:ring-primary-container h-12 w-full rounded-md px-4 text-base outline-none focus:ring-2 md:h-13"
      />

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-label-sm text-error flex items-center gap-2 uppercase"
        >
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  )
}
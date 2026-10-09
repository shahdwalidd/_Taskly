import { TaskField } from './TaskField'
import ErrorIcon from '@/assets/erroricon.svg?react'

interface TaskTitleFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function TaskTitleField({ value, onChange, error }: TaskTitleFieldProps) {
  return (
    <TaskField id="task-title" label="Title">
      <input
        id="task-title"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g., Finalize structural schematics"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'task-title-error' : undefined}
        className="border-surface-highest bg-authcard text-slate-dark placeholder:text-slate-medium focus:ring-primary-container aria-invalid:border-error h-13.25 w-full rounded-lg border px-3 text-sm font-semibold outline-none placeholder:text-xs placeholder:font-normal focus:ring-2"
      />
      {error && (
        <p id="task-title-error" role="alert" className="text-label-sm text-error -mt-1 flex items-center gap-2 uppercase">
          <ErrorIcon aria-hidden="true" />
          {error}
        </p>
      )}
    </TaskField>
  )
}
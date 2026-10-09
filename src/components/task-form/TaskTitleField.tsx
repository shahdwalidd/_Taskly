import { TaskField } from './TaskField'

interface TaskTitleFieldProps {
  value: string
  onChange: (value: string) => void
}

export function TaskTitleField({ value, onChange }: TaskTitleFieldProps) {
  return (
    <TaskField id="task-title" label="Title">
      <input
        id="task-title"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g., Finalize structural schematics"
        className="border-surface-highest bg-authcard text-slate-dark placeholder:text-slate-medium focus:ring-primary-container h-13.25 w-full rounded-lg border px-3 text-sm font-semibold outline-none placeholder:text-xs placeholder:font-normal focus:ring-2"
      />
    </TaskField>
  )
}
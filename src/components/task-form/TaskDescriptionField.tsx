import { TaskField } from './TaskField'

interface TaskDescriptionFieldProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  placeholder?: string
}

export function TaskDescriptionField({
  value,
  onChange,
  readOnly = false,
  placeholder = 'Provide detailed context for this task...',
}: TaskDescriptionFieldProps) {
  return (
    <TaskField id="task-description" label="Description">
      <textarea
        id="task-description"
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="border-surface-highest bg-authcard text-slate-dark placeholder:text-slate-medium focus:ring-primary-container h-47 w-full resize-none rounded-lg border p-3 text-sm leading-normal outline-none placeholder:text-xs focus:ring-2 read-only:cursor-default read-only:outline-none read-only:focus:ring-0 md:h-117.5"
      />
    </TaskField>
  )
}

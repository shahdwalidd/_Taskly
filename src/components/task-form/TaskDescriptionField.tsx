import { TaskField } from './TaskField'

interface TaskDescriptionFieldProps {
  value: string
  onChange: (value: string) => void
}

export function TaskDescriptionField({
  value,
  onChange,
}: TaskDescriptionFieldProps) {
  return (
    <TaskField id="task-description" label="Description">
      <textarea
        id="task-description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Provide detailed context for this task..."
        className="border-surface-highest bg-authcard text-slate-dark placeholder:text-slate-medium focus:ring-primary-container h-47 w-full resize-none rounded-lg border p-3 text-sm leading-normal outline-none placeholder:text-xs focus:ring-2 md:h-117.5"
      />
    </TaskField>
  )
}
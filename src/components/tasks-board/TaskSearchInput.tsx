import SearchIcon from '@/assets/SearchIcon.svg?react'


interface TaskSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function TaskSearchInput({ value, onChange }: TaskSearchInputProps) {
  return (
    <div className="relative w-full lg:w-64">
      <SearchIcon
        aria-hidden="true"
        className="text-slate-medium pointer-events-none absolute top-1/2 left-3 size-icon-menu-width -translate-y-1/2 lg:size-3.5"
      />
      <input
        type="text"
        inputMode="search"
        aria-label="Search tasks"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks..."
        className="bg-surface-highest text-slate-dark placeholder:text-slate-medium/70 focus:ring-primary-container h-12 w-full rounded-md pr-4 pl-10 text-base outline-none focus:ring-2 lg:h-9 lg:rounded-sm lg:text-sm"
      />
    </div>
  )
}
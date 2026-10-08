import SearchIcon from '@/assets/SearchIcon.svg?react'

interface TaskSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TaskSearchInput({
  value,
  onChange,
  placeholder = 'Search tasks...',
}: TaskSearchInputProps) {
  return (
    <div className="relative w-full">
      <SearchIcon
        aria-hidden="true"
        className="text-slate-medium pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 md:left-3 md:size-4"
      />
      <input
        type="text"
        inputMode="search"
        aria-label="Search tasks"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="bg-surface-highest text-slate-dark placeholder:text-slate-medium/70 focus:ring-primary-container h-12 w-full rounded-sm pr-4 pl-14 text-sm outline-none focus:ring-2 md:pl-9"
      />
    </div>
  )
}

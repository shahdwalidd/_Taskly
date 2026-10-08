interface TaskColumnHeaderProps {
  label: string
  count: number
  dotClass: string
  badgeClass: string
}

export function TaskColumnHeader({
  label,
  count,
  dotClass,
  badgeClass,
}: TaskColumnHeaderProps) {
  return (
    <div className="flex min-h-5 items-center gap-2">
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${dotClass}`} />
      <h2 className="text-slate-medium text-[11px] font-bold tracking-widest uppercase">
        {label}
      </h2>
      <span
        className={`ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-xs px-1 text-[10px] font-bold ${badgeClass}`}
      >
        {count}
      </span>
    </div>
  )
}
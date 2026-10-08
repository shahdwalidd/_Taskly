import NoTasksIcon from '@/assets/NoTasksIcon.svg?react'
import { cn } from '@/utils/cn'

interface EmptyTaskPanelProps {
  className?: string
}

export function EmptyTaskPanel({ className }: EmptyTaskPanelProps) {
  return (
    <div
      className={cn(
        'border-slate-light/40 bg-surface-low/50 flex flex-col items-center justify-center gap-3.5 rounded-lg border border-dashed',
        className,
      )}
    >
      <NoTasksIcon aria-hidden="true" className="text-slate-medium/60 size-7" />
      <p className="text-slate-medium/60 text-[11px] font-bold tracking-widest uppercase">
        No tasks
      </p>
    </div>
  )
}
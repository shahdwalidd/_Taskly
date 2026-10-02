import { cn } from '@/utils/cn'

const bar = 'animate-pulse bg-lightblue'

export function EpicCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-authcard shadow-card flex flex-col rounded-md p-4"
    >
      <div className="flex items-start justify-between">
        <div className="bg-surface-low h-5 w-20 animate-pulse rounded-sm" />
        <div className={cn(bar, 'size-8 rounded-lg')} />
      </div>

      <div className={cn(bar, 'mt-4 h-6 w-full rounded-sm')} />

      <div className="mt-8 flex items-center gap-3">
        <div className={cn(bar, 'size-8 shrink-0 rounded-lg')} />
        <div className={cn(bar, 'h-4 w-32 rounded-sm')} />
      </div>

      <div className={cn(bar, 'mt-6 h-1 w-full rounded-full')} />

      <div className="mt-2 flex items-center justify-between">
        <div className={cn(bar, 'h-3 w-12 rounded-sm')} />
        <div className={cn(bar, 'h-3 w-12 rounded-sm')} />
      </div>
    </div>
  )
}
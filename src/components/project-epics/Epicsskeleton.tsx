import { cn } from '@/utils/cn'
import { EpicCardSkeleton } from './Epiccardskeleton'

const bar = 'animate-pulse bg-lightblue'

export function EpicsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading epics"
      className="flex flex-col gap-6 md:gap-12"
    >
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="hidden items-center gap-2 md:flex">
          <div className={cn(bar, 'h-4 w-16 rounded-sm')} />
          <span aria-hidden="true" className="text-slate-light text-xs">
            ›
          </span>
          <div className={cn(bar, 'h-4 w-24 rounded-sm')} />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className={cn(bar, 'hidden h-10 w-64 rounded-md md:block')} />

          <div className="flex w-full items-center gap-4 lg:w-auto">
            <div
              className={cn(
                bar,
                'h-12 flex-1 rounded-sm md:h-10 lg:w-32 lg:flex-none',
              )}
            />
            <div className={cn(bar, 'hidden h-10 w-40 rounded-sm md:block')} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <EpicCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

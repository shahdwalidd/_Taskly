import { cn } from '@/utils/cn'

const bar = 'animate-pulse rounded-md bg-surface-highest/60'

export function MembersSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading project members"
      className="flex flex-col gap-12"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className={cn(bar, 'hidden h-3 w-40 md:block')} />
          <div className={cn(bar, 'h-10 w-64')} />
          <div className={cn(bar, 'hidden h-4 w-96 md:block')} />
        </div>
        <div className={cn(bar, 'hidden h-12 w-45 md:block')} />
      </div>

      <div className="bg-authcard mx-auto w-full max-w-2xl rounded-lg p-4 md:px-9 md:py-6">
        <div className="flex flex-col gap-10">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={cn(bar, 'size-12 rounded-lg md:size-14')} />
                <div className={cn(bar, 'h-4 w-40')} />
              </div>
              <div className={cn(bar, 'h-4 w-24')} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

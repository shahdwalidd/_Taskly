import type { ReactNode } from 'react'
import ChevronIcon from '@/assets/selecticon(2).svg?react'

interface EpicValueBoxProps {
  children: ReactNode
  withChevron?: boolean
}

export function EpicValueBox({
  children,
  withChevron = false,
}: EpicValueBoxProps) {
  return (
    <div className="border-surface-highest bg-authcard text-slate-dark flex h-10 items-center gap-2 rounded-md border px-2 text-base md:px-2.5 md:text-sm">
      {children}
      {withChevron && (
        <ChevronIcon
          aria-hidden="true"
          className="text-slate-medium ml-auto shrink-0"
        />
      )}
    </div>
  )
}

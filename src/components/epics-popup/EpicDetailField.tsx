import type { ReactNode } from 'react'

interface EpicDetailFieldProps {
  label: string
  children: ReactNode
}

export function EpicDetailField({ label, children }: EpicDetailFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-overlay-gray text-[10px] leading-5 font-bold tracking-wider uppercase">
        {label}
      </span>
      {children}
    </div>
  )
}

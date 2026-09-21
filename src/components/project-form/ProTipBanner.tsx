import LightIcon from '@/assets/LightIcon.svg?react'

interface ProTipBannerProps {
  message: string
  className?: string
}

export function ProTipBanner({ message, className = '' }: ProTipBannerProps) {
  return (
    <div
      className={`bg-surface-low flex w-full items-start gap-3 rounded-b-md px-6 py-4 md:px-8 ${className}`}
    >
      <LightIcon className="text-slate-medium mt-0.5 h-5 w-5 shrink-0" />
      <p className="text-span-sm text-slate-medium font-normal">
        <span className="font-bold">Pro Tip:</span> {message}
      </p>
    </div>
  )
}

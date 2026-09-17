import LightIcon from "../../assets/LightIcon.svg?react"

interface ProTipBannerProps {
  message: string;
  className?: string;
}

export function ProTipBanner({ message, className = "" }: ProTipBannerProps) {
  return (
    <div className={`flex w-full items-start gap-3 rounded-b-md bg-surface-low px-6 py-4 md:px-8 ${className}`}>
      <LightIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-medium" />
      <p className="text-span-sm font-normal text-slate-medium">
        <span className="font-bold">Pro Tip:</span> {message}
      </p>
    </div>
  )
}








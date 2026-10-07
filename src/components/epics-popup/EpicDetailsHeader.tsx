import CloseIcon from '@/assets/CloseIcon (2).svg?react'
import CopyLinkIcon from '@/assets/CopyLinkIcon.svg?react'
import EpicIcon from '@/assets/EpicIcon.svg?react'
interface EpicDetailsHeaderProps {
  code: string
  onCopyLink: () => void
  onClose: () => void
}
export function EpicDetailsHeader({
  code,
  onCopyLink,
  onClose,
}: EpicDetailsHeaderProps) {
  return (
    <div className="flex h-8 items-center justify-between gap-4">
      <div className="text-slate-medium flex items-center gap-2 text-xs font-bold tracking-wider">
        <EpicIcon aria-hidden="true" className="text-primary" />
        <span>{code}</span>
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onCopyLink}
          className="text-grey flex cursor-pointer items-center gap-2 text-sm"
        >
          <CopyLinkIcon aria-hidden="true" />
          Copy link
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-grey cursor-pointer"
        >
          <CloseIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

import CopyLinkIcon from '@/assets/CopyLinkIcon.svg?react'

interface TaskDetailsFooterProps {
  onClose: () => void
  onCopyLink: () => void
}

export function TaskDetailsFooter({ onClose, onCopyLink }: TaskDetailsFooterProps) {
  return (
    <footer className="bg-surface-low flex shrink-0 items-center justify-between px-6 py-4 md:px-8">
      <button
        type="button"
        onClick={onClose}
        className="bg-surface-highest text-slate-dark cursor-pointer rounded-sm px-4 py-2 text-sm font-semibold"
      >
        Close
      </button>
      <button
        type="button"
        onClick={onCopyLink}
        className="text-grey flex cursor-pointer items-center gap-2 text-sm"
      >
        <CopyLinkIcon aria-hidden="true" />
        Copy link
      </button>
    </footer>
  )
}

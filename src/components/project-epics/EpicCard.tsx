import { EpicAssignee } from './EpicAssignee'
import { EpicCardFooter } from './EpicFooter'
import { EpicId } from './EpicId'

interface EpicCardProps {
  code: string
  title: string
  assigneeName: string
  assigneeAvatar?: string
  createdBy: string
  date: string
  onClick: () => void
}

export function EpicCard({
  code,
  title,
  assigneeName,
  assigneeAvatar,
  createdBy,
  date,
  onClick,
}: EpicCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open epic ${code}: ${title}`}
      className="border-primary bg-authcard shadow-card flex w-full cursor-pointer flex-col rounded-md border-l-4 p-4 text-left"
    >
      <EpicId code={code} />

      <h3
        title={title}
        className="text-slate-dark mt-4 mb-3 truncate text-base font-semibold md:text-xl"
      >
        {title}
      </h3>

      <EpicAssignee name={assigneeName} avatarUrl={assigneeAvatar} />

      <EpicCardFooter createdBy={createdBy} date={date} />
    </button>
  )
}

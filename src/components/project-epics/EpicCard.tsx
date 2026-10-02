import { EpicAssignee } from './Epicassignee'
import { EpicCardFooter } from './EpicFooter'
import { EpicId } from './EpicId'

interface EpicCardProps {
  code: string
  title: string
  assigneeName: string
  createdBy: string
  date: string
}

export function EpicCard({
  code,
  title,
  assigneeName,
  createdBy,
  date,
}: EpicCardProps) {
  return (
    <article className="border-primary bg-authcard shadow-card flex flex-col rounded-md border-l-4 p-4">
      <EpicId code={code} />

      <h3
        title={title}
        className="text-slate-dark mt-4 mb-3 truncate text-base font-semibold md:text-xl"
      >
        {title}
      </h3>

      <EpicAssignee name={assigneeName} />

      <EpicCardFooter createdBy={createdBy} date={date} />
    </article>
  )
}
import Epicsicon from '@/assets/Epicsprimary.svg?react'
import Tasksicon from '@/assets/Tasksprimary.svg?react'
import Membersicon from '@/assets/Membersprimary.svg?react'
import Foldereicon from '@/assets/Folder-edit.svg?react'
interface ProjectCardProps {
  name: string
  description: string
  createdAt: string
  onClick: () => void
}
export function ProjectCard({
  name,
  description,
  createdAt,
  onClick,
}: ProjectCardProps) {
  return (
    <button
      className="flex min-w-0 flex-col rounded-md p-6 text-left shadow-sm"
      onClick={onClick}
    >
      <h2 className="min-w-0 wrap-break-word whitespace-normal">{name}</h2>
      <p className="wrap-break-words min-w-0 text-wrap whitespace-normal">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-between pt-4">
        <span className="text-label-xs text-primary flex gap-1">
          <Epicsicon className="h-4 w-4" />
          Epics
        </span>
        <span className="text-label-xs text-primary flex gap-1">
          <Tasksicon className="h-4 w-4" />
          Tasks
        </span>
        <span className="text-label-xs text-primary flex gap-1">
          {' '}
          <Membersicon className="h-4 w-4" />
          Members
        </span>
        <span className="text-label-xs text-primary flex gap-1">
          {' '}
          <Foldereicon className="h-4 w-4" />
          Edit
        </span>
      </div>
      <div className="border-slate-light/10 mt-4 flex items-center justify-between border-t">
        <span className="text-label-sm text-overlay-gray uppercase">
          Created At
        </span>
        <span className="text-boy-sm text-grey">{createdAt}</span>
      </div>
    </button>
  )
}

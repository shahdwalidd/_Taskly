import type { EpicListItem } from '@/types/epics.types'
import { EpicCard } from './EpicCard'

interface EpicsListProps {
  epics: EpicListItem[]
  onEpicClick: (epic: EpicListItem) => void
}

export function EpicsList({ epics, onEpicClick }: EpicsListProps) {
  return (
    <ul className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-2">
      {epics.map((epic) => (
        <li key={epic.id}>
          <EpicCard
            code={epic.code}
            title={epic.title}
            assigneeName={epic.assigneeName}
            assigneeAvatar={epic.assigneeAvatar}
            createdBy={epic.createdBy}
            date={epic.date}
            onClick={() => onEpicClick(epic)}
          />
        </li>
      ))}
    </ul>
  )
}

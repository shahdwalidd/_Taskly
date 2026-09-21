import { useState } from 'react'
import { SidebarNavItem } from '@/components/auth-layout/SidebarNavItem'
import FolderIcon from '@/assets/icons/sideBaricons/ActiveProjectIcon.svg?react'
import EpicsIcon from '@/assets/icons/sideBaricons/EpicsIcon.svg?react'
import TasksIcon from '@/assets/icons/sideBaricons/TasksIcon.svg?react'
import MembersIcon from '@/assets/icons/sideBaricons/MembersIcon.svg?react'
import DetailsIcon from '@/assets/icons/sideBaricons/DetailsIcon.svg?react'
import ChevronIcon from '@/assets/icons/sideBaricons/ArrowbottomIcon.svg?react'
const projectLinks = [
  { icon: EpicsIcon, label: 'Epics' },
  { icon: TasksIcon, label: 'Tasks' },
  { icon: MembersIcon, label: 'Members' },
  { icon: DetailsIcon, label: 'Details' },
]
interface ProjectAccordionProps {
  projectName: string
}
export function ProjectAccordion({ projectName }: ProjectAccordionProps) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="rounded-ssm bg-surface-highest overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-slate-dark flex w-full items-center justify-between px-3 py-2.5 text-sm font-bold"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-3">
          <FolderIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">{projectName}</span>
        </span>
        <ChevronIcon
          className={`h-icon-menu-width w-icon-menu-width shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="bg-background space-y-1 p-1.5">
          {projectLinks.map((link) => (
            <SidebarNavItem
              key={link.label}
              icon={link.icon}
              label={link.label}
            />
          ))}
        </div>
      )}
    </div>
  )
}

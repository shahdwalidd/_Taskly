import FolderIcon from '../../assets/icons/sideBaricons/ActiveProjectIcon.svg?react'
import EpicsIcon from '../../assets/icons/sideBaricons/EpicsIcon.svg?react'
import TasksIcon from '../../assets/icons/sideBaricons/TasksIcon.svg?react'
import MembersIcon from '../../assets/icons/sideBaricons/MembersIcon.svg?react'
import DetailsIcon from '../../assets/icons/sideBaricons/DetailsIcon.svg?react'

import type { ComponentType, SVGProps } from 'react'
interface BottomNavItem {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
}
interface BottomNavProps {
  hasActiveProject?: boolean
}
export function BottomNav({ hasActiveProject = false }: BottomNavProps) {
  const items: BottomNavItem[] = hasActiveProject
    ? [
        { icon: EpicsIcon, label: 'Epics' },
        { icon: TasksIcon, label: 'Tasks' },
        { icon: FolderIcon, label: 'Projects' },
        { icon: MembersIcon, label: 'Members' },
        { icon: DetailsIcon, label: 'Details' },
      ]
    : [{ icon: FolderIcon, label: 'Projects' }]
  return (
    <nav className="bg-surface-low fixed inset-x-0 bottom-0 z-30 flex px-7 md:hidden">
      {items.map(({ icon: Icon, label }) => {
        const isActive = label === 'Projects'
        return (
          <button
            key={label}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs ${isActive ? 'text-primary-container' : 'text-slate-dark-70'}`}
          >
            <Icon />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

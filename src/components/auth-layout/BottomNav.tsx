import FolderIcon from '@/assets/icons/sideBaricons/ActiveProjectIcon.svg?react'
import EpicsIcon from '@/assets/icons/sideBaricons/EpicsIcon.svg?react'
import TasksIcon from '@/assets/icons/sideBaricons/TasksIcon.svg?react'
import MembersIcon from '@/assets/icons/sideBaricons/MembersIcon.svg?react'
import DetailsIcon from '@/assets/icons/sideBaricons/DetailsIcon.svg?react'

import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'
interface BottomNavItem {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  path?: string
}
interface BottomNavProps {
  projectId?: string
}
export function BottomNav({ projectId }: BottomNavProps) {
  const items: BottomNavItem[] = projectId
    ? [
        { icon: EpicsIcon, label: 'Epics', path: 'epics' },
        { icon: TasksIcon, label: 'Tasks', path: 'tasks' },
        { icon: FolderIcon, label: 'Projects' },
        { icon: MembersIcon, label: 'Members', path: 'members' },
        { icon: DetailsIcon, label: 'Details', path: 'edit' },
      ]
    : [{ icon: FolderIcon, label: 'Projects' }]
  return (
    <nav className="bg-surface-low fixed inset-x-0 bottom-0 z-30 flex px-7 md:hidden">
      {items.map(({ icon: Icon, label, path }) => {
        const to =
          path && projectId ? `/project/${projectId}/${path}` : '/project'
        return (
          <NavLink
            key={label}
            to={to}
            end={label === 'Projects'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-xs ${isActive ? 'text-primary-container' : 'text-slate-dark-70'}`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

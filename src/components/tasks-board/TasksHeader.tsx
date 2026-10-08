import { PageBreadcrumb } from '@/components/project-form/PageBreadcrumb'
import { TaskSearchInput } from './TaskSearchInput'
interface TasksHeaderProps {
  projectName: string
  search: string
  onSearchChange: (value: string) => void
}
 
export function TasksHeader({
  projectName,
  search,
  onSearchChange,
}: TasksHeaderProps) {
  return (
    <header className="flex flex-col gap-6">
      <div className="hidden md:block">
        <PageBreadcrumb
          items={[
            { label: 'Projects' },
            { label: projectName },
            { label: 'Tasks', isActive: true },
          ]}
        />
      </div>
 
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-pp text-slate-dark">Active Workboard</h1>
          <p className="text-body-md text-slate-medium hidden md:block">
            Curating {projectName}&apos;s production pipeline and milestones.
          </p>
        </div>
 
        <TaskSearchInput value={search} onChange={onSearchChange} />
      </div>
    </header>
  )
}
 
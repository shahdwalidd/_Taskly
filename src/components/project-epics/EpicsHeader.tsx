import { PageBreadcrumb } from '@/components/project-form/PageBreadcrumb'
import { EpicSearchInput } from './EpicsSearch'
import { NewEpicButton } from './NewEpicButton'

interface EpicsHeaderProps {
  projectName: string
  search: string
  onSearchChange: (value: string) => void
  onNewEpic: () => void
}

export function EpicsHeader({
  projectName,
  search,
  onSearchChange,
  onNewEpic,
}: EpicsHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <div className="hidden md:block">
        <PageBreadcrumb
          items={[
            { label: 'Projects' },
            { label: projectName },
            { label: 'Epics', isActive: true },
          ]}
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-slate-dark text-pp max-md:sr-only">
          Project Epics
        </h1>

        <div className="flex w-full items-center gap-4 lg:w-auto lg:gap-8">
          <div className="w-full lg:w-75">
            <EpicSearchInput value={search} onChange={onSearchChange} />
          </div>
          <NewEpicButton onClick={onNewEpic} />
        </div>
      </div>
    </header>
  )
}
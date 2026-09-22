import { useLocation, useParams } from 'react-router-dom'
import { AuthenticatedLayout } from '@/components/auth-layout/AuthenticatedLayout'
import { useProjects } from '@/hooks/useProjects'

const pageTitles: Record<string, string> = {
  epics: 'Epics',
  tasks: 'Tasks',
  members: 'Members',
  edit: 'Project Details',
}

export function ProjectPage() {
  const { projectId } = useParams()
  const { pathname } = useLocation()
  const { status, projects } = useProjects()
  const project = projects.find((item) => item.id === projectId)
  const pageTitle = pageTitles[pathname.split('/').at(-1) ?? ''] ?? 'Project'

  return (
    <AuthenticatedLayout projectId={projectId} projectName={project?.name}>
      <div className="px-6 py-8 md:px-10">
        <p className="text-label-sm text-overlay-gray">
          {project?.name ?? 'Project'}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{pageTitle}</h1>
        {status === 'loading' && (
          <p className="text-slate-dark-70 mt-6 text-sm">Loading project...</p>
        )}
        {status === 'error' && (
          <p className="text-error mt-6 text-sm">
            Unable to load project details.
          </p>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

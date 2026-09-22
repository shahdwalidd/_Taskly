import { useParams } from 'react-router-dom'
import { AuthenticatedLayout } from '@/components/auth-layout/AuthenticatedLayout'
import { useProjects } from '@/hooks/useProjects'

export function ProjectPage() {
  const { projectId } = useParams()

  const { status, projects } = useProjects()
  const project = projects.find((item) => item.id === projectId)

  return (
    <AuthenticatedLayout projectId={projectId} projectName={project?.name}>
      <div className="px-6 py-8 md:px-10">
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

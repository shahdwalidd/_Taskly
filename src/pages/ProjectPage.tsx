import { useParams } from 'react-router-dom'

import { AuthenticatedLayout } from '@/components/auth-layout/AuthenticatedLayout'
import { useProject } from '@/hooks/useProject'

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()

  const { project, loading, error } = useProject(projectId)

  return (
    <AuthenticatedLayout
      projectId={projectId}
      projectName={project?.name}
    >
      <div className="px-6 py-8 md:px-10">
        {loading && (
          <p className="text-slate-dark-70 mt-6 text-sm">
            Loading project...
          </p>
        )}

        {error && (
          <p className="text-error mt-6 text-sm">
            {error}
          </p>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
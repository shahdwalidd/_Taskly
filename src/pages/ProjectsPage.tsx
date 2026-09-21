import { useNavigate } from 'react-router-dom'
import { AuthenticatedLayout } from '@/components/auth-layout/AuthenticatedLayout'
import { ProjectPgeHeader } from '@/components/project-list/ProjectsPageHeader'
import { ProjectCard } from '@/components/project-list/ProjectCard'
import { AddProjectCard } from '@/components/project-list/AddProjectCard'
import { FloatingAddButton } from '@/components/project-list/FloatingAddButton'
import { Pagination } from '@/components/shared/Pagination'
import { formDate } from '@/utils/formatDate'
import { useProjects } from '@/hooks/useProjects'
import { ProjectCardSkelton } from '@/components/project-list/ProjectCardSkeleton'
import { ProjectsErrorState } from '@/components/project-list/ProjectsErrorState'
import { EmptyProjectsState } from '@/components/project-list/EmptyProjectsState'

export function ProjectsPage() {
  const navigate = useNavigate()
  const { status, projects, refetch } = useProjects()

  return (
    <AuthenticatedLayout projectName="Active Project Na...">
      <div className="px-6 py-8 md:px-10">
        <ProjectPgeHeader
          title="Projects"
          subtitle="Manage and curate your projects"
          onCreateClick={() => navigate('/project/add')}
        />
        {status === 'loading' && (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkelton key={index} />
            ))}
          </div>
        )}

        {status === 'error' && <ProjectsErrorState onRetry={refetch} />}
        {status === 'success' && projects.length === 0 && (
          <EmptyProjectsState onCreateClick={() => navigate('/project/add')} />
        )}
        {status === 'success' && projects.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  description={project.description}
                  createdAt={formDate(project.created_at)}
                  onClick={() => navigate(`/project/${project.id}/epics`)}
                />
              ))}

              <AddProjectCard onClick={() => navigate('/project/add')} />
            </div>

            <div className="mt-12 flex justify-end">
              <Pagination totalPages={15} />
            </div>
          </>
        )}
      </div>

      <FloatingAddButton onClick={() => navigate('/project/add')} />
    </AuthenticatedLayout>
  )
}

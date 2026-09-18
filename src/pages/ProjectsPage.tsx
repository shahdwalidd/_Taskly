import { useNavigate } from 'react-router-dom'
import { AuthenticatedLayout } from '../components/authlayout-com/AuthenticatedLayout'
import { ProjectPgeHeader } from '../components/projectlist-com/ProjectsPageHeader'
import { ProjectCard } from '../components/projectlist-com/ProjectCard'
import { AddProjectCard } from '../components/projectlist-com/AddProjectCard'
import { FloatingAddButton } from '../components/projectlist-com/FloatingAddButton'
import { Pagination } from '../components/shared/Pagination'
import { formDate } from '../utils/formatDate'
import { useProjects } from '../hooks/useProjects'
import { ProjectCardSkelton } from '../components/projectlist-com/ProjectCardSkeleton'
import { ProjectsErrorState } from '../components/projectlist-com/ProjectsErrorState'
import { EmptyProjectsState } from '../components/projectlist-com/EmptyProjectsState'

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

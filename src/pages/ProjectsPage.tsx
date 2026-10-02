import { useNavigate } from 'react-router-dom'
import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { ProjectPgeHeader } from '@/components/project-list/ProjectsPageHeader'
import { ProjectCard } from '@/components/project-list/ProjectCard'
import { AddProjectCard } from '@/components/project-list/AddProjectCard'
import { FloatingAddButton } from '@/components/project-list/FloatingAddButton'
import { Pagination } from '@/components/shared/Pagination'
import { ErrorState } from '@/components/shared/ErrorState'
import { formDate } from '@/utils/formatDate'
import { useMediaQuery } from '@/hooks/useMediaQuery' 
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll' 
import { useProjects } from '@/hooks/useProjects'
import { ProjectCardSkelton } from '@/components/project-list/ProjectCardSkeleton'
import { EmptyProjectsState } from '@/components/project-list/EmptyProjectsState'

export function ProjectsPage() {
  const navigate = useNavigate()
  const isMobile = !useMediaQuery('(min-width: 768px)')
  const {
    status,
    projects,
    refetch,
    currentPage,
    totalPages,
    setCurrentPage,
    loadMore,
    loadingMore,
    loadMoreFailed,
    hasMore,
  } = useProjects(isMobile)

  const sentinelRef = useInfiniteScroll(
    loadMore,
    isMobile &&
      status === 'success' &&
      hasMore &&
      !loadingMore &&
      !loadMoreFailed,
  )

  return (
    <AuthenticatedLayout>
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

        {status === 'error' && (
          <ErrorState
            message="We're having trouble retrieving your projects right now. Please try again in a moment."
            onRetry={refetch}
          />
        )}
        {status === 'success' && projects.length === 0 && (
          <EmptyProjectsState onCreateClick={() => navigate('/project/add')} />
        )}
        {status === 'success' && projects.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  projectId={project.id}
                  name={project.name}
                  description={project.description}
                  createdAt={formDate(project.created_at)}
                />
              ))}

              <AddProjectCard onClick={() => navigate('/project/add')} />
            </div>

            {!isMobile && (
              <div className="mt-12 flex justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {isMobile && (
              <div className="mt-8 flex flex-col items-center gap-3">
                {hasMore && <div ref={sentinelRef} className="h-1 w-full" />}

                {loadingMore && (
                  <div
                    role="status"
                    aria-label="Loading more projects"
                    className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary"
                  />
                )}

                {loadMoreFailed && (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-gray-600">
                      Failed to load projects
                    </p>
                    <button
                      onClick={loadMore}
                      className="rounded-xs border border-gray-200 px-4 py-2 text-sm"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <FloatingAddButton onClick={() => navigate('/project/add')} />
    </AuthenticatedLayout>
  )
}

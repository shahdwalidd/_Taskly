
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { EpicsHeader } from '@/components/project-epics/EpicsHeader'
import { EpicsList } from '@/components/project-epics/EpicsList'
import { EpicsSkeleton } from '@/components/project-epics/Epicsskeleton'

import { ErrorState } from '@/components/shared/ErrorState'
import { Pagination } from '@/components/shared/Pagination'
import type { EpicListItem } from '@/types/epics.types'

const mockEpics: EpicListItem[] = [
  {
    id: 'EP-101',
    code: 'EP-101',
    title: 'Design the onboarding flow',
    assigneeName: 'Rafiq Ahmed',
    createdBy: 'Sara Ali',
    date: '2026-10-01',
  },
  {
    id: 'EP-102',
    code: 'EP-102',
    title: 'Build the project dashboard',
    assigneeName: 'Nadia Noor',
    createdBy: 'Sara Ali',
    date: '2026-10-05',
  },
  {
    id: 'EP-103',
    code: 'EP-103',
    title: 'Ship mobile task reminders',
    assigneeName: 'Omar Khan',
    createdBy: 'Sara Ali',
    date: '2026-10-08',
  },
]

export function EpicsPage() {
  const { projectId = '' } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const status = 'success' as 'loading' | 'error' | 'success'
  const epics = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return mockEpics
    }

    return mockEpics.filter(
      (epic) =>
        epic.title.toLowerCase().includes(query) ||
        epic.assigneeName.toLowerCase().includes(query) ||
        epic.code.toLowerCase().includes(query),
    )
  }, [search])

  return (
    <AuthenticatedLayout projectId={projectId} projectName="Rafiq">
      <div className="flex flex-col gap-6 px-6 py-4 md:gap-10 md:px-8 md:py-8">
        {status === 'loading' && <EpicsSkeleton />}

        {status === 'error' && (
          <ErrorState
            message="We're having trouble retrieving your epics right now. Please try again in a moment."
            onRetry={() => {}}
          />
        )}

        {status === 'success' && (
          <>
            <EpicsHeader
              projectName="Rafiq"
              search={search}
              onSearchChange={setSearch}
              onNewEpic={() => navigate(`/project/${projectId}/epics/new`)}
            />

            {epics.length > 0 ? (
              <EpicsList epics={epics} />
            ) : (
              <p className="text-body-md text-grey py-10 text-center">
                No epics yet. Create the first one to get started.
              </p>
            )}

          
            <div className="hidden justify-end pt-12 md:flex">
              <Pagination
                currentPage={page}
                totalPages={15}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
import { useCallback, useEffect, useRef, useState } from 'react'
import type { SetStateAction } from 'react'
import { getEpics } from '@/services/EpicService'
import { getSession } from '@/store/Authstore'
import type { EpicListItem } from '@/types/epics.types'
import { usePagination } from '@/hooks/usePagination'

type EpicsStatus = 'loading' | 'success' | 'error'

interface EpicsState {
  projectId: string
  status: EpicsStatus
  epics: EpicListItem[]
  error: string | null
}

const getEpicId = (epic: EpicListItem) => epic.id

export function useProjectEpics(
  projectId: string,
  isMobile: boolean,
  fetchAll = false,
  enabled = true,
  searchTerm = '',
) {
  const [state, setState] = useState<EpicsState>({
    projectId: '',
    status: 'loading',
    epics: [],
    error: null,
  })
  const [retryCount, setRetryCount] = useState(0)
  const limit = 2
  const requestVersionRef = useRef(0)
  const belongsToCurrentProject = state.projectId === projectId

  const setEpics = useCallback(
    (update: SetStateAction<EpicListItem[]>) => {
      setState((current) => {
        if (current.projectId !== projectId) return current
        const epics =
          typeof update === 'function' ? update(current.epics) : update
        return { ...current, epics }
      })
    },
    [projectId],
  )

  const fetchPage = useCallback(
    async (page: number) => {
      const session = getSession()
      if (!session?.access_token) {
        throw new Error('Authentication is required to load epics')
      }
      const result = await getEpics(
        projectId,
        session.access_token,
        limit,
        (page - 1) * limit,
        searchTerm,
      )
      return { items: result.epics, totalCount: result.totalCount }
    },
    [projectId, searchTerm],
  )

  const pagination = usePagination({
    items: belongsToCurrentProject ? state.epics : [],
    setItems: setEpics,
    pageSize: limit,
    isMobile: isMobile && !fetchAll,
    scopeKey: `${projectId}:${searchTerm}`,
    fetchPage,
    getItemId: getEpicId,
  })

  useEffect(() => {
    if (!enabled) return

    let isCurrentRequest = true
    const requestVersion = ++requestVersionRef.current
    pagination.resetLoadMore()

    async function fetchEpics() {
      setState({ projectId, status: 'loading', epics: [], error: null })

      try {
        if (!projectId) {
          throw new Error('Project ID is required to load epics')
        }

        const session = getSession()
        if (!session?.access_token) {
          throw new Error('Authentication is required to load epics')
        }

        const page = isMobile ? 1 : pagination.currentPage
        const result = fetchAll
          ? await getEpics(
              projectId,
              session.access_token,
              undefined,
              undefined,
              searchTerm,
            ).then(({ epics, totalCount }) => ({ items: epics, totalCount }))
          : await fetchPage(page)
        if (isCurrentRequest && requestVersionRef.current === requestVersion) {
          pagination.setTotalCount(result.totalCount)
          setState({
            projectId,
            status: 'success',
            epics: result.items,
            error: null,
          })
        }
      } catch (error) {
        if (isCurrentRequest && requestVersionRef.current === requestVersion) {
          setState({
            projectId,
            status: 'error',
            epics: [],
            error:
              searchTerm.trim()
                ? 'Failed to search epics'
                : error instanceof Error
                  ? error.message
                  : 'Failed to load epics',
          })
        }
      }
    }

    void fetchEpics()
    return () => {
      isCurrentRequest = false
      if (requestVersionRef.current === requestVersion) {
        requestVersionRef.current += 1
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    fetchAll,
    fetchPage,
    isMobile,
    pagination.currentPage,
    pagination.resetLoadMore,
    pagination.setTotalCount,
    projectId,
    retryCount,
    searchTerm,
  ])

  const refetch = useCallback(() => {
    setState((current) => ({
      ...current,
      status: 'loading',
      epics: [],
      error: null,
    }))
    setRetryCount((count) => count + 1)
  }, [])

  return {
    epics: belongsToCurrentProject ? state.epics : [],
    status: belongsToCurrentProject ? state.status : 'loading',
    error: belongsToCurrentProject ? state.error : null,
    refetch,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    setCurrentPage: pagination.setCurrentPage,
    loadMore: pagination.loadMore,
    loadingMore: pagination.loadingMore,
    loadMoreFailed: pagination.loadMoreFailed,
    hasMore: pagination.hasMore,
  }
}


import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getSession } from '@/store/Authstore'
import type { Project } from '@/types/project.types'
import { getProjects } from '@/services/ProjectService'

type Projectstatus = 'loading' | 'error' | 'success'

interface UseprojectReturn {
  status: Projectstatus
  projects: Project[]
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  refetch: () => void
  loadMore: () => void 
  loadingMore: boolean 
  loadMoreFailed: boolean 
  hasMore: boolean 
}

export function useProjects(isMobile: boolean): UseprojectReturn { 
  const [status, setStatus] = useState<Projectstatus>('loading')
  const [projects, setProjects] = useState<Project[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPage = Number(searchParams.get('page') ?? 1)
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const limit = 5
  const [totalCount, setTotalCount] = useState(0)
  const totalPages = Math.ceil(totalCount / limit)

  const [loadingMore, setLoadingMore] = useState(false) 
  const [loadMoreFailed, setLoadMoreFailed] = useState(false) 
  const nextPageRef = useRef(2) 
  const isFetchingRef = useRef(false) 

  const hasMore = isMobile && projects.length < totalCount 

  const setCurrentPage = useCallback(
    (page: number) => {
      const nextPage = Math.max(1, Math.floor(page))
      setSearchParams((previousParams) => {
        const nextParams = new URLSearchParams(previousParams)
        nextParams.set('page', String(nextPage))
        return nextParams
      })
    },
    [setSearchParams],
  )

  useEffect(() => {
    if (isMobile) return 
    const normalizedPage =
      totalPages > 0 ? Math.min(currentPage, totalPages) : currentPage
    if (searchParams.get('page') !== String(normalizedPage)) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.set('page', String(normalizedPage))
      setSearchParams(nextParams, { replace: true })
    }
  }, [currentPage, searchParams, setSearchParams, totalPages, isMobile])


  const fetchProjects = useCallback(async () => {
    setStatus('loading')
    setLoadMoreFailed(false)
    const session = getSession()
    if (!session) {
      setStatus('error')
      return
    }
    try {
      const page = isMobile ? 1 : currentPage 
      const offset = (page - 1) * limit
      const result = await getProjects(session.access_token, limit, offset)
      setProjects(result.projects)
      setTotalCount(result.totalCount)
      nextPageRef.current = 2 
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }, [currentPage, isMobile])

  useEffect(() => {
    void Promise.resolve().then(fetchProjects)
  }, [fetchProjects])

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return
    const session = getSession()
    if (!session) return

    isFetchingRef.current = true
    setLoadingMore(true)
    setLoadMoreFailed(false)
    try {
      const offset = (nextPageRef.current - 1) * limit
      const result = await getProjects(session.access_token, limit, offset)
      setProjects((previous) => {
        const existingIds = new Set(previous.map((project) => project.id))
        const fresh = result.projects.filter(
          (project) => !existingIds.has(project.id),
        )
        return [...previous, ...fresh]
      })
      setTotalCount(result.totalCount)
      nextPageRef.current += 1
    } catch {
      setLoadMoreFailed(true)
    } finally {
      isFetchingRef.current = false
      setLoadingMore(false)
    }
  }, [hasMore])

  return {
    status,
    projects,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch: fetchProjects,
    loadMore,
    loadingMore,
    loadMoreFailed,
    hasMore,
  }
}
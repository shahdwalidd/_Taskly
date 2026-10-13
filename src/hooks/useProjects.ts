import { useCallback, useEffect, useState } from 'react'
import { getSession } from '@/store/Authstore'
import type { Project } from '@/types/project.types'
import { getProjects } from '@/services/ProjectService'
import { usePagination } from '@/hooks/usePagination'

type Projectstatus = 'loading' | 'error' | 'success'

interface UseprojectReturn {
  status: Projectstatus
  projects: Project[]
  refetch: () => void
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  loadMore: () => Promise<void>
  loadingMore: boolean
  loadMoreFailed: boolean
  hasMore: boolean
}

const getProjectId = (project: Project) => project.id

export function useProjects(isMobile: boolean): UseprojectReturn {
  const [status, setStatus] = useState<Projectstatus>('loading')
  const [projects, setProjects] = useState<Project[]>([])
  const limit = 10

  const fetchPage = useCallback(async (page: number) => {
    const session = getSession()
    if (!session) throw new Error('Authentication is required to load projects')
    const result = await getProjects(
      session.access_token,
      limit,
      (page - 1) * limit,
    )
    return { items: result.projects, totalCount: result.totalCount }
  }, [])

  const pagination = usePagination({
    items: projects,
    setItems: setProjects,
    pageSize: limit,
    isMobile,
    scopeKey: 'projects',
    fetchPage,
    getItemId: getProjectId,
  })
  const { currentPage, resetLoadMore, setTotalCount } = pagination

  const fetchProjects = useCallback(async () => {
    setStatus('loading')
    resetLoadMore()
    try {
      const page = isMobile ? 1 : currentPage
      const result = await fetchPage(page)
      setProjects(result.items)
      setTotalCount(result.totalCount)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }, [currentPage, fetchPage, isMobile, resetLoadMore, setTotalCount])

  useEffect(() => {
    void Promise.resolve().then(fetchProjects)
  }, [fetchProjects])

  return {
    status,
    projects,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    setCurrentPage: pagination.setCurrentPage,
    refetch: fetchProjects,
    loadMore: pagination.loadMore,
    loadingMore: pagination.loadingMore,
    loadMoreFailed: pagination.loadMoreFailed,
    hasMore: pagination.hasMore,
  }
}

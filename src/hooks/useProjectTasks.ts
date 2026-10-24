import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Task, TaskStatusValue } from '@/types/addTask.types'
import { getValidAccessToken } from '@/services/AuthService'
import { ApiError } from '@/services/apiClient'
import { getProjectTasks } from '@/services/TaskService'
import { clearSession } from '@/store/Authstore'

const TASKS_PER_PAGE = 10

type LoadStatus = 'loading' | 'success' | 'error'

interface ProjectTasksState {
  requestKey: string
  status: LoadStatus
  tasks: Task[]
  totalCount: number
  error: string | null
  loadingMore: boolean
  loadMoreFailed: boolean
}

interface PaginationState {
  requestKey: string
  offset: number
}

export function useProjectTasks(
  projectId: string,
  statusId: TaskStatusValue,
  searchTerm = '',
) {
  const navigate = useNavigate()
  const normalizedSearchTerm = searchTerm.trim()
  const requestKey = JSON.stringify([projectId, statusId, normalizedSearchTerm])
  const [state, setState] = useState<ProjectTasksState>({
    requestKey: '',
    status: 'loading',
    tasks: [],
    totalCount: 0,
    error: null,
    loadingMore: false,
    loadMoreFailed: false,
  })
  const [pagination, setPagination] = useState<PaginationState>({
    requestKey: '',
    offset: 0,
  })
  const [retryCount, setRetryCount] = useState(0)
  const offset =
    pagination.requestKey === requestKey && state.requestKey === requestKey
      ? pagination.offset
      : 0
  const hasCurrentResults = state.requestKey === requestKey

  useEffect(() => {
    const controller = new AbortController()
    let isCurrentRequest = true

    async function fetchTasks() {
      if (offset === 0) {
        setState({
          requestKey,
          status: 'loading',
          tasks: [],
          totalCount: 0,
          error: null,
          loadingMore: false,
          loadMoreFailed: false,
        })
      } else {
        setState((current) => ({
          ...current,
          requestKey,
          loadingMore: true,
          loadMoreFailed: false,
        }))
      }

      if (!projectId.trim()) {
        setState({
          requestKey,
          status: 'error',
          tasks: [],
          totalCount: 0,
          error: 'Project ID is required to load tasks',
          loadingMore: false,
          loadMoreFailed: false,
        })
        return
      }

      let tokenReady = false

      try {
        const accessToken = await getValidAccessToken()
        tokenReady = true
        if (!isCurrentRequest) return

        const result = await getProjectTasks(projectId, statusId, accessToken, {
          limit: TASKS_PER_PAGE,
          offset,
          searchTerm: normalizedSearchTerm,
          signal: controller.signal,
        })

        if (isCurrentRequest) {
          setState((current) => {
            const existingTasks = offset > 0 && current.requestKey === requestKey
              ? current.tasks
              : []
            const existingIds = new Set(existingTasks.map((task) => task.id))
            const tasks = offset > 0
              ? [...existingTasks, ...result.tasks.filter((task) => !existingIds.has(task.id))]
              : result.tasks

            return {
              requestKey,
              status: 'success',
              tasks,
              totalCount: result.totalCount,
              error: null,
              loadingMore: false,
              loadMoreFailed: false,
            }
          })
        }
      } catch (error) {
        if (!isCurrentRequest || controller.signal.aborted) return

        if (
          !tokenReady ||
          (error instanceof ApiError && [401, 403].includes(error.status))
        ) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }

        setState((current) => {
          if (offset > 0 && current.requestKey === requestKey) {
            return { ...current, loadingMore: false, loadMoreFailed: true }
          }

          return {
            requestKey,
            status: 'error',
            tasks: [],
            totalCount: 0,
            error: error instanceof Error ? error.message : 'Failed to load tasks',
            loadingMore: false,
            loadMoreFailed: false,
          }
        })
      }
    }

    void fetchTasks()

    return () => {
      isCurrentRequest = false
      controller.abort()
    }
  }, [navigate, normalizedSearchTerm, offset, projectId, requestKey, retryCount, statusId])

  const refetch = useCallback(() => {
    setPagination({ requestKey, offset: 0 })
    setRetryCount((count) => count + 1)
  }, [requestKey])

  const loadMore = useCallback(() => {
    if (
      !hasCurrentResults ||
      state.status !== 'success' ||
      state.loadingMore ||
      state.tasks.length >= state.totalCount
    ) {
      return
    }

    if (state.loadMoreFailed) {
      setRetryCount((count) => count + 1)
      return
    }

    setPagination({ requestKey, offset: state.tasks.length })
  }, [hasCurrentResults, requestKey, state])

  return {
    tasks: hasCurrentResults ? state.tasks : [],
    totalCount: hasCurrentResults ? state.totalCount : 0,
    status: hasCurrentResults ? state.status : 'loading',
    error: hasCurrentResults ? state.error : null,
    loadingMore: hasCurrentResults && state.loadingMore,
    loadMoreFailed: hasCurrentResults && state.loadMoreFailed,
    refetch,
    loadMore,
  }
}

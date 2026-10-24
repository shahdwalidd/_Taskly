import { useCallback, useEffect, useRef, useState } from 'react'
import type { SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePagination } from '@/hooks/usePagination'
import { ApiError } from '@/services/apiClient'
import { getValidAccessToken } from '@/services/AuthService'
import { getProjectTasks } from '@/services/TaskService'
import { clearSession } from '@/store/Authstore'
import type { Task } from '@/types/addTask.types'

const PAGE_SIZE = 10

type TaskLoadStatus = 'loading' | 'success' | 'error'

interface TaskState {
  scopeKey: string
  status: TaskLoadStatus
  tasks: Task[]
  error: string | null
}

const getTaskId = (task: Task) => task.id

export function useProjectTasks(projectId: string, searchTerm: string) {
  const navigate = useNavigate()
  const normalizedSearchTerm = searchTerm.trim()
  const scopeKey = JSON.stringify([projectId, normalizedSearchTerm])
  const requestVersionRef = useRef(0)
  const requestControllerRef = useRef<AbortController | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [state, setState] = useState<TaskState>({
    scopeKey: '',
    status: 'loading',
    tasks: [],
    error: null,
  })

  const setTasks = useCallback(
    (update: SetStateAction<Task[]>) => {
      setState((current) => {
        if (current.scopeKey !== scopeKey) return current
        const tasks = typeof update === 'function' ? update(current.tasks) : update
        return { ...current, tasks }
      })
    },
    [scopeKey],
  )
  const tasks = state.scopeKey === scopeKey ? state.tasks : []

  const fetchPage = useCallback(
    async (page: number) => {
      requestControllerRef.current?.abort()
      const controller = new AbortController()
      requestControllerRef.current = controller
      let tokenReady = false

      try {
        const accessToken = await getValidAccessToken()
        tokenReady = true
        if (controller.signal.aborted) {
          throw new DOMException('Request aborted', 'AbortError')
        }

        const result = await getProjectTasks(projectId, accessToken, {
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
          searchTerm: normalizedSearchTerm,
          signal: controller.signal,
        })

        return { items: result.tasks, totalCount: result.totalCount }
      } catch (error) {
        if (
          !controller.signal.aborted &&
          (!tokenReady || (error instanceof ApiError && [401, 403].includes(error.status)))
        ) {
          clearSession()
          navigate('/login', { replace: true })
        }
        throw error
      }
    },
    [navigate, normalizedSearchTerm, projectId],
  )

  const {
    hasMore,
    loadMore,
    loadingMore,
    loadMoreFailed,
    resetLoadMore,
    setTotalCount,
    totalCount,
  } = usePagination({
    items: tasks,
    setItems: setTasks,
    pageSize: PAGE_SIZE,
    isMobile: true,
    scopeKey,
    fetchPage,
    getItemId: getTaskId,
  })

  useEffect(() => {
    let isCurrentRequest = true
    const requestVersion = ++requestVersionRef.current
    resetLoadMore()
    setTotalCount(0)

    async function loadTasks() {
      try {
        if (!projectId.trim()) {
          throw new Error('Project ID is required to load tasks')
        }

        const result = await fetchPage(1)
        if (isCurrentRequest && requestVersionRef.current === requestVersion) {
          setState({ scopeKey, status: 'success', tasks: result.items, error: null })
          setTotalCount(result.totalCount)
        }
      } catch (error) {
        if (
          isCurrentRequest &&
          requestVersionRef.current === requestVersion &&
          !(error instanceof DOMException && error.name === 'AbortError')
        ) {
          setState({
            scopeKey,
            status: 'error',
            tasks: [],
            error: error instanceof Error ? error.message : 'Failed to load tasks',
          })
        }
      }
    }

    void loadTasks()

    return () => {
      isCurrentRequest = false
      if (requestVersionRef.current === requestVersion) {
        requestVersionRef.current += 1
      }
      requestControllerRef.current?.abort()
    }
  }, [fetchPage, projectId, resetLoadMore, retryCount, scopeKey, setTotalCount])

  const retry = useCallback(() => {
    setState((current) => ({ ...current, status: 'loading', error: null }))
    setRetryCount((count) => count + 1)
  }, [])

  const matchesScope = state.scopeKey === scopeKey

  return {
    tasks,
    status: matchesScope ? state.status : 'loading',
    error: matchesScope ? state.error : null,
    totalCount: matchesScope ? totalCount : 0,
    loadMore,
    loadingMore: matchesScope && loadingMore,
    loadMoreFailed: matchesScope && loadMoreFailed,
    hasMore: matchesScope && hasMore,
    retry,
  }
}

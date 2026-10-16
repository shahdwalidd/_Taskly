import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Task, TaskStatusValue } from '@/types/addTask.types'
import { getValidAccessToken } from '@/services/AuthService'
import { ApiError } from '@/services/apiClient'
import { getProjectTasks } from '@/services/TaskService'
import { clearSession } from '@/store/Authstore'

type LoadStatus = 'loading' | 'success' | 'error'

interface ProjectTasksState {
  projectId: string
  statusId: TaskStatusValue
  status: LoadStatus
  tasks: Task[]
  error: string | null
}

export function useProjectTasks(projectId: string, statusId: TaskStatusValue) {
  const navigate = useNavigate()
  const [state, setState] = useState<ProjectTasksState>({
    projectId: '',
    statusId,
    status: 'loading',
    tasks: [],
    error: null,
  })
  const [retryCount, setRetryCount] = useState(0)
  const belongsToCurrentColumn =
    state.projectId === projectId && state.statusId === statusId

  useEffect(() => {
    const controller = new AbortController()
    let isCurrentRequest = true

    async function fetchTasks() {
      setState({ projectId, statusId, status: 'loading', tasks: [], error: null })

      if (!projectId) {
        setState({
          projectId,
          statusId,
          status: 'error',
          tasks: [],
          error: 'Project ID is required to load tasks',
        })
        return
      }

      let requestingTasks = false

      try {
        const accessToken = await getValidAccessToken()
        if (!isCurrentRequest) return

        requestingTasks = true
        const tasks = await getProjectTasks(
          projectId,
          statusId,
          accessToken,
          controller.signal,
        )

        if (isCurrentRequest) {
          setState({ projectId, statusId, status: 'success', tasks, error: null })
        }
      } catch (error) {
        if (!isCurrentRequest || controller.signal.aborted) return

        const isUnauthorized =
          (error instanceof ApiError && error.status === 401) ||
          !requestingTasks
        if (isUnauthorized) {
          clearSession()
          navigate('/login', { replace: true })
        }

        setState({
          projectId,
          statusId,
          status: 'error',
          tasks: [],
          error: error instanceof Error ? error.message : 'Failed to load tasks',
        })
      }
    }

    void fetchTasks()

    return () => {
      isCurrentRequest = false
      controller.abort()
    }
  }, [navigate, projectId, retryCount, statusId])

  const refetch = useCallback(() => {
    setRetryCount((count) => count + 1)
  }, [])

  return {
    tasks: belongsToCurrentColumn ? state.tasks : [],
    status: belongsToCurrentColumn ? state.status : 'loading',
    error: belongsToCurrentColumn ? state.error : null,
    refetch,
  }
}
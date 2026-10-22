import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/services/apiClient'
import { getValidAccessToken } from '@/services/AuthService'
import { getTaskDetails, TaskNotFoundError } from '@/services/TaskService'
import { clearSession } from '@/store/Authstore'
import type { TaskDetails } from '@/types/addTask.types'

type TaskDetailsStatus = 'idle' | 'loading' | 'success' | 'error' | 'not-found'

interface TaskDetailsState {
  key: string
  status: TaskDetailsStatus
  task: TaskDetails | null
}

export function useTaskDetails(projectId: string, taskId: string) {
  const navigate = useNavigate()
  const [retryCount, setRetryCount] = useState(0)
  const key = `${projectId}:${taskId}`
  const [state, setState] = useState<TaskDetailsState>({
    key: '',
    status: 'idle',
    task: null,
  })

  useEffect(() => {
    if (!projectId.trim() || !taskId.trim()) return

    const controller = new AbortController()
    let current = true
    let tokenReady = false
    const requestKey = `${projectId}:${taskId}`
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ key: requestKey, status: 'loading', task: null })

    async function loadTask() {
      try {
        const accessToken = await getValidAccessToken()
        tokenReady = true
        if (!current) return

        const task = await getTaskDetails(
          projectId,
          taskId,
          accessToken,
          controller.signal,
        )
        if (current) setState({ key: requestKey, status: 'success', task })
      } catch (error) {
        if (!current || controller.signal.aborted) return
        if (
          !tokenReady ||
          (error instanceof ApiError && [401, 403].includes(error.status))
        ) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        if (error instanceof TaskNotFoundError) {
          setState({ key: requestKey, status: 'not-found', task: null })
          return
        }
        setState({ key: requestKey, status: 'error', task: null })
      }
    }

    void loadTask()

    return () => {
      current = false
      controller.abort()
    }
  }, [navigate, projectId, retryCount, taskId])

  const retry = useCallback(() => setRetryCount((count) => count + 1), [])
  const isValid = Boolean(projectId.trim()) && Boolean(taskId.trim())
  const matchesRequest = state.key === key

  return {
    status: !isValid
      ? 'error'
      : matchesRequest
        ? state.status
        : 'loading',
    task: isValid && matchesRequest ? state.task : null,
    retry,
  } as const
}

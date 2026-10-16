import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getValidAccessToken } from '@/services/AuthService'
import { ApiError } from '@/services/apiClient'
import { getEpicTasks } from '@/services/TaskService'
import { clearSession } from '@/store/Authstore'
import type { Task } from '@/types/addTask.types'

type EpicTasksStatus = 'idle' | 'loading' | 'success' | 'error'

interface EpicTasksState {
  epicId: string | null
  status: EpicTasksStatus
  tasks: Task[]
  error: string | null
}

export function useEpicTasks(epicId: string | null) {
  const navigate = useNavigate()
  const [retryCount, setRetryCount] = useState(0)
  const [state, setState] = useState<EpicTasksState>({
    epicId: null,
    status: 'idle',
    tasks: [],
    error: null,
  })

  useEffect(() => {
    if (!epicId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ epicId: null, status: 'idle', tasks: [], error: null })
      return
    }

    const selectedEpicId = epicId
    const controller = new AbortController()
    let isCurrentRequest = true
    let requestingTasks = false
    setState({
      epicId: selectedEpicId,
      status: 'loading',
      tasks: [],
      error: null,
    })

    async function fetchTasks() {
      try {
        const accessToken = await getValidAccessToken()
        if (!isCurrentRequest) return

        requestingTasks = true
        const tasks = await getEpicTasks(
          selectedEpicId,
          accessToken,
          controller.signal,
        )
        if (isCurrentRequest) {
          setState({
            epicId: selectedEpicId,
            status: 'success',
            tasks,
            error: null,
          })
        }
      } catch (error) {
        if (!isCurrentRequest || controller.signal.aborted) return

        const isUnauthorized =
          !requestingTasks || (error instanceof ApiError && error.status === 401)
        if (isUnauthorized) {
          clearSession()
          navigate('/login', { replace: true })
        }

        setState({
          epicId: selectedEpicId,
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
  }, [epicId, navigate, retryCount])

  const refetch = useCallback(() => {
    setRetryCount((count) => count + 1)
  }, [])

  const matchesEpic = state.epicId === epicId

  return {
    tasks: matchesEpic ? state.tasks : [],
    status: epicId ? (matchesEpic ? state.status : 'loading') : 'idle',
    error: matchesEpic ? state.error : null,
    refetch,
  }
}
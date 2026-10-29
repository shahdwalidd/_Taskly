import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ApiError } from '@/services/apiClient'
import { getValidAccessToken } from '@/services/AuthService'
import { getTaskDetails, TaskNotFoundError, updateTaskDetails } from '@/services/TaskService'
import { clearSession } from '@/store/Authstore'
import type {
  TaskDetails,
  TaskDetailsEditableField,
  TaskDetailsUpdate,
} from '@/types/addTask.types'

type TaskDetailsStatus = 'idle' | 'loading' | 'success' | 'error' | 'not-found'

interface TaskDetailsState {
  key: string
  status: TaskDetailsStatus
  task: TaskDetails | null
}

export function useTaskDetails(
  projectId: string,
  taskId: string,
  onTaskUpdated?: (taskId: string, updates: Partial<TaskDetails>) => void,
) {
  const navigate = useNavigate()
  const [retryCount, setRetryCount] = useState(0)
  const [savingFields, setSavingFields] = useState<Set<TaskDetailsEditableField>>(
    () => new Set(),
  )
  const inFlightFields = useRef(new Set<TaskDetailsEditableField>())
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
  const saveField = useCallback(
    async (
      field: TaskDetailsEditableField,
      updates: TaskDetailsUpdate,
      optimisticTask: Partial<TaskDetails>,
    ) => {
      const currentTask = state.key === key ? state.task : null
      if (!currentTask || inFlightFields.current.has(field)) return

      const previousValues = Object.fromEntries(
        Object.keys(optimisticTask).map((property) => [
          property,
          currentTask[property as keyof TaskDetails],
        ]),
      ) as Partial<TaskDetails>

      inFlightFields.current.add(field)
      setSavingFields((current) => new Set(current).add(field))
      setState((current) => {
        if (current.key !== key || !current.task) return current
        return {
          ...current,
          task: { ...current.task, ...optimisticTask },
        }
      })

      let tokenReady = false
      try {
        const accessToken = await getValidAccessToken()
        tokenReady = true
        await updateTaskDetails(taskId, updates, accessToken)
        onTaskUpdated?.(taskId, optimisticTask)
        toast.success('Task updated successfully.')
      } catch (error) {
        setState((current) => {
          if (current.key !== key || !current.task) return current
          return {
            ...current,
            task: { ...current.task, ...previousValues },
          }
        })

        toast.error('Failed to update task. Please try again.')
        if (
          !tokenReady ||
          (error instanceof ApiError &&
          [401, 403].includes(error.status)
          )
        ) {
          clearSession()
          navigate('/login', { replace: true })
        }
      } finally {
        inFlightFields.current.delete(field)
        setSavingFields((current) => {
          const next = new Set(current)
          next.delete(field)
          return next
        })
      }
    },
    [key, navigate, onTaskUpdated, state.key, state.task, taskId],
  )
  const isValid = Boolean(projectId.trim()) && Boolean(taskId.trim())
  const matchesRequest = state.key === key

  return {
    status: !isValid
      ? 'error'
      : matchesRequest
        ? state.status
        : 'loading',
    task: isValid && matchesRequest ? state.task : null,
    savingFields,
    saveField,
    retry,
  } as const
}

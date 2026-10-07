import { useCallback, useEffect, useState } from 'react'
import { getEpicDetails } from '@/services/EpicService'
import { getSession } from '@/store/Authstore'
import type { EpicListItem } from '@/types/epics.types'

type EpicDetailsStatus = 'idle' | 'loading' | 'success' | 'error'

interface EpicDetailsState {
  epicId: string | null
  status: EpicDetailsStatus
  epic: EpicListItem | null
  error: string | null
}

export function useEpicDetails(projectId: string, epicId: string | null) {
  const [retryCount, setRetryCount] = useState(0)
  const [state, setState] = useState<EpicDetailsState>({
    epicId: null,
    status: 'idle',
    epic: null,
    error: null,
  })

  useEffect(() => {
    if (!epicId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ epicId: null, status: 'idle', epic: null, error: null })
      return
    }

    const selectedEpicId = epicId
    let isCurrentRequest = true
    setState({ epicId: selectedEpicId, status: 'loading', epic: null, error: null })

    async function fetchEpicDetails() {
      try {
        if (!projectId) {
          throw new Error('Project ID is required to load epic details')
        }

        const session = getSession()
        if (!session?.access_token) {
          throw new Error('Authentication is required to load epic details')
        }

        const epic = await getEpicDetails(
          projectId,
          selectedEpicId,
          session.access_token,
        )
        if (isCurrentRequest) {
          setState({
            epicId: selectedEpicId,
            status: 'success',
            epic,
            error: null,
          })
        }
      } catch (error) {
        if (isCurrentRequest) {
          setState({
            epicId: selectedEpicId,
            status: 'error',
            epic: null,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to load epic details',
          })
        }
      }
    }

    void fetchEpicDetails()
    return () => {
      isCurrentRequest = false
    }
  }, [projectId, epicId, retryCount])

  const retry = useCallback(() => {
    setRetryCount((count) => count + 1)
  }, [])

  const matchesSelectedEpic = state.epicId === epicId

  return {
    status: epicId ? (matchesSelectedEpic ? state.status : 'loading') : 'idle',
    epic: matchesSelectedEpic ? state.epic : null,
    error: matchesSelectedEpic ? state.error : null,
    retry,
  }
}

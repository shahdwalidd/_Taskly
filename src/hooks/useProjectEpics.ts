import { useCallback, useEffect, useState } from 'react'
import { getEpics } from '@/services/EpicService'
import { getSession } from '@/store/Authstore'
import type { EpicListItem } from '@/types/epics.types'

type EpicsStatus = 'loading' | 'success' | 'error'

interface EpicsState {
	projectId: string
	status: EpicsStatus
	epics: EpicListItem[]
	error: string | null
}

export function useProjectEpics(projectId: string) {
	const [state, setState] = useState<EpicsState>({
		projectId: '',
		status: 'loading',
		epics: [],
		error: null,
	})
	const [retryCount, setRetryCount] = useState(0)

	useEffect(() => {
		let isCurrentRequest = true

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

				const epics = await getEpics(projectId, session.access_token)
				if (isCurrentRequest) {
					setState({ projectId, status: 'success', epics, error: null })
				}
			} catch (error) {
				if (isCurrentRequest) {
					setState({
						projectId,
						status: 'error',
						epics: [],
						error:
							error instanceof Error ? error.message : 'Failed to load epics',
					})
				}
			}
		}

		void fetchEpics()
		return () => {
			isCurrentRequest = false
		}
	}, [projectId, retryCount])

	const refetch = useCallback(() => {
		setState((current) => ({
			...current,
			status: 'loading',
			epics: [],
			error: null,
		}))
		setRetryCount((count) => count + 1)
	}, [])

	const belongsToCurrentProject = state.projectId === projectId

	return {
		epics: belongsToCurrentProject ? state.epics : [],
		status: belongsToCurrentProject ? state.status : 'loading',
		error: belongsToCurrentProject ? state.error : null,
		refetch,
	}
}

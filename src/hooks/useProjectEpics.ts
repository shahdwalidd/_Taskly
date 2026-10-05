import { useCallback, useEffect, useRef, useState } from 'react'
import { getEpics } from '@/services/EpicService'
import { getSession } from '@/store/Authstore'
import type { EpicListItem } from '@/types/epics.types'
import { useSearchParams } from 'react-router-dom'

type EpicsStatus = 'loading' | 'success' | 'error'

interface EpicsState {
	projectId: string
	status: EpicsStatus
	epics: EpicListItem[]
	error: string | null
}

export function useProjectEpics(projectId: string, isMobile: boolean) {
	const [state, setState] = useState<EpicsState>({
		projectId: '',
		status: 'loading',
		epics: [],
		error: null,
	})
	const [retryCount, setRetryCount] = useState(0)
	const limit = 1
	const [searchParams, setSearchParams] = useSearchParams()
	const requestedPage = Number(searchParams.get('page') ?? 1)

	const currentPage =
		Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
	const [totalCount, setTotalCount] = useState(0)
	const totalPages = Math.ceil(totalCount / limit)
	const [loadingMore, setLoadingMore] = useState(false)
	const [loadMoreFailed, setLoadMoreFailed] = useState(false)
	const nextPageRef = useRef(2)
	const isFetchingMoreRef = useRef(false)
	const requestVersionRef = useRef(0)
	const belongsToCurrentProject = state.projectId === projectId
	const hasMore =
		isMobile && belongsToCurrentProject && state.epics.length < totalCount

	useEffect(() => {
		let isCurrentRequest = true
		const requestVersion = ++requestVersionRef.current

		async function fetchEpics() {
			setState({ projectId, status: 'loading', epics: [], error: null })
			setLoadingMore(false)
			setLoadMoreFailed(false)
			isFetchingMoreRef.current = false
			nextPageRef.current = 2

			try {
				if (!projectId) {
					throw new Error('Project ID is required to load epics')
				}

				const session = getSession()
				if (!session?.access_token) {
					throw new Error('Authentication is required to load epics')
				}

				const page = isMobile ? 1 : currentPage
				const offset = (page - 1) * limit
				const result = await getEpics(
					projectId,
					session.access_token,
					limit,
					offset,
				)
				if (isCurrentRequest && requestVersionRef.current === requestVersion) {
					setTotalCount(result.totalCount)
					setState({
						projectId,
						status: 'success',
						epics: result.epics,
						error: null,
					})
				}
			} catch (error) {
				if (isCurrentRequest && requestVersionRef.current === requestVersion) {
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
			if (requestVersionRef.current === requestVersion) {
				requestVersionRef.current += 1
			}
		}
	}, [projectId, currentPage, retryCount, isMobile])

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

	const refetch = useCallback(() => {
		setState((current) => ({
			...current,
			status: 'loading',
			epics: [],
			error: null,
		}))
		setRetryCount((count) => count + 1)
	}, [])

	const loadMore = useCallback(async () => {
		if (isFetchingMoreRef.current || !hasMore) return

		const session = getSession()
		if (!session?.access_token) {
			setLoadMoreFailed(true)
			return
		}

		const requestVersion = requestVersionRef.current
		const page = nextPageRef.current
		isFetchingMoreRef.current = true
		setLoadingMore(true)
		setLoadMoreFailed(false)

		try {
			const result = await getEpics(
				projectId,
				session.access_token,
				limit,
				(page - 1) * limit,
			)
			if (requestVersionRef.current !== requestVersion) return

			setState((current) => {
				if (current.projectId !== projectId) return current

				const existingIds = new Set(current.epics.map((epic) => epic.id))
				const freshEpics = result.epics.filter(
					(epic) => !existingIds.has(epic.id),
				)
				return { ...current, epics: [...current.epics, ...freshEpics] }
			})
			setTotalCount(result.totalCount)
			nextPageRef.current = page + 1
		} catch {
			if (requestVersionRef.current === requestVersion) {
				setLoadMoreFailed(true)
			}
		} finally {
			if (requestVersionRef.current === requestVersion) {
				isFetchingMoreRef.current = false
				setLoadingMore(false)
			}
		}
	}, [hasMore, projectId])

	return {
		epics: belongsToCurrentProject ? state.epics : [],
		status: belongsToCurrentProject ? state.status : 'loading',
		error: belongsToCurrentProject ? state.error : null,
		refetch,
		currentPage,
		totalPages,
		setCurrentPage,
		loadMore,
		loadingMore,
		loadMoreFailed,
		hasMore,
	}
}

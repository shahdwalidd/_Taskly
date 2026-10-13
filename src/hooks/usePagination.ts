import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { useSearchParams } from 'react-router-dom'

interface PageResult<T> {
  items: T[]
  totalCount: number
}

interface UsePaginationOptions<T> {
  items: T[]
  setItems: Dispatch<SetStateAction<T[]>>
  pageSize: number
  isMobile: boolean
  scopeKey: string
  fetchPage: (page: number) => Promise<PageResult<T>>
  getItemId: (item: T) => string
}

export function usePagination<T>({
  items,
  setItems,
  pageSize,
  isMobile,
  scopeKey,
  fetchPage,
  getItemId,
}: UsePaginationOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPage = Number(searchParams.get('page') ?? 1)
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const [totalCount, setTotalCount] = useState(0)
  const totalPages = Math.ceil(totalCount / pageSize)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadMoreFailed, setLoadMoreFailed] = useState(false)
  const nextPageRef = useRef(2)
  const isFetchingRef = useRef(false)
  const requestVersionRef = useRef(0)
  const hasMore = isMobile && items.length < totalCount

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

  const resetLoadMore = useCallback(() => {
    requestVersionRef.current += 1
    nextPageRef.current = 2
    isFetchingRef.current = false
    setLoadingMore(false)
    setLoadMoreFailed(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetLoadMore()
  }, [resetLoadMore, scopeKey])

  useEffect(() => {
    if (isMobile) return
    const normalizedPage =
      totalPages > 0 ? Math.min(currentPage, totalPages) : currentPage
    if (searchParams.get('page') !== String(normalizedPage)) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.set('page', String(normalizedPage))
      setSearchParams(nextParams, { replace: true })
    }
  }, [currentPage, isMobile, searchParams, setSearchParams, totalPages])

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return

    const page = nextPageRef.current
    const requestVersion = requestVersionRef.current
    isFetchingRef.current = true
    setLoadingMore(true)
    setLoadMoreFailed(false)

    try {
      const result = await fetchPage(page)
      if (requestVersionRef.current !== requestVersion) return

      setItems((previousItems) => {
        const existingIds = new Set(previousItems.map(getItemId))
        const freshItems = result.items.filter(
          (item) => !existingIds.has(getItemId(item)),
        )
        return [...previousItems, ...freshItems]
      })
      setTotalCount(result.totalCount)
      nextPageRef.current = page + 1
    } catch {
      if (requestVersionRef.current === requestVersion) {
        setLoadMoreFailed(true)
      }
    } finally {
      if (requestVersionRef.current === requestVersion) {
        isFetchingRef.current = false
        setLoadingMore(false)
      }
    }
  }, [fetchPage, getItemId, hasMore, setItems])

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    totalCount,
    setTotalCount,
    resetLoadMore,
    loadMore,
    loadingMore,
    loadMoreFailed,
    hasMore,
  }
}
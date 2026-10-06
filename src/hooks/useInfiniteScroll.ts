import { useEffect, useRef } from 'react'

export function useInfiniteScroll(onReachEnd: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = sentinelRef.current
    if (!enabled || !element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onReachEnd()
      },
      { rootMargin: '200px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [enabled, onReachEnd])

  return sentinelRef
}

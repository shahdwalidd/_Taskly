import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/services/apiClient'
import { acceptInvitation } from '@/services/Projectmembersservice'
import { getValidAccessToken } from '@/services/AuthService'
import { clearSession } from '@/store/Authstore'

type AcceptanceState = 'idle' | 'submitting' | 'success' | 'error'

export function useAcceptInvitation(token: string) {
  const navigate = useNavigate()
  const requestInFlight = useRef(false)
  const [state, setState] = useState<AcceptanceState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)

  const accept = useCallback(async () => {
    if (!token || requestInFlight.current) return

    requestInFlight.current = true
    setState('submitting')
    setError(null)

    try {
      let accessToken: string
      try {
        accessToken = await getValidAccessToken()
      } catch {
        clearSession()
        const redirect = `${window.location.pathname}${window.location.search}`
        navigate(`/login?redirect=${encodeURIComponent(redirect)}`, { replace: true })
        return
      }

      const result = await acceptInvitation(token, accessToken)
      setProjectId(result.projectId)
      setState('success')
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        clearSession()
        const redirect = `${window.location.pathname}${window.location.search}`
        navigate(`/login?redirect=${encodeURIComponent(redirect)}`, { replace: true })
        return
      }

      setError(
        cause instanceof ApiError && cause.message.trim()
          ? cause.message
          : cause instanceof Error
            ? cause.message
            : 'Something went wrong while accepting the invitation. Please try again.',
      )
      setState('error')
    } finally {
      requestInFlight.current = false
    }
  }, [navigate, token])

  useEffect(() => {
    if (state !== 'success') return

    const timeoutId = window.setTimeout(() => {
      navigate(projectId ? `/project/${encodeURIComponent(projectId)}/tasks` : '/project', {
        replace: true,
      })
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [navigate, projectId, state])

  return {
    state,
    error,
    accept,
  }
}

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSession, getSession } from '@/store/Authstore'
import { getValidAccessToken, logout } from '@/services/AuthService'

interface Authstate {
  isauth: boolean
  isloading: boolean
  isLoggingOut: boolean
  logoutError: string | null
}
interface UseAuthReturn extends Authstate {
  logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate()
  const hasCheckedSession = useRef(false)
  const [state, setState] = useState<Authstate>({
    isauth: false,
    isloading: true,
    isLoggingOut: false,
    logoutError: null,
  })
  const isLoggingOut = useRef(false)

  useEffect(() => {
    if (hasCheckedSession.current) return

    hasCheckedSession.current = true
    async function checkSession() {
      const session = getSession()

      if (!session) {
        setState((current) => ({ ...current, isauth: false, isloading: false }))
        return
      }

      try {
        await getValidAccessToken()
        setState((current) => ({ ...current, isauth: true, isloading: false }))
      } catch {
        clearSession()
        setState((current) => ({ ...current, isauth: false, isloading: false }))
      }
    }

    checkSession()
  }, [])
  async function handleLogout() {
    if (isLoggingOut.current) return

    const session = getSession()

    if (!session) {
      clearSession()
      setState((current) => ({ ...current, isauth: false, isloading: false }))
      navigate('/login', { replace: true })
      return
    }

    isLoggingOut.current = true
    setState((current) => ({
      ...current,
      isLoggingOut: true,
      logoutError: null,
    }))

    try {
      await logout(await getValidAccessToken())
      clearSession()
      setState((current) => ({
        ...current,
        isauth: false,
        isloading: false,
        isLoggingOut: false,
      }))
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Remote logout failed:', error)
      setState((current) => ({
        ...current,
        isLoggingOut: false,
        logoutError: 'Logout failed, please try again.',
      }))
    } finally {
      isLoggingOut.current = false
    }
  }
  return {
    ...state,
    logout: handleLogout,
  }
}

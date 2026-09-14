import { useEffect, useRef, useState } from 'react'
import { saveSession, clearSession, getSession } from '../store/Authstore'
import { refreshAccessToken } from '../services/AuthService'

interface Authstate {
  isauth: boolean
  isloading: boolean
}

export function useAuth(): Authstate {
  const hasCheckedSession = useRef(false)
  const [state, setState] = useState<Authstate>({
    isauth: false,
    isloading: true,
  })

  useEffect(() => {
    if (hasCheckedSession.current) return

    hasCheckedSession.current = true
    async function checkSession() {
      const session = getSession()

      if (!session) {
        setState({ isauth: false, isloading: false })
        return
      }

      const isTokenExpired = Date.now() / 1000 > session.expires_at

      if (!isTokenExpired) {
        setState({ isauth: true, isloading: false })
        return
      }

      try {
        const refresh = await refreshAccessToken(session.refresh_token)

        saveSession(
          {
            access_token: refresh.access_token,
            refresh_token: refresh.refresh_token,
            expires_at: refresh.expires_at,
          },
          session.remember_me,
        )

        setState({ isauth: true, isloading: false })
      } catch {
        clearSession()
        setState({ isauth: false, isloading: false })
      }
    }

    checkSession()
  }, [])

  return state
}

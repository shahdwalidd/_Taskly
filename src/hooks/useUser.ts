import { useEffect, useState } from 'react'
import { getUser } from '@/services/UserService'
import { getSession } from '@/store/Authstore'
import { useAuth } from '@/hooks/useAuth'
import type { UserResponse } from '@/types/user.types'

interface UseUserState {
  user: UserResponse | null
  isLoading: boolean
  error: string | null
}

export function useUser(): UseUserState {
  const { isauth, isloading: isAuthLoading } = useAuth()

  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthLoading) return

    let isMounted = true

    async function fetchUser() {
      if (!isauth) {
        if (isMounted) {
          setUser(null)
          setIsLoading(false)
          setError(null)
        }
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const session = getSession()

        if (!session) {
          if (isMounted) {
            setUser(null)
            setIsLoading(false)
          }
          return
        }

        const userData = await getUser(session.access_token)

        if (isMounted) setUser(userData)
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : 'Failed to fetch user',
          )
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void fetchUser()

    return () => {
      isMounted = false
    }
  }, [isauth, isAuthLoading])

  return { user, isLoading, error }
}

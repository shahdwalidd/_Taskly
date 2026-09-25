import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from '@/services/AuthService'
import {
  clearRecoveryAccessToken,
  getRecoveryAccessToken,
} from '@/store/Authstore'

export function useResetPassword() {
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(3)
  const [hasAccessToken] = useState(() => Boolean(getRecoveryAccessToken()))

  useEffect(() => {
    if (!isSaved) return

    if (secondsLeft <= 0) {
      navigate('/login', { replace: true })
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [isSaved, navigate, secondsLeft])

  async function resetPassword(password: string) {
    setIsLoading(true)
    setIsSaved(false)
    setRequestError(null)
    setSecondsLeft(3)

    const accessToken = getRecoveryAccessToken()

    if (!accessToken) {
      setRequestError(
        'This reset link is invalid or has expired. Please request a new one.',
      )
      setIsLoading(false)
      return false
    }

    try {
      await updatePassword(password, accessToken)
      clearRecoveryAccessToken()
      setIsSaved(true)
      return true
    } catch (error) {
      console.error('Password reset request failed:', error)
      setRequestError(error instanceof Error ? error.message : String(error))
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    resetPassword,
    isLoading,
    isSaved,
    requestError,
    secondsLeft,
    hasAccessToken,
  }
}

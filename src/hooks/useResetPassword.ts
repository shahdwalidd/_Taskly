import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from '@/services/AuthService'


export function useResetPassword() {
  const navigate = useNavigate()
  const recoveryParams = new URLSearchParams(
  window.location.hash.slice(1),
)

const recoveryType = recoveryParams.get('type')
const accessToken = recoveryParams.get('access_token')

const hasAccessToken =
  recoveryType === 'recovery' && Boolean(accessToken)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(3)

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

  if (!hasAccessToken || !accessToken) {
  setRequestError(
    'This reset link is invalid or has expired. Please request a new one.',
  )
  setIsLoading(false)
  return false
}

    try {
      await updatePassword(password, accessToken)
  
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

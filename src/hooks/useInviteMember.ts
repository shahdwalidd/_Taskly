import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/services/apiClient'
import { getValidAccessToken } from '@/services/AuthService'
import { inviteMember } from '@/services/Projectmembersservice'
import { clearSession } from '@/store/Authstore'
import {
  inviteMemberEmailSchema,
  projectIdSchema,
} from '@/schemas/InviteMember.schema'

export function useInviteMember(projectId: string) {
  const navigate = useNavigate()
  const requestInFlight = useRef(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string>()
  const [requestError, setRequestError] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value)
    setEmailError(undefined)
    setRequestError(undefined)
    setSuccessMessage(undefined)
  }, [])

  const reset = useCallback(() => {
    if (requestInFlight.current) return
    setEmail('')
    setEmailError(undefined)
    setRequestError(undefined)
    setSuccessMessage(undefined)
  }, [])

  const submit = useCallback(async () => {
    if (requestInFlight.current) return

    setRequestError(undefined)
    setSuccessMessage(undefined)
    setEmailError(undefined)

    const emailResult = inviteMemberEmailSchema.safeParse(email)
    if (!emailResult.success) {
      setEmailError(emailResult.error.issues[0]?.message ?? 'Please enter a valid email address.')
      return
    }

    const projectIdResult = projectIdSchema.safeParse(projectId)
    if (!projectIdResult.success) {
      setRequestError(projectIdResult.error.issues[0]?.message ?? 'This project could not be identified.')
      return
    }

    requestInFlight.current = true
    setIsSubmitting(true)

    try {
      let accessToken: string
      try {
        accessToken = await getValidAccessToken()
      } catch {
        clearSession()
        navigate('/login', { replace: true })
        return
      }

      await inviteMember(projectIdResult.data, emailResult.data, accessToken)
      setEmail('')
      setSuccessMessage('Invitation sent successfully.')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearSession()
        navigate('/login', { replace: true })
        return
      }

      setRequestError(
        error instanceof ApiError && error.message.trim()
          ? error.message
          : 'Failed to send invitation. Please try again.',
      )
    } finally {
      requestInFlight.current = false
      setIsSubmitting(false)
    }
  }, [email, navigate, projectId])

  return {
    email,
    emailError,
    requestError,
    successMessage,
    isSubmitting,
    handleEmailChange,
    submit,
    reset,
  }
}

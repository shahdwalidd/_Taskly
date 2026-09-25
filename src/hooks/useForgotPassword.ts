import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
  ForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/schemas/ForgotPasswordschema'
import { forgetPassword } from '@/services/AuthService'
import { useCountdown } from './useCountdown'

const MAX_RESEND_ATTEMPTS = 3
const RESEND_SECONDS = 5 * 60

export function useForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [resendCount, setResendCount] = useState(0)
  const [resendError, setResendError] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)

  const {
    formatted,
    isFinished,
    reset: resetCountdown,
  } = useCountdown(RESEND_SECONDS)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    if (isSubmitted) return

    setRequestError(null)
    try {
      await forgetPassword(values.email)
      setSubmittedEmail(values.email)
      setIsSubmitted(true)
      setResendCount(0)
      resetCountdown()
    } catch (error) {
      const message =
        error instanceof TypeError
          ? "We couldn't connect to the server. Please check your connection and try again."
          : "We couldn't send the reset link. Please try again."
      setRequestError(message)
      toast.error(message)
    }
  }

  const hasReachedMaxAttempts = resendCount >= MAX_RESEND_ATTEMPTS
  const canResend = isFinished && !hasReachedMaxAttempts
  const attemptsLeft = MAX_RESEND_ATTEMPTS - resendCount

  async function handleResend() {
    if (!canResend) return

    setResendError(null)

    try {
      await forgetPassword(submittedEmail)
      setResendCount((prev) => prev + 1)
      resetCountdown()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to resend email.'
      setResendError(message)
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    requestError,
    isSubmitted,
    submittedEmail,
    formatted,
    canResend,
    hasReachedMaxAttempts,
    attemptsLeft,
    resendError,
    handleResend,
  }
}

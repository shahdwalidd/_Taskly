import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUp } from '../services/AuthService'
import { signupSchema, type SignupFormValues } from '../schemas/Signupschema'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export function useSignup() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      jobTitle: '',
      password: '',
      confirmPassword: '',
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch('password')
  const onSubmit = async (formvalues: SignupFormValues) => {
    setServerError(null)
    try {
      await signUp({
        email: formvalues.email,
        password: formvalues.password,
        data: {
          name: formvalues.name,
          job_title: formvalues.jobTitle?.trim() || undefined,
        },
      })
      navigate('/login')
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message)
      }
    }
  }
  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    passwordValue,
    serverError,
    onSubmit,
  }
}

import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loginschema, type LoginFormValues } from '../schemas/Loginschema'
import { useState } from 'react'
import { saveSession } from '../store/Authstore'
import { Login as loginUser } from '../services/AuthService'

export function useLogin() {
  const navigate = useNavigate()
  const [servererror, setservereeror] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(Loginschema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setservereeror(null)
    try {
      const result = await loginUser({
        email: values.email,
        password: values.password,
      })
      saveSession(
        {
          access_token: result.access_token,
          refresh_token: result.refresh_token,
          expires_at: result.expires_at,
        },
        rememberMe,
      )

      navigate('/project')
    } catch (err) {
      if (err instanceof Error) {
        setservereeror(err.message)
      }
    }
  }
  return {
    register,
    errors,
    setRememberMe,
    rememberMe,
    isSubmitting,
    servererror,
    navigate,
    onSubmit,
    handleSubmit,
  }
}

import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loginschema, type LoginFormValues } from '../schemas/Loginschema'
import { Header } from '../components/shared/Header'
import { AuthCard } from '../components/shared/AuthCard'
import { PasswordField } from '../components/shared/PasswordField'
import { FormField } from '../components/shared/FormField'
import { Button } from '../components/shared/Button'
import { FooterLink } from '../components/shared/FooterLink'
import { useState } from 'react'
import { Login as loginUser } from '../services/AuthService'
import LoginHeader from '../components/login-com/LoginHeader'
import { RememberMeSection } from '../components/login-com/RememberMe'
import { saveSession } from '../store/Authstore'
const LoginPage = () => {
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

  return (
    <>
      <Header />
      <div className="md:bg-background flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center bg-white px-6 py-12">
        <AuthCard>
          <div className="mb-10">
            <LoginHeader />
          </div>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="yourname@company.com"
              register={register}
              error={errors.email?.message}
            />

            <PasswordField
              label="Password"
              name="password"
              placeholder="Enter your password"
              register={register}
              error={errors.password?.message}
              linkText="Forgot?"
              onLinkClick={() => {}}
            />

            <RememberMeSection
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              onForgotPassword={() => {}}
            />

            {servererror && (
              <p className="text-label-sm text-error">{servererror}</p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          <div className="mt-8">
            <FooterLink
              text="Don't have an account? "
              linkText="Sign Up"
              onLinkClick={() => navigate('/sign-up')}
            />
          </div>
        </AuthCard>
      </div>
    </>
  )
}

export default LoginPage

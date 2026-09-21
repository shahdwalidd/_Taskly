import { Header } from '@/components/shared/Header'
import { AuthCard } from '@/components/shared/AuthCard'
import { PasswordField } from '@/components/shared/PasswordField'
import { FormField } from '@/components/shared/FormField'
import { Button } from '@/components/shared/Button'
import { AuthPromptLink } from '@/components/shared/AuthPromptLink'
import { useLogin } from '@/hooks/useLogin'
import LoginHeader from '@/components/login/LoginHeader'
import { RememberMeSection } from '@/components/login/RememberMe'

const LoginPage = () => {
  const {
    register,
    errors,
    setRememberMe,
    rememberMe,
    isSubmitting,
    servererror,
    onSubmit,
    handleSubmit,
  } = useLogin()

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
            <AuthPromptLink
              text="Don't have an account? "
              linkText="Sign Up"
              href="/sign-up"
            />
          </div>
        </AuthCard>
      </div>
    </>
  )
}

export default LoginPage

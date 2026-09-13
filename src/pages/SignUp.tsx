import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Header } from '../components/shared/Header'
import { Heading } from '../components/register-com/Heading'
import { PasswordField } from '../components/shared/PasswordField'
import { FormField } from '../components/shared/FormField'
import { AuthCard } from '../components/shared/AuthCard'
import { Button } from '../components/shared/Button'
import { FooterLink } from '../components/shared/FooterLink'
import { PasswordRequirements } from '../components/register-com/PasswordRequirements'
import { signupSchema, type SignupFormValues } from '../schemas/Signupschema'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../services/AuthService'
export function SignUp() {
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

  return (
    <>
      <Header />
      <div className="md:bg-background flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center bg-white px-6 py-12">
        <AuthCard>
          <div className="mt-8 mb-10 w-full">
            <Heading />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <FormField
              label="Name"
              name="name"
              placeholder="Enter your full name"
              hint="3-50 characters, letters only."
              register={register}
              error={errors.name?.message}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="yourname@company.com"
              register={register}
              error={errors.email?.message}
            />

            <FormField
              label="Job Title (Optional)"
              name="jobTitle"
              placeholder="e.g. Project Manager"
              register={register}
              error={errors.jobTitle?.message}
            />

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <PasswordField
                label="Password"
                name="password"
                placeholder="Password"
                register={register}
                error={errors.password?.message}
              />

              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Repeat your password"
                register={register}
                error={errors.confirmPassword?.message}
                showVisibilityToggle={false}
              />
            </div>

            <PasswordRequirements password={passwordValue} />
            {serverError && (
              <p className="text-label-sm text-error">{serverError}</p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {' '}
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8">
            <FooterLink
              text="Already have an account?"
              linkText="Log in"
              onLinkClick={() => navigate('/login')}
            />
          </div>
        </AuthCard>
      </div>
    </>
  )
}

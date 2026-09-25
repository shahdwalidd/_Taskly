import { AuthCard } from '@/components/shared/AuthCard'
import { FormField } from '@/components/shared/FormField'
import { Button } from '@/components/shared/Button'
import { BackToLoginLink } from '@/components/forget-password/BackToLoginLink'
import { Header } from '@/components/shared/Header'
import { ResendSuccessBanner } from '@/components/forget-password/ResendSuccessBanner'
import { useForgotPassword } from '@/hooks/useForgotPassword'

export function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        requestError,
        isSubmitted,
        formatted,
        canResend,
        hasReachedMaxAttempts,
        attemptsLeft,
        handleResend,
    } = useForgotPassword()

    return (
        <>
            <Header />
            <div className="md:bg-background flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center px-6 py-12">
                <div className="w-full md:w-(--layout-auth-width)">
                    <AuthCard>
                    <div className="mb-5 flex flex-col gap-2 text-center md:items-start md:text-center">
                        <h1 className="text-pp text-slate-dark">Forgot password?</h1>
                        <p className="text-boy-sm text-slate-medium">
                           No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <FormField
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="yourname@company.com"
                            register={register}
                            error={errors.email?.message}
                            isRequired
                        />
                        {requestError && (
                            <p className="text-label-sm text-error" role="alert">
                                {requestError}
                            </p>
                        )}
                        <Button type="submit" disabled={isSubmitting || isSubmitted}>
                            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                         <div className="mt-6">
                        <BackToLoginLink />
                    </div>
                    </form>

                 

                   
                    </AuthCard>
                    {isSubmitted && (
                        <div className="mt-5 w-full">
                            <ResendSuccessBanner
                                formatted={formatted}
                                canResend={canResend}
                                hasReachedMaxAttempts={hasReachedMaxAttempts}
                                attemptsLeft={attemptsLeft}
                                onResend={handleResend}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )






































}
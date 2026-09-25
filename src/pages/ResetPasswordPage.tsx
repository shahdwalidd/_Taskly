import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Header } from '@/components/shared/Header'
import { AuthCard } from '@/components/shared/AuthCard'
import { PasswordField } from '@/components/shared/PasswordField'
import { BackToLoginLink } from '@/components/forget-password/BackToLoginLink'
import { Button } from '@/components/shared/Button'
import { SecurityRequirements } from '@/components/reset-password/SecurityRequirements'
import { getPasswordRequirements } from '@/utils/passwordRequirements'
import {
	resetPasswordSchema,
	type ResetPasswordFormValues,
} from '@/schemas/ResetPasswordschema'
import { useResetPassword } from '@/hooks/useResetPassword'

export function ResetPasswordPage() {
	const {
		resetPassword,
		isLoading,
		isSaved,
		requestError,
		secondsLeft,
		hasAccessToken,
	} = useResetPassword()
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	})
	const password = useWatch({ control, name: 'password', defaultValue: '' })

	async function onSubmit(values: ResetPasswordFormValues) {
		await resetPassword(values.password)
	}

	return (
		<>
			<Header />
			<div className="md:bg-background flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center bg-white px-6 py-12">
				<div className="w-full md:w-(--layout-auth-width)">
					<AuthCard>
						<div className="mb-5 flex flex-col gap-2 text-left md:items-start md:text-left">
							<h1 className="text-pp text-slate-dark">Create a New Password</h1>
							<p className="text-boy-sm text-slate-medium">
								Create a new, strong password to secure your workstation <br />
access.
							</p>
						</div>

						{!hasAccessToken ? (
							<p className="text-label-sm text-error" role="alert">
								Invalid or expired reset link.
							</p>
						) : (
						<form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
							<PasswordField
								label="New Password"
								name="password"
								placeholder="Enter your new password"
								register={register}
								error={errors.password?.message}
							/>

							<PasswordField
								label="Confirm Password"
								name="confirmPassword"
								placeholder="Repeat your new password"
								register={register}
								error={errors.confirmPassword?.message}
								showVisibilityToggle={false}
							/>

							<SecurityRequirements requirements={getPasswordRequirements(password)} />

							{isSaved && (
								<div className="flex flex-col gap-1">
									<p className="text-label-sm text-darkgreen">
										Your password has been updated successfully. You can now log in
									</p>
									<p className="text-label-sm text-slate-medium">
										Redirecting to login in {secondsLeft} seconds...
									</p>
								</div>
							)}

							{requestError && (
								<p className="text-label-sm text-error" role="alert">
									{requestError}
								</p>
							)}

							<Button type="submit" disabled={isLoading || isSubmitting}>
							{isLoading ? 'Updating...' : 'Update Password'}
							</Button>

							<BackToLoginLink />
						</form>
						)}
					</AuthCard>
				</div>
			</div>
		</>
	)
}
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const resetPasswordRedirectUrl =
  import.meta.env.VITE_RESET_PASSWORD_REDIRECT_URL ??
  `${window.location.origin}/reset-password`
import type {
  SignupPayload,
  SignupSuccessResponse,
  SignupErrorResponse,
  LoginPayload,
  LoginSuccessResponse,
  LoginErrorResponse,
  RefreshResponse,
} from '@/types/auth.types'
export async function signUp(
  payload: SignupPayload,
): Promise<SignupSuccessResponse> {
  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  if (!response.ok) {
    const errorData = result as SignupErrorResponse
    throw new Error(errorData.msg || 'something went wrong please try again')
  }
  return result as SignupSuccessResponse
}
export async function Login(
  payload: LoginPayload,
): Promise<LoginSuccessResponse> {
  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: { apikey: supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  )
  const result = await response.json()
  if (!response.ok) {
    const errorData = result as LoginErrorResponse
    throw new Error(errorData.msg || 'something went wrong please try again')
  }
  return result as LoginSuccessResponse
}
export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshResponse> {
  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
    {
      method: 'POST',
      headers: { apikey: supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  )
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.msg || 'something went wrong please try again')
  }
  return result
}
export async function logout(accessToken: string): Promise<void> {
  const response = await fetch(`${supabaseUrl}/auth/v1/logout`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    const result = await response.json()
    throw new Error(result.msg || 'failed to logout')
  }
}
export async function forgetPassword(email: string): Promise<void> {
  const response = await fetch(`${supabaseUrl}/auth/v1/recover`, {
    method: 'POST',
    headers: { apikey: supabaseKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      redirect_to: resetPasswordRedirectUrl,
    }),
  })

  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(
      result?.msg || 'Failed to send reset email. Please try again.',
    )
  }
}

export async function updatePassword(
  password: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(
      result?.msg || result?.message || 'Failed to update password.',
    )
  }
}

import type {
  SignupPayload,
  SignupSuccessResponse,
  LoginPayload,
  LoginSuccessResponse,
  RefreshResponse,
} from '@/types/auth.types'
import { apiRequest } from './apiClient'

export async function signUp(
  payload: SignupPayload,
): Promise<SignupSuccessResponse> {
  return apiRequest<SignupSuccessResponse>('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function Login(
  payload: LoginPayload,
): Promise<LoginSuccessResponse> {
  return apiRequest<LoginSuccessResponse>(
    '/auth/v1/token?grant_type=password',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshResponse> {
  return apiRequest<RefreshResponse>(
    '/auth/v1/token?grant_type=refresh_token',
    {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  )
}

export async function logout(accessToken: string): Promise<void> {
  await apiRequest<void>('/auth/v1/logout', {
    method: 'POST',
    accessToken,
  })
}

export async function forgetPassword(email: string): Promise<void> {
  await apiRequest<void>('/auth/v1/recover', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function updatePassword(
  password: string,
  accessToken: string,
): Promise<void> {
  await apiRequest<void>('/auth/v1/user', {
    method: 'PUT',
    accessToken,
    body: JSON.stringify({ password }),
  })
}

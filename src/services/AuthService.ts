import type {
  SignupPayload,
  SignupSuccessResponse,
  LoginPayload,
  LoginSuccessResponse,
  RefreshResponse,
} from '@/types/auth.types'
import { apiRequest } from './apiClient'
import { clearSession, getSession, saveSession } from '@/store/Authstore'

let refreshInFlight: Promise<string> | null = null

export async function getValidAccessToken(): Promise<string> {
  const session = getSession()

  if (!session) {
    throw new Error('Authentication is required')
  }

  if (
    session.access_token?.trim() &&
    Date.now() / 1000 < session.expires_at - 30
  ) {
    return session.access_token
  }

  if (!session.refresh_token?.trim()) {
    clearSession()
    throw new Error('Your session has expired')
  }

  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken(session.refresh_token)
      .then((refresh) => {
        if (!refresh.access_token?.trim()) {
          throw new Error('Unable to refresh your session')
        }

        saveSession(
          {
            access_token: refresh.access_token,
            refresh_token: refresh.refresh_token,
            expires_at: refresh.expires_at,
          },
          session.remember_me,
        )
        return refresh.access_token
      })
      .catch((error: unknown) => {
        clearSession()
        throw error
      })
      .finally(() => {
        refreshInFlight = null
      })
  }

  return refreshInFlight
}

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

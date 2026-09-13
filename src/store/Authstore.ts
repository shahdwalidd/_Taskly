const storage_key = 'taskly_session'
interface StoredSession {
  access_token: string
  refresh_token: string
  expires_at: number
  remember_me: boolean
  remember_until?: number
}
const one_month = 30 * 24 * 60 * 60 * 1000
export function saveSession(
  session: { access_token: string; refresh_token: string; expires_at: number },
  rememberMe: boolean,
) {
  const data: StoredSession = {
    ...session,
    remember_me: rememberMe,
    remember_until: rememberMe ? Date.now() + one_month : undefined,
  }
  const json = JSON.stringify(data)
  if (rememberMe) {
    localStorage.setItem(storage_key, json)
    sessionStorage.removeItem(storage_key)
  } else {
    sessionStorage.setItem(storage_key, json)
    localStorage.removeItem(storage_key)
  }
}
export function getSession(): StoredSession | null {
  const findd =
    localStorage.getItem(storage_key) ?? sessionStorage.getItem(storage_key)
  if (!findd) return null
  const data = JSON.parse(findd) as StoredSession
  if (
    data.remember_me &&
    data.remember_until !== undefined &&
    Date.now() > data.remember_until
  ) {
    clearSession()
    return null
  }
  return data
}
export function clearSession() {
  localStorage.removeItem(storage_key)
  sessionStorage.removeItem(storage_key)
}

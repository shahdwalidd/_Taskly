const storageKey = 'taskly_session'
interface StoredSession {
  access_token: string
  refresh_token: string
  expires_at: number
  remember_me: boolean
  remember_until?: number
}
const oneMonth = 30 * 24 * 60 * 60 * 1000
export function saveSession(
  session: { access_token: string; refresh_token: string; expires_at: number },
  rememberMe: boolean,
) {
  const data: StoredSession = {
    ...session,
    remember_me: rememberMe,
    remember_until: rememberMe ? Date.now() + oneMonth : undefined,
  }
  const json = JSON.stringify(data)
  if (rememberMe) {
    localStorage.setItem(storageKey, json)
    sessionStorage.removeItem(storageKey)
  } else {
    sessionStorage.setItem(storageKey, json)
    localStorage.removeItem(storageKey)
  }
}
export function getSession(): StoredSession | null {
  const sessionValue =
    localStorage.getItem(storageKey) ?? sessionStorage.getItem(storageKey)
  if (!sessionValue) return null
  const data = JSON.parse(sessionValue) as StoredSession
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
  localStorage.removeItem(storageKey)
  sessionStorage.removeItem(storageKey)
}

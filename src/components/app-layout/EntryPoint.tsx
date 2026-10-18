import { Navigate, useLocation } from 'react-router-dom'

export function EntryPoint() {
  const location = useLocation()
  const params = new URLSearchParams(location.hash.slice(1))
  const isRecoveryLink =
    params.get('type') === 'recovery' && Boolean(params.get('access_token'))

  if (isRecoveryLink) return null

  return <Navigate to="/login" replace />
}
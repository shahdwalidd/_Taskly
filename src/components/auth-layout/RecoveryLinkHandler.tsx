import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { saveRecoveryAccessToken } from '@/store/Authstore'

export function RecoveryLinkHandler() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const hash = window.location.hash || location.hash
    if (!hash) return

    const params = new URLSearchParams(hash.slice(1))
    if (params.get('type') !== 'recovery') return

    const accessToken = params.get('access_token')
    if (!accessToken) return

    saveRecoveryAccessToken(accessToken)
    window.history.replaceState(null, '', window.location.pathname)
    navigate('/reset-password', { replace: true })
  }, [location.hash, navigate])

  return null
}

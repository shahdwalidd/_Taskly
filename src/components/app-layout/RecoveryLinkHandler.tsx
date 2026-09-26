import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function RecoveryLinkHandler() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.hash.slice(1))

    const type = params.get('type')
    const accessToken = params.get('access_token')

    if (type !== 'recovery' || !accessToken) return

    navigate(`/reset-password${location.hash}`, { replace: true })
  }, [location.hash, navigate])

  return null
}
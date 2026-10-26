const defaultDestination = '/project'

export function getPostLoginRedirect(destination: string | null): string {
  if (!destination || !destination.startsWith('/') || destination.startsWith('//') || destination.includes('\\')) {
    return defaultDestination
  }

  try {
    const url = new URL(destination, window.location.origin)
    if (url.origin !== window.location.origin) return defaultDestination
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return defaultDestination
  }
}

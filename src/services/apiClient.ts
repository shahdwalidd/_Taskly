const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

interface ApiRequestOptions extends RequestInit {
  accessToken?: string
}
function extractErrorMessage(result: unknown): string | undefined {
  if (typeof result === 'object' && result !== null) {
    if ('message' in result)
      return String((result as { message: unknown }).message)
    if ('msg' in result) return String((result as { msg: unknown }).msg)
  }
  return undefined
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { accessToken, headers, ...requestOptions } = options

  const response = await fetch(`${supabaseUrl}${endpoint}`, {
    ...requestOptions,
    headers: {
      apikey: supabaseKey,
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  })

  const responseText = await response.text()
  let result: unknown = null

  if (responseText) {
    try {
      result = JSON.parse(responseText)
    } catch {
      result = responseText
    }
  }

  if (!response.ok) {
    const apiMessage = extractErrorMessage(result)
    throw new Error(
      apiMessage ?? `Request failed with status ${response.status}`,
    )
  }

  return result as T
}

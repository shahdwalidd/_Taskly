const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

interface ApiResponse<T> {
  data: T
  headers: Headers
}

interface ApiRequestOptions extends RequestInit {
  accessToken?: string
  includeHeaders?: boolean
}

function extractErrorMessage(result: unknown): string | undefined {
  if (typeof result === 'object' && result !== null) {
    if ('message' in result)
      return String((result as { message: unknown }).message)
    if ('msg' in result) return String((result as { msg: unknown }).msg)
  }
  return undefined
}

export function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions & { includeHeaders: true },
): Promise<ApiResponse<T>>
export function apiRequest<T>(
  endpoint: string,
  options?: ApiRequestOptions & { includeHeaders?: false },
): Promise<T>
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T | ApiResponse<T>> {
  const { accessToken, headers, includeHeaders, ...requestOptions } = options

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

  if (includeHeaders) {
    return {
      data: result as T,
      headers: response.headers,
    } as ApiResponse<T>
  }

  return result as T
}

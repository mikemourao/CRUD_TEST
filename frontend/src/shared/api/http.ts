const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

interface RequestOptions extends RequestInit {
  signal?: AbortSignal
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string | string[] } | null
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message
    throw new Error(message ?? 'Não foi possível comunicar com a API.')
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

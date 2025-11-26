import { getAuthToken, getApiUrl } from './auth.js'

export interface ApiError {
  error: string
  details?: any
}

export interface ApiResponse<T = any> {
  data?: T
  error?: ApiError
}

/**
 * Make authenticated API request
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const apiUrl = await getApiUrl()
    const token = await getAuthToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data,
      }
    }

    return { data }
  } catch (error) {
    return {
      error: {
        error:
          error instanceof Error ? error.message : 'Network error. Is the server running?',
      },
    }
  }
}

/**
 * Login to backend
 */
export async function loginApi(
  email: string,
  password: string
): Promise<
  ApiResponse<{
    success: boolean
    token: string
    user: { id: string; email: string; name: string | null }
  }>
> {
  return apiRequest('/auth/cli-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

/**
 * Logout from backend
 */
export async function logoutApi(): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest('/auth/cli-logout', {
    method: 'POST',
  })
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<
  ApiResponse<{
    user: {
      id: string
      email: string
      name: string | null
      createdAt: string
      updatedAt: string
    }
  }>
> {
  return apiRequest('/auth/me')
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const apiUrl = await getApiUrl()
    const response = await fetch(`${apiUrl}/health`)
    return response.ok
  } catch {
    return false
  }
}

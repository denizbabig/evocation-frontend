/* Imports */
import axios from 'axios'
import router from '@/router'
import { oktaAuth } from '@/lib/oktaAuth'

/* Konstanten */
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api'

/* Axios Instance */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '/api',
  timeout: 10000,
  withCredentials: true,
})

/* Interceptors */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status

    if (status === 401) {
      try {
        oktaAuth.tokenManager.clear()
      } catch {}

      const current = router.currentRoute.value
      const requiresAuth = !!current.meta.requiresAuth

      if (requiresAuth) {
        const from = current.fullPath
        if (current.name !== 'login') {
          router.replace({ name: 'login', query: { from } }).catch(() => {})
        }
      }
    }

    return Promise.reject(err)
  }
)

api.interceptors.request.use(async (config) => {
  const token = await oktaAuth.tokenManager.get('accessToken')
  if (token?.accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token.accessToken}`
  }
  return config
})

/* Auth API */
export async function login(email: string, password: string) {
  await api.post('/auth/login', { email, password })
}

export async function logout() {
  await api.post('/auth/logout')
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me')
  return data
}

/* Fetch Helper */
export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`

  const headers = new Headers(options.headers ?? {})

  const token = await oktaAuth.tokenManager.get('accessToken')
  const accessToken = (token as any)?.accessToken

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'omit',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${options.method ?? 'GET'} ${path} ${res.status}: ${text}`)
  }

  if (res.status === 204) return null
  const ct = res.headers.get('content-type') ?? ''
  return ct.includes('application/json') ? res.json() : res.text()
}

/* Share API */
export async function fetchSharedMarkers(code: string) {
  return apiFetch(`/share/${encodeURIComponent(code)}/markers`)
}

/* Types */
export type SavedShareLinkDTO = {
  id: number
  code: string
  label?: string | null
  createdAt?: string | null
  active?: boolean
}

/* Saved Share Links API */
export async function listSavedShareLinks() {
  return apiFetch('/share/saved', { method: 'GET' }) as Promise<SavedShareLinkDTO[]>
}

export async function createSavedShareLink(codeOrLink: string, label?: string | null) {
  return apiFetch('/share/saved', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codeOrLink, label }),
  }) as Promise<SavedShareLinkDTO>
}

export async function updateSavedShareLinkLabel(id: number, label?: string | null) {
  return apiFetch(`/share/saved/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  }) as Promise<SavedShareLinkDTO>
}

export async function deleteSavedShareLink(id: number) {
  return apiFetch(`/share/saved/${id}`, { method: 'DELETE' })
}

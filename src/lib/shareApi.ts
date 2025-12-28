// src/lib/shareApi.ts
import type { SharedMapDTO } from '@/types/Share'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api'

function buildUrl(path: string) {
  if (path.startsWith('http')) return path
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export class PublicHttpError extends Error {
  status: number
  body?: string

  constructor(message: string, status: number, body?: string) {
    super(message)
    this.name = 'PublicHttpError'
    this.status = status
    this.body = body
  }
}

/**
 * ✅ PUBLIC fetch:
 * - KEIN Authorization Header
 * - credentials: 'omit'
 */
export async function publicFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = buildUrl(path)

  const res = await fetch(url, {
    ...options,
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new PublicHttpError(`${options.method ?? 'GET'} ${path} ${res.status}`, res.status, text)
  }

  if (res.status === 204) return null as any

  const ct = res.headers.get('content-type') ?? ''
  return (ct.includes('application/json') ? res.json() : res.text()) as any
}

export async function fetchSharedMapPublic(code: string): Promise<SharedMapDTO> {
  return publicFetch(`/share/${encodeURIComponent(code)}/map`, { method: 'GET' })
}

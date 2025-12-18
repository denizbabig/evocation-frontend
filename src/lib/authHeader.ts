// src/lib/authHeader.ts
import { oktaAuth } from '@/lib/oktaAuth'

export async function getAuthHeader(): Promise<Record<string, string>> {
  const t = await oktaAuth.tokenManager.get('accessToken')
  const token = t?.accessToken
  return token ? { Authorization: `Bearer ${token}` } : {}
}

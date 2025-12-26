import { apiFetch } from '@/lib/api'

export async function updateMarkerJson(markerId: number, payload: any) {
  return apiFetch(`/markers/${markerId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

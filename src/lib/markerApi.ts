import { api } from '@/lib/api'

export async function updateMarkerMultipart(
  markerId: string | number,
  payload: any,
  files: File[]
) {
  const fd = new FormData()

  // JSON-Payload als Blob mitsenden
  fd.append('payload', new Blob([JSON.stringify(payload)], { type: 'application/json' }))

  // Dateien
  for (const f of files) fd.append('files', f)

  // WICHTIG: KEIN Content-Type header setzen -> axios setzt boundary korrekt
  const { data } = await api.patch(`/markers/${markerId}`, fd)

  return data
}

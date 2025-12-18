// src/lib/markerImages.ts
import { cldCard, cldThumb, cldFull } from '@/lib/cloudinaryDelivery'

export type NormalizedImage = {
  id: string | number
  order: number
  publicId?: string
  secureUrl?: string
  // ready-to-use URLs
  full: string
  card: string
  thumb: string
}

function pick<T>(v: T | undefined | null) {
  return v == null ? '' : String(v)
}

export function normalizeMarkerImages(marker: any): NormalizedImage[] {
  const raw = (marker?.images ?? []) as any[]
  if (!Array.isArray(raw) || raw.length === 0) return []

  const norm = raw
    .map((it, i) => {
      // akzeptiere auch string-urls (fallback)
      if (typeof it === 'string') {
        const url = it
        return {
          id: i,
          order: i,
          full: url,
          card: url,
          thumb: url,
        } satisfies NormalizedImage
      }

      const publicId = pick(it.publicId ?? it.public_id)
      const secureUrl = pick(it.secureUrl ?? it.secure_url ?? it.url)

      // Priorität: Cloudinary secureUrl (funktioniert immer)
      // Wenn secureUrl fehlt: aus publicId ableiten
      const full = secureUrl || (publicId ? cldFull(publicId) : '')
      const card = secureUrl || (publicId ? cldCard(publicId) : '')
      const thumb = secureUrl || (publicId ? cldThumb(publicId) : '')

      return {
        id: it.id ?? i,
        order: Number(it.order ?? i),
        publicId: publicId || undefined,
        secureUrl: secureUrl || undefined,
        full,
        card,
        thumb,
      } satisfies NormalizedImage
    })
    .filter(x => !!x.full)

  norm.sort((a, b) => a.order - b.order)
  return norm
}

export function markerCover(marker: any): NormalizedImage | null {
  const imgs = normalizeMarkerImages(marker)
  return imgs[0] ?? null
}

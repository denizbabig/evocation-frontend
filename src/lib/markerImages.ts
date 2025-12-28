/* Imports */
import { cldCard, cldFull, cldThumb } from '@/lib/cloudinaryDelivery'

/* Types */
export type NormalizedImage = {
  id: string | number
  order: number
  publicId?: string
  secureUrl?: string
  full: string
  card: string
  thumb: string
}

/* Helpers */
function pick<T>(v: T | undefined | null) {
  return v == null ? '' : String(v)
}

/* Public API */
export function normalizeMarkerImages(marker: any): NormalizedImage[] {
  const raw = (marker?.images ?? []) as any[]
  if (!Array.isArray(raw) || raw.length === 0) return []

  const norm = raw
    .map((it, i) => {
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

      /* BUGFIX: cloudinaryDelivery helpers expect an asset object (not a string publicId) */
      const asset = publicId ? ({ publicId } as any) : null

      const full = secureUrl || (asset ? cldFull(asset) : '')
      const card = secureUrl || (asset ? cldCard(asset) : '')
      const thumb = secureUrl || (asset ? cldThumb(asset) : '')

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
    .filter((x) => !!x.full)

  norm.sort((a, b) => a.order - b.order)
  return norm
}

export function markerCover(marker: any): NormalizedImage | null {
  const imgs = normalizeMarkerImages(marker)
  return imgs[0] ?? null
}

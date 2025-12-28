import type { ImageAsset } from '@/types/ImageAsset'

/* Konstanten */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined

/* Pure Helpers */
function stripExtAny(publicId: string) {
  return publicId.replace(/\.(jpg|jpeg|png|webp|gif|avif|mp4|mov|webm|mkv|m4v)$/i, '')
}

function inferMediaType(a: ImageAsset): 'IMAGE' | 'VIDEO' {
  const mt = (a as any)?.mediaType
  if (mt === 'VIDEO' || mt === 'IMAGE') return mt

  const pid = (a.publicId ?? '').toLowerCase()
  const fmt = String((a as any)?.format ?? '').toLowerCase()

  const isVideo =
    pid.endsWith('.mp4') ||
    pid.endsWith('.mov') ||
    pid.endsWith('.webm') ||
    pid.endsWith('.m4v') ||
    pid.endsWith('.mkv') ||
    fmt === 'mp4' ||
    fmt === 'mov' ||
    fmt === 'webm' ||
    fmt === 'm4v' ||
    fmt === 'mkv'

  return isVideo ? 'VIDEO' : 'IMAGE'
}

/* Delivery */
export function cldMediaUrl(asset: ImageAsset, transforms = 'f_auto,q_auto') {
  if (!asset?.publicId) return ''
  if (!CLOUD_NAME) return ''

  const pid = stripExtAny(asset.publicId)
  const mediaType = inferMediaType(asset)
  const rt = mediaType === 'VIDEO' ? 'video' : 'image'

  const t = transforms ? `${transforms}/` : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/${rt}/upload/${t}${pid}`
}

/* Thumb */
export const cldThumb = (asset: ImageAsset) => {
  const mt = inferMediaType(asset)
  return mt === 'VIDEO'
    ? cldMediaUrl(asset, 'f_auto,q_auto,vc_auto,w_420')
    : cldMediaUrl(asset, 'f_auto,q_auto,w_420')
}

/* Aliases */
export const cldCard = cldThumb

/* Full */
export const cldFull = (asset: ImageAsset) => {
  const mt = inferMediaType(asset)
  return mt === 'VIDEO'
    ? cldMediaUrl(asset, 'f_auto,q_auto,vc_auto')
    : cldMediaUrl(asset, 'f_auto,q_auto')
}

export const isVideoAsset = (asset: ImageAsset) => inferMediaType(asset) === 'VIDEO'
export const inferAssetMediaType = inferMediaType

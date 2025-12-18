// src/lib/cloudinary.ts
import { api } from '@/lib/api'
import type { ImageAsset } from '@/types/ImageAsset'
import { preprocessImageForUpload } from '@/lib/imagePreprocess'

type CloudinarySignResponse = {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  publicId: string
  allowedFormats?: string | null
  overwrite?: boolean
}

type UploadOptions = {
  log?: boolean
  order?: number
  preprocess?: {
    maxDim?: number
    quality?: number
    mimeType?: 'image/webp' | 'image/jpeg'
    skipIfSmallerThanBytes?: number
    keepIfBigger?: boolean
  }
}

export async function uploadToCloudinary(
  file: File,
  opts: UploadOptions = {}
): Promise<ImageAsset> {
  const { log = false, order = 0 } = opts

  // =========================
  // 6.1 Frontend Guardrails
  // =========================
  const MAX_BYTES = 8 * 1024 * 1024 // 8MB
  const ALLOWED_MIME = new Set([
    'image/jpeg',
    'image/jpg',   // manchmal kommt das so
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ])

  if (!file || !(file instanceof File)) {
    throw new Error('Keine Datei ausgewählt')
  }
  if (!file.type?.startsWith('image/')) {
    throw new Error(`Keine Bilddatei: ${file.type || 'unknown'}`)
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error(`Nicht unterstütztes Format: ${file.type}`)
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`Datei zu groß (max ${Math.round(MAX_BYTES / 1024 / 1024)}MB)`)
  }

  // =========================
  // 2) Preprocess (WebP etc.)
  // =========================
  const uploadFile = await preprocessImageForUpload(file, {
    maxDim: 1600,
    quality: 0.82,
    mimeType: 'image/webp',
    skipIfSmallerThanBytes: 300_000,
    keepIfBigger: true,
    ...opts.preprocess,
  })

  if (log) {
    console.log('[upload] original', file.type, file.size, file.name)
    console.log('[upload] prepared', uploadFile.type, uploadFile.size, uploadFile.name)
  }

  // =========================
  // 1) Signed params vom Backend holen
  // =========================
  const { data: sign } = await api.get<CloudinarySignResponse>('/cloudinary/sign')

  if (!sign?.cloudName) throw new Error('Missing cloudName from /api/cloudinary/sign')
  if (!sign?.apiKey) throw new Error('Missing apiKey from /api/cloudinary/sign')
  if (!sign?.timestamp) throw new Error('Missing timestamp from /api/cloudinary/sign')
  if (!sign?.signature) throw new Error('Missing signature from /api/cloudinary/sign')
  if (!sign?.folder) throw new Error('Missing folder from /api/cloudinary/sign')
  if (!sign?.publicId) throw new Error('Missing publicId from /api/cloudinary/sign')

  // overwrite ist bei dir serverseitig auf false “fixiert”
  const overwrite = sign.overwrite ?? false

  if (log) {
    console.log('[upload] sign', {
      cloudName: sign.cloudName,
      apiKey: sign.apiKey,
      timestamp: sign.timestamp,
      folder: sign.folder,
      publicId: sign.publicId,
      allowedFormats: sign.allowedFormats,
      overwrite,
    })
  }

  // =========================
  // 3) Direkt zu Cloudinary hochladen
  // =========================
  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(sign.cloudName)}/image/upload`

  const fd = new FormData()
  fd.append('file', uploadFile)

  // required for signed upload
  fd.append('api_key', sign.apiKey)
  fd.append('timestamp', String(sign.timestamp))
  fd.append('signature', sign.signature)

  // IMPORTANT: must match what backend signed
  fd.append('folder', sign.folder)
  fd.append('public_id', sign.publicId)

  // IMPORTANT: must match what backend signed
  fd.append('overwrite', String(overwrite))

  // only append if backend actually signed it (non-blank)
  if (sign.allowedFormats && String(sign.allowedFormats).trim().length > 0) {
    fd.append('allowed_formats', String(sign.allowedFormats))
  }

  const res = await fetch(url, { method: 'POST', body: fd })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Cloudinary upload failed (${res.status}): ${txt}`)
  }

  const data = await res.json()

  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
    format: data.format,
    order,
  }
}

// =========================
// Display helpers (publicId -> URL)
// =========================
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined

function stripExt(publicId: string) {
  return publicId.replace(/\.(jpg|jpeg|png|webp|gif|avif)$/i, '')
}

export function cldUrl(publicId: string, transform = 'f_auto,q_auto') {
  if (!publicId) return ''
  if (!CLOUD_NAME) {
    console.warn('[cloudinary] VITE_CLOUDINARY_CLOUD_NAME fehlt')
    return ''
  }

  const pid = stripExt(publicId)
  const t = transform ? `${transform}/` : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}${pid}`
}

export function cldLarge(publicId: string) {
  return cldUrl(publicId, 'f_auto,q_auto,w_1600')
}

export function cldThumb(publicId: string) {
  return cldUrl(publicId, 'f_auto,q_auto,w_320')
}



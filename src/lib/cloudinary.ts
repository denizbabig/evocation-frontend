// src/lib/cloudinary.ts
import { api } from '@/lib/api'
import type { ImageAsset, MediaType } from '@/types/ImageAsset'
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
  resourceType?: 'image' | 'video' // ✅ neu
}

type UploadOptions = {
  log?: boolean
  order?: number
  resourceType?: 'image' | 'video' // ✅ optional override
  preprocess?: {
    maxDim?: number
    quality?: number
    mimeType?: 'image/webp' | 'image/jpeg'
    skipIfSmallerThanBytes?: number
    keepIfBigger?: boolean
  }
}

function mediaTypeFromResourceType(rt: 'image' | 'video'): MediaType {
  return rt === 'video' ? 'VIDEO' : 'IMAGE'
}

function guessResourceType(file: File): 'image' | 'video' {
  if (file.type?.startsWith('video/')) return 'video'
  return 'image'
}

export async function uploadToCloudinary(
  file: File,
  opts: UploadOptions = {}
): Promise<ImageAsset> {
  const { log = false, order = 0 } = opts
  const resourceType: 'image' | 'video' = opts.resourceType ?? guessResourceType(file)

  if (!file || !(file instanceof File)) throw new Error('Keine Datei ausgewählt')

  // =========================
  // Guardrails (Image/Video)
  // =========================
  const IMAGE_MAX = 8 * 1024 * 1024 // 8MB
  const VIDEO_MAX = 80 * 1024 * 1024 // 80MB (du kannst das runterdrehen)

  const ALLOWED_IMAGE_MIME = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ])

  const ALLOWED_VIDEO_MIME = new Set([
    'video/mp4',
    'video/quicktime', // .mov
    'video/webm',
    'video/ogg',
  ])

  if (resourceType === 'image') {
    if (!file.type?.startsWith('image/')) throw new Error(`Keine Bilddatei: ${file.type || 'unknown'}`)
    if (!ALLOWED_IMAGE_MIME.has(file.type)) throw new Error(`Nicht unterstütztes Bildformat: ${file.type}`)
    if (file.size > IMAGE_MAX) throw new Error(`Bild zu groß (max ${Math.round(IMAGE_MAX / 1024 / 1024)}MB)`)
  } else {
    if (!file.type?.startsWith('video/')) throw new Error(`Keine Videodatei: ${file.type || 'unknown'}`)
    if (!ALLOWED_VIDEO_MIME.has(file.type)) throw new Error(`Nicht unterstütztes Videoformat: ${file.type}`)
    if (file.size > VIDEO_MAX) throw new Error(`Video zu groß (max ${Math.round(VIDEO_MAX / 1024 / 1024)}MB)`)
  }

  // =========================
  // Preprocess nur für Images
  // =========================
  const uploadFile =
    resourceType === 'image'
      ? await preprocessImageForUpload(file, {
        maxDim: 1600,
        quality: 0.82,
        mimeType: 'image/webp',
        skipIfSmallerThanBytes: 300_000,
        keepIfBigger: true,
        ...opts.preprocess,
      })
      : file

  if (log) {
    console.log('[upload] resourceType', resourceType)
    console.log('[upload] original', file.type, file.size, file.name)
    console.log('[upload] prepared', uploadFile.type, uploadFile.size, uploadFile.name)
  }

  // =========================
  // Signed params vom Backend
  // =========================
  const { data: sign } = await api.get<CloudinarySignResponse>(
    `/cloudinary/sign?resourceType=${encodeURIComponent(resourceType)}`
  )

  if (!sign?.cloudName) throw new Error('Missing cloudName from /api/cloudinary/sign')
  if (!sign?.apiKey) throw new Error('Missing apiKey from /api/cloudinary/sign')
  if (!sign?.timestamp) throw new Error('Missing timestamp from /api/cloudinary/sign')
  if (!sign?.signature) throw new Error('Missing signature from /api/cloudinary/sign')
  if (!sign?.folder) throw new Error('Missing folder from /api/cloudinary/sign')
  if (!sign?.publicId) throw new Error('Missing publicId from /api/cloudinary/sign')

  const overwrite = sign.overwrite ?? false
  const rt = (sign.resourceType ?? resourceType) as 'image' | 'video'

  if (log) {
    console.log('[upload] sign', {
      cloudName: sign.cloudName,
      apiKey: sign.apiKey,
      timestamp: sign.timestamp,
      folder: sign.folder,
      publicId: sign.publicId,
      allowedFormats: sign.allowedFormats,
      overwrite,
      resourceType: rt,
    })
  }

  // =========================
  // Direkt zu Cloudinary upload
  // =========================
  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(sign.cloudName)}/${rt}/upload`

  const fd = new FormData()
  fd.append('file', uploadFile)

  fd.append('api_key', sign.apiKey)
  fd.append('timestamp', String(sign.timestamp))
  fd.append('signature', sign.signature)

  fd.append('folder', sign.folder)
  fd.append('public_id', sign.publicId)
  fd.append('overwrite', String(overwrite))

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
    mediaType: mediaTypeFromResourceType(rt),
    duration: typeof data.duration === 'number' ? data.duration : undefined,
  }
}

// =========================
// Delivery helpers
// =========================
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined

function stripExtAny(publicId: string) {
  return publicId.replace(/\.(jpg|jpeg|png|webp|gif|avif|mp4|mov|webm|mkv|m4v)$/i, '')
}

export function cldImageUrl(publicId: string, transform = 'f_auto,q_auto') {
  if (!publicId) return ''
  if (!CLOUD_NAME) return ''
  const pid = stripExtAny(publicId)
  const t = transform ? `${transform}/` : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}${pid}`
}

export function cldVideoUrl(publicId: string, transform = 'f_auto,q_auto,vc_auto') {
  if (!publicId) return ''
  if (!CLOUD_NAME) return ''
  const pid = stripExtAny(publicId)
  const t = transform ? `${transform}/` : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${t}${pid}`
}

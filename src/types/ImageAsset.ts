export type MediaType = 'IMAGE' | 'VIDEO'

export type ImageAsset = {
  id?: number
  publicId: string
  width?: number
  height?: number
  bytes?: number
  format?: string
  secureUrl?: string
  caption?: string
  alt?: string
  order: number
  createdAt?: string

  // ✅ neu
  mediaType?: MediaType
  duration?: number // Sekunden (nur Video)
}

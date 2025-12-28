import type { CategoryId } from './CategoryId'
import type { ImageAsset } from './ImageAsset'

export type CreateMarker = {
  lat: number
  lng: number
  title: string
  description?: string
  category?: CategoryId
  images?: ImageAsset[]
  startDate: string
  endDate?: string
}

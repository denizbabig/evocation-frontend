// src/types/CreateMarker.ts
import type { CategoryId } from './CategoryId'
import type { ImageAsset } from './ImageAsset'

export type CreateMarker = {
  lat: number
  lng: number
  title: string
  description?: string
  category?: CategoryId
  images?: ImageAsset[]
  startDate: string          // required in UI
  endDate?: string           // optional in UI; Backend setzt sonst = startDate
}

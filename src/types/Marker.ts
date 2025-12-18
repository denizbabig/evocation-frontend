// src/types/Marker.ts
import type { ImageAsset } from './ImageAsset'
export type CategoryNumeric = 1 | 2 | 3 | 4
export type Visibility = 'PRIVATE' | 'PUBLIC'

export type NewMarker = {
  title: string
  description?: string | null
  occurredAt: string
  lat: number
  lng: number
  categoryId: CategoryNumeric | null
  images?: ImageAsset[]
  visibility: Visibility
  placeName?: string | null
}

export type Marker = NewMarker & {
  id: number
  categoryId: CategoryNumeric | null | string
}


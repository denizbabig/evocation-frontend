// src/types/Share.ts
import type { Marker, Visibility } from '@/types/Marker'
import type { TripStop } from '@/types/Trip'

export type SharedTrip = {
  id: number
  title: string
  createdAt?: string | null

  stopCount?: number | null

  coverUrl?: string | null
  coverPublicId?: string | null
  coverMarkerId?: number | null

  // ✅ kommt bei dir jetzt mit
  visibility?: Visibility

  // ✅ TripDetailDTO
  stops?: TripStop[]
}

export type SharedMapDTO = {
  trips: SharedTrip[]
  markers: Marker[]
}

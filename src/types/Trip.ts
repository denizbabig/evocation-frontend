// src/types/Trip.ts
import type { Visibility } from '@/types/Marker'

export type Trip = {
  id: number
  title: string
  createdAt?: string
  stopCount?: number

  coverUrl?: string | null
  coverPublicId?: string | null
  coverMarkerId?: number | null

  // ✅ neu
  visibility?: Visibility
}

export type TripStop = {
  markerId: number
  orderIndex: number
}

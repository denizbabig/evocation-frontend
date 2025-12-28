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
  visibility?: Visibility
  stops?: TripStop[]
}

export type SharedMapDTO = {
  trips: SharedTrip[]
  markers: Marker[]
}

export type Trip = {
  id: number
  title: string
  createdAt?: string
  stopCount?: number

  // ✅ neu: cover (optional)
  coverUrl?: string | null
  coverPublicId?: string | null
  coverMarkerId?: number | null
}

export type TripStop = {
  markerId: number
  orderIndex: number
}

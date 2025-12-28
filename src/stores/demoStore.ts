import { defineStore } from 'pinia'
import { ref } from 'vue'

type TripStopDTO = { id?: number; markerId: number; orderIndex: number }

export type DemoTrip = {
  id: number
  title: string
  createdAt?: string
  stopCount?: number
  coverUrl?: string | null
  coverPublicId?: string | null
  coverMarkerId?: number | null
  visibility?: string
  stops: TripStopDTO[]
}

export type DemoMarker = {
  id: number
  lat: number
  lng: number
  title?: string
  description?: string
  startDate?: string
  occurredAt?: string | null
  images?: any[]
  [k: string]: any
}

export const useDemoStore = defineStore('demo', () => {
  const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

  const markers = ref<DemoMarker[]>([])
  const trips = ref<DemoTrip[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  function clear() {
    markers.value = []
    trips.value = []
    error.value = null
    isLoading.value = false
  }

  async function loadDemo() {
    error.value = null
    isLoading.value = true

    try {
      const [mRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/demo/markers`, {
          method: 'GET',
          credentials: 'omit',
          headers: { Accept: 'application/json' },
        }),
        fetch(`${API_BASE}/demo/trips`, {
          method: 'GET',
          credentials: 'omit',
          headers: { Accept: 'application/json' },
        }),
      ])

      if (!mRes.ok) {
        const text = await mRes.text().catch(() => '')
        throw new Error(`Demo Marker laden fehlgeschlagen (${mRes.status}). ${text}`)
      }
      if (!tRes.ok) {
        const text = await tRes.text().catch(() => '')
        throw new Error(`Demo Trips laden fehlgeschlagen (${tRes.status}). ${text}`)
      }

      const mData = await mRes.json()
      const tData = await tRes.json()

      markers.value = Array.isArray(mData)
        ? mData.map((m: any) => ({
          ...m,
          occurredAt: m.startDate ?? m.occurredAt ?? null,
          images: Array.isArray(m.images) ? m.images : [],
        }))
        : []

      trips.value = Array.isArray(tData) ? tData : []
    } finally {
      isLoading.value = false
    }
  }

  return { markers, trips, isLoading, error, loadDemo, clear }
})

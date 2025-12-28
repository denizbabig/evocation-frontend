// src/stores/ShareStore.ts
import { defineStore } from 'pinia'
import type { Marker, CategoryNumeric } from '@/types/Marker'
import type { SharedMapDTO, SharedTrip } from '@/types/Share'
import { fetchSharedMapPublic, PublicHttpError } from '@/lib/shareApi'

const CategoryMapEnumToNum: Record<string, CategoryNumeric> = {
  TRAVEL: 1,
  FOOD: 2,
  SIGHTSEEING: 3,
  SHOPPING: 4,
}

function normalizeSharedMarker(m: any): Marker {
  const catStr: string | null = m?.category ?? null
  const catNum = catStr ? (CategoryMapEnumToNum[catStr] ?? null) : null

  const images =
    m?.images ??
    m?.imageAssets ??
    m?.markerImages ??
    m?.marker_images ??
    []

  return {
    id: Number(m.id),
    title: m.title ?? '',
    description: m.description ?? null,
    occurredAt: m.startDate ?? m.occurredAt ?? new Date().toISOString().slice(0, 10),
    lat: Number(m.lat),
    lng: Number(m.lng),
    categoryId: (catNum as any) ?? (m?.categoryId ?? null),
    images: Array.isArray(images) ? images : [],
    visibility: (m.visibility ?? 'PUBLIC') as any,
    placeName: m.placeName ?? null,
  } as any
}

function normalizeSharedTrip(t: any): SharedTrip {
  return {
    id: Number(t?.id),
    title: t?.title ?? '',
    createdAt: t?.createdAt ?? null,

    stopCount: t?.stopCount ?? null,

    coverUrl: t?.coverUrl ?? null,
    coverPublicId: t?.coverPublicId ?? null,
    coverMarkerId: t?.coverMarkerId ?? null,

    visibility: t?.visibility ?? 'PUBLIC',

    stops: Array.isArray(t?.stops)
      ? t.stops.map((s: any) => ({
        markerId: Number(s.markerId),
        orderIndex: Number(s.orderIndex ?? 0),
      }))
      : [],
  }
}

export const useShareStore = defineStore('share', {
  state: () => ({
    code: null as string | null,

    markers: [] as Marker[],
    trips: [] as SharedTrip[],

    isLoading: false,
    error: null as string | null,
    lastLoadedAt: null as number | null,
  }),

  getters: {
    hasData(state) {
      return state.markers.length > 0 || state.trips.length > 0
    },
  },

  actions: {
    clear() {
      this.code = null
      this.markers = []
      this.trips = []
      this.error = null
      this.isLoading = false
      this.lastLoadedAt = null
    },

    async loadShared(code: string) {
      const c = String(code ?? '').trim()
      if (!c) {
        this.error = 'Kein Share-Code vorhanden.'
        this.markers = []
        this.trips = []
        return
      }

      this.code = c
      this.isLoading = true
      this.error = null

      try {
        const data = await fetchSharedMapPublic(c)

        const rawTrips = Array.isArray((data as any)?.trips) ? (data as any).trips : []
        const rawMarkers = Array.isArray((data as any)?.markers) ? (data as any).markers : []

        this.trips = rawTrips.map(normalizeSharedTrip)
        this.markers = rawMarkers.map(normalizeSharedMarker)

        this.lastLoadedAt = Date.now()
      } catch (e: any) {
        console.error('[ShareStore] loadShared failed:', e)

        if (e instanceof PublicHttpError) {
          if (e.status === 404) {
            this.error = 'Dieser Share-Link existiert nicht (mehr) oder wurde revoked.'
          } else {
            this.error = `Fehler beim Laden (${e.status}). ${e.body ?? ''}`.trim()
          }
        } else {
          this.error = e?.message ?? 'Netzwerkfehler beim Laden der Shared Map.'
        }

        this.trips = []
        this.markers = []
        throw e
      } finally {
        this.isLoading = false
      }
    },
  },
})

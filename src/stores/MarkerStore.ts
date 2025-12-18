// src/stores/MarkerStore.ts
import { defineStore } from 'pinia'
import type { Marker, NewMarker, CategoryNumeric } from '@/types/Marker'
import { apiFetch } from '@/lib/api'

const CategoryMapNumToEnum: Record<CategoryNumeric, string> = {
  1: 'TRAVEL',
  2: 'FOOD',
  3: 'SIGHTSEEING',
  4: 'SHOPPING',
}

const CategoryMapEnumToNum: Record<string, CategoryNumeric> = {
  TRAVEL: 1,
  FOOD: 2,
  SIGHTSEEING: 3,
  SHOPPING: 4,
}

function normalizeIncoming(m: any): Marker {
  const catStr: string | null = m?.category ?? null
  const catNum = catStr ? (CategoryMapEnumToNum[catStr] ?? null) : null

  // ✅ robust: nimm alle üblichen keys mit
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
    categoryId: (catNum as any) ?? null,
    images,
    visibility: (m.visibility ?? 'PRIVATE') as any,
    placeName: m.placeName ?? null,
  } as any
}

function serializeForApi(payload: NewMarker) {
  const startDate = payload.occurredAt
  const endDate = payload.occurredAt

  const category =
    payload.categoryId == null ? null : CategoryMapNumToEnum[payload.categoryId]

    return {
    title: payload.title,
    description: payload.description ?? null,
    lat: payload.lat,
    lng: payload.lng,
    startDate,
    endDate,
    category,
    images: (payload as any).images ?? [],
    placeName: (payload as any).placeName ?? null,

    // ✅ NEU (passt zu CreateMarkerDTO)
    visibility: (payload as any).visibility ?? 'PRIVATE',
  }
}

export const useMarkerStore = defineStore('marker', {
  state: () => ({
    markers: [] as Marker[],
    isLoading: false,
    isSaving: false,
    error: null as string | null,
    selectedId: null as number | null,

    // Filter/Pagination – optional
    filters: {
      query: '',
      categoryId: null as CategoryNumeric | null,
    },
    cursor: null as string | null,
    hasMore: true,
    lastLoadedAt: null as number | null,

    // Draft im Modal
    draft: null as (NewMarker & { lat: number; lng: number }) | null,
  }),

  getters: {
    selected(state) {
      return state.markers.find((m) => m.id === state.selectedId) ?? null
    },
  },

  actions: {
    setSelected(id: number | null) {
      this.selectedId = id
    },

    startDraftFromMap(lat: number, lng: number) {
      this.draft = {
        title: '',
        description: null,
        occurredAt: new Date().toISOString().slice(0, 10),
        lat,
        lng,
        categoryId: null,
        images: [],
        visibility: 'PRIVATE',
      } as any
    },

    clearDraft() {
      this.draft = null
    },

    async loadMarkers() {
      this.isLoading = true
      this.error = null

      try {
        const data = await apiFetch('/markers') // <-- Bearer kommt automatisch mit
        this.markers = Array.isArray(data) ? data.map(normalizeIncoming) : []
        this.lastLoadedAt = Date.now()
      } catch (e: any) {
        console.error('[loadMarkers] failed:', e)
        this.error = e?.message ?? 'Fehler beim Laden der Marker'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async refresh() {
      return this.loadMarkers()
    },

    async addMarker(payload: NewMarker) {
      this.isSaving = true
      this.error = null

      try {
        const body = serializeForApi(payload)

        const createdRaw = await apiFetch('/markers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        const created = normalizeIncoming(createdRaw)
        this.markers.push(created)
        this.lastLoadedAt = Date.now()
        return created
      } catch (e: any) {
        console.error('[addMarker] failed:', e)
        this.error = e?.message ?? 'Speichern fehlgeschlagen'
        throw e
      } finally {
        this.isSaving = false
      }
    },

    async deleteMarker(id: number) {
      this.error = null
      try {
        await apiFetch(`/markers/${id}`, { method: 'DELETE' })
        this.markers = this.markers.filter(m => Number(m.id) !== Number(id))
        if (this.selectedId === id) this.selectedId = null
      } catch (e: any) {
        console.error('[deleteMarker] failed:', e)
        this.error = e?.message ?? 'Löschen fehlgeschlagen'
        throw e
      }
    },

    async setMarkerVisibility(id: number, visibility: 'PRIVATE' | 'PUBLIC') {
  this.error = null
  try {
    const updatedRaw = await apiFetch(`/markers/${id}/visibility`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visibility }),
    })

    const updated = normalizeIncoming(updatedRaw)

    // marker in state ersetzen
    const idx = this.markers.findIndex(m => m.id === id)
    if (idx !== -1) this.markers[idx] = updated

    return updated
  } catch (e: any) {
    console.error('[setMarkerVisibility] failed:', e)
    this.error = e?.message ?? 'Visibility ändern fehlgeschlagen'
    throw e
  }
}
  },


})




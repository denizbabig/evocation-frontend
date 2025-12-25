import { defineStore } from 'pinia'
import { apiFetch } from '@/lib/api'
import type { Trip, TripStop } from '@/types/Trip'

type CreateTripPayload = {
  title: string
  coverUrl?: string | null
  coverPublicId?: string | null
  coverMarkerId?: number | null
}

type UpdateTripPayload = Partial<CreateTripPayload>

export const useTripStore = defineStore('trip', {
  state: () => ({
    trips: [] as Trip[],
    activeTripId: null as number | null,
    stops: [] as TripStop[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    activeTrip(state) {
      return state.trips.find(t => t.id === state.activeTripId) ?? null
    },
    activeStopsSorted(state) {
      return [...state.stops].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    },

  },


  actions: {
    async loadTrips() {
      this.isLoading = true
      this.error = null
      try {
        this.trips = await apiFetch('/trips')

        const last = localStorage.getItem('activeTripId')
        const lastId = last ? Number(last) : null

        if (lastId && this.trips.some(t => t.id === lastId)) {
          this.activeTripId = lastId
        } else if (this.trips.length) {
          this.activeTripId = this.trips[0].id
          localStorage.setItem('activeTripId', String(this.activeTripId))
        } else {
          this.activeTripId = null
          localStorage.removeItem('activeTripId')
          this.stops = []
          return
        }

        await this.loadStops(this.activeTripId)
      } finally {
        this.isLoading = false
      }
    },

    // ✅ backward compatible: createTrip("China") funktioniert weiterhin
    async createTrip(titleOrPayload: string | CreateTripPayload) {
      this.error = null
      try {
        const payload: CreateTripPayload =
          typeof titleOrPayload === 'string'
            ? { title: titleOrPayload }
            : titleOrPayload

        const t = await apiFetch('/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        this.trips.unshift(t)
        await this.selectTrip(t.id)
        return t
      } catch (e: any) {
        this.error = e?.message ?? 'Failed to create trip'
        throw e
      }
    },

    syncStopCount(tripId: number, count: number) {
      const idx = this.trips.findIndex(t => Number(t.id) === Number(tripId))
      if (idx !== -1) {
        // falls Trip typisiert ist ohne stopCount: (this.trips[idx] as any).stopCount = count
        this.trips[idx] = { ...(this.trips[idx] as any), stopCount: count }
      }
    },

    // ✅ braucht Backend: PATCH /api/trips/{id}
    async updateTrip(id: number, patch: UpdateTripPayload) {
      this.error = null
      try {
        const updated = await apiFetch(`/trips/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        })

        const idx = this.trips.findIndex(t => Number(t.id) === Number(id))
        if (idx !== -1) this.trips[idx] = updated
        return updated
      } catch (e: any) {
        this.error = e?.message ?? 'Failed to update trip'
        throw e
      }
    },

    // ✅ braucht Backend: DELETE /api/trips/{id}
    async deleteTrip(id: number) {
      this.error = null
      try {
        await apiFetch(`/trips/${id}`, { method: 'DELETE' })
        this.trips = this.trips.filter(t => Number(t.id) !== Number(id))

        if (this.activeTripId === id) {
          this.activeTripId = this.trips.length ? this.trips[0].id : null
          if (this.activeTripId) {
            localStorage.setItem('activeTripId', String(this.activeTripId))
            await this.loadStops(this.activeTripId)
          } else {
            localStorage.removeItem('activeTripId')
            this.stops = []
          }
        }
      } catch (e: any) {
        this.error = e?.message ?? 'Failed to delete trip'
        throw e
      }
    },

    async selectTrip(id: number | null) {
      this.activeTripId = id

      if (id == null) {
        localStorage.removeItem('activeTripId')
        this.stops = []
        return
      }

      localStorage.setItem('activeTripId', String(id))
      await this.loadStops(id)
    },

    async loadStops(tripId: number) {
      this.error = null
      const stops = await apiFetch(`/trips/${tripId}/stops`)
      this.stops = stops ?? []
      this.syncStopCount(tripId, this.stops.length)
    },

    async addStop(markerId: number) {
      if (!this.activeTripId) return
      if (this.stops.some(s => s.markerId === markerId)) return

      const s = await apiFetch(`/trips/${this.activeTripId}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markerId }),
      })

      this.stops.push(s)
      this.syncStopCount(this.activeTripId, this.stops.length)
    },

    async removeStop(markerId: number) {
      if (!this.activeTripId) return

      await apiFetch(`/trips/${this.activeTripId}/stops?markerId=${markerId}`, { method: 'DELETE' })
      this.stops = this.stops.filter(s => s.markerId !== markerId)
      this.syncStopCount(this.activeTripId, this.stops.length)
    },

    async reorder(markerIdsInOrder: number[]) {
      if (!this.activeTripId) return
      await apiFetch(`/trips/${this.activeTripId}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(markerIdsInOrder),
      })
      await this.loadStops(this.activeTripId)
    },
  },
})

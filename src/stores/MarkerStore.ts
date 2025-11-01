// src/stores/MarkerStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Marker } from '../types/Marker'

export const useMarkerStore = defineStore('marker', {
  state: () => ({
    markers: [] as Marker[],
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async loadMarkers() {
      this.isLoading = true
      this.error = null
      try {
        const res = await axios.get<Marker[]>('https://evocation.onrender.com/api/marker')
        this.markers = res.data
      } catch (err: any) {
        this.error = 'Fehler beim Laden der Marker'
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async addMarker(newMarker: Omit<Marker, 'id'>) {
      try {
        const res = await axios.post<Marker>('https://evocation.onrender.com/api/marker', newMarker)
        this.markers.push(res.data)
      } catch (err: any) {
        this.error = 'Fehler beim Speichern '
        console.error(err)
      }
    },

    async deleteMarker(id: number) {
      try {
        await axios.delete(`https://evocation.onrender.com/api/marker/${id}`)
        this.markers = this.markers.filter(m => m.id !== id)
      } catch (err: any) {
        this.error = 'Fehler beim Löschen '
        console.error(err)
      }
    }
  }
})

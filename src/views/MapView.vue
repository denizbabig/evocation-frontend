<template>
  <div class="relative w-full flex flex-col bg-[#0e162c] text-white font-sans overflow-hidden min-h-[100dvh]">
    <!-- hintergrund -->
    <div class="fixed inset-0 z-0">
      <div class="fixed inset-0 z-0 pointer-events-none">
      <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
      :style="{ backgroundImage: `url(${gemini2})` }"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
  </div>
      <MapLoad
        ref="mapRef"
        :markers="markers"
        :cluster="true"
        @map-click="onMapClick"
        @marker-click="onMarkerClick"
        class="h-full w-full scale-110 brightness-[0.9] z-900"
      />
      <div class="fixed inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#0e162c_100%)]"></div>
    </div>

    <!-- Grid -->
    <div
      class="pointer-events-none fixed inset-0 z-10 opacity-40 mix-blend-screen"
      style="background-image: linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px); background-size: 80px 80px;"
    />

    <!-- nav links -->
    <nav class="absolute top-0 left-0 w-full z-40 flex items-center justify-start p-6 md:px-12">
      <div class="flex items-center gap-6">
        <button
          @click="isSidebarOpen = true"
          class="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition duration-200"
          aria-label="Menü öffnen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
        </button>

        <div class="flex items-center gap-2 select-none cursor-pointer" @click="goHome">
          <span class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Evocation
          </span>
        </div>
      </div>
    </nav>

    <!-- suchleiste -->
    <GeoSearchBox
      v-model="searchQuery"
      class="absolute z-40 top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6"
      placeholder="Ort suchen"
      @select="onSuggestSelect"
      @search="onSearchResults"
    />

    <!-- map functions -->
    <div class="absolute z-40 top-56 md:top-56 right-6 md:right-10 flex flex-col gap-3">
      <button
        @click="onZoomIn"
        class="h-11 w-11 rounded-xl bg-[#1a233e]/70 border border-white/10 hover:border-fuchsia-500/50 hover:bg-[#1a233e] transition shadow-md flex items-center justify-center"
      >
        <span class="sr-only">Zoom in</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
      </button>

      <button
        @click="onZoomOut"
        class="h-11 w-11 rounded-xl bg-[#1a233e]/70 border border-white/10 hover:border-fuchsia-500/50 hover:bg-[#1a233e] transition shadow-md flex items-center justify-center"
      >
        <span class="sr-only">Zoom out</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"/>
        </svg>
      </button>

      <button
        @click="onLocate"
        class="h-11 w-11 rounded-xl bg-[#1a233e]/70 border border-white/10 hover:border-fuchsia-500/50 hover:bg-[#1a233e] transition shadow-md flex items-center justify-center"
      >
        <span class="sr-only">Mein Standort</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21M3 12h2.25m13.5 0H21M7.5 7.5 6 6m10.5 10.5L18 18M7.5 16.5 6 18m10.5-9L18 6M9.75 12a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Z"/>
        </svg>
      </button>

      <button
        @click="onReset"
        class="h-11 w-11 rounded-xl bg-[#1a233e]/70 border border-white/10 hover:border-fuchsia-500/50 hover:bg-[#1a233e] transition shadow-md flex items-center justify-center"
      >
        <span class="sr-only">Reset</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5v6h6M19.5 19.5v-6h-6M19.5 10.5A7.5 7.5 0 0 0 9 4.97M4.5 13.5A7.5 7.5 0 0 0 15 19.03"/>
        </svg>
      </button>
    </div>

    <!-- sidebar load -->
    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- create modal-->
    <MarkerMapModal
      :open="!!draft"
      :saving="isSaving"
      :categories="categoryOptions"
      :default-lat="draft?.lat ?? 52.520008"
      :default-lng="draft?.lng ?? 13.404954"
      @close="closeDraft"
      @submit="saveMarker"
    />

    <!-- detail modal -->
    <MarkerStoryModal
      :open="detailOpen"
      :marker="activeDetail"
      :readonly="false"
      @close="detailOpen = false"
      @open-on-map="handleOpenOnMap"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <MarkerEditModal
      :open="editOpen"
      :marker="activeMarker"
      :saving="editSaving"
      @close="editOpen = false"
      @submit="onEditSubmit"
    />

    <!-- credits :) -->
    <div class="fixed bottom-4 right-4 z-40">
      <div class="pointer-events-auto rounded-lg bg-[#0b1228]/80 border border-white/12 px-3 py-1.5 text-[11px] text-gray-300 shadow-lg shadow-black/30">
        Geocoding:
        <a
          href="https://nominatim.openstreetmap.org"
          target="_blank"
          rel="noopener"
          class="underline decoration-fuchsia-300/60 hover:decoration-fuchsia-300"
        >Nominatim</a>
        (Search) ·
        <a
          href="https://photon.komoot.io/"
          target="_blank"
          rel="noopener"
          class="underline decoration-fuchsia-300/60 hover:decoration-fuchsia-300"
        >Photon</a>
        (Autocomplete) — © OpenStreetMap contributors
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import MapLoad from '@/components/MapLoad.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import GeoSearchBox from '@/components/GeoSearchBox.vue'
import MarkerMapModal from '@/components/MarkerMapModal.vue'
import MarkerDetailModal from '@/components/MarkerDetailModal.vue'
import gemini2 from '@/assets/gemini2.png'

import { useMarkerStore } from '@/stores/MarkerStore'
import type { NewMarker, Marker as MarkerType } from '@/types/Marker'
import { apiFetch } from '@/lib/api'
import { reversePlaceName } from '@/lib/reverseGeocode'
import MarkerStoryModal from "@/components/MarkerStoryModal.vue";
import {updateMarkerMultipart} from "@/lib/markerApi.ts";
import MarkerEditModal from "@/components/MarkerEditModal.vue"

defineOptions({ name: 'MapViewPage' })

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

const router = useRouter()
const route = useRoute()

const markerStore = useMarkerStore()
const { markers, isSaving, draft } = storeToRefs(markerStore)


const detailId = ref<string | number | null>(null)

const activeDetail = computed(() => {
  if (detailId.value == null) return null
  return markers.value.find(m => String(m.id) === String(detailId.value)) ?? null
})

const isSidebarOpen = ref(false)
const searchQuery = ref('')
const detailOpen = ref(false)


const mapRef = ref<InstanceType<typeof MapLoad> | null>(null)


const categoryOptions = [
  { id: 1, label: 'Reise' },
  { id: 2, label: 'Essen' },
  { id: 3, label: 'Sightseeing' },
  { id: 4, label: 'Shopping' },
]


onMounted(async () => {
  await markerStore.loadMarkers().catch(console.error)

  const center = route.query.center as string | undefined
  const zStr = route.query.z as string | undefined
  if (center) {
    const [latStr, lonStr] = center.split(',')
    const lat = Number(latStr)
    const lon = Number(lonStr)
    const z = zStr ? Number(zStr) : 10
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      mapRef.value?.flyTo(lat, lon, z)
    }
  }
})


function goHome() {
  router.push('/')
}


function onMapClick({ lat, lng }: { lat: number; lng: number }) {
  markerStore.startDraftFromMap(lat, lng)
}

function onMarkerClick({ id }: { id: number }) {
  detailId.value = id
  markerStore.setSelected(id) // optional, kannst du drin lassen
  detailOpen.value = true
}


const onZoomIn = () => mapRef.value?.zoomIn()
const onZoomOut = () => mapRef.value?.zoomOut()
const onReset = () => mapRef.value?.resetView?.()

const onLocate = () => {
  if (!navigator.geolocation) return console.warn('Geolocation not supported')
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => mapRef.value?.flyTo(coords.latitude, coords.longitude, 13),
    (err) => console.warn('Geolocation error:', err),
    { enableHighAccuracy: true, timeout: 8000 }
  )
}


function closeDraft() {
  markerStore.clearDraft()
}


function handleOpenOnMap(id: number) {
  const m = markers.value.find((x: any) => x.id === id)
  if (m) mapRef.value?.flyTo(m.lat, m.lng, 13)
}

const editOpen = ref(false)
const editId = ref<number | null>(null)

const activeMarker = computed(() => {
  if (editId.value == null) return null
  return markers.value.find(m => Number(m.id) === Number(editId.value)) ?? null
})

function handleEdit(id: number) {
  detailOpen.value = false
  editId.value = id
  editOpen.value = true
}

async function handleDelete(id: number) {
  try {
    await markerStore.deleteMarker(id)   // ✅ einheitlicher Weg
    detailOpen.value = false
    detailId.value = null
  } catch (e) {
    console.error('Delete failed', e)
  }
}


function onSuggestSelect(s: { lat: number; lon: number; display_name: string }) {
  mapRef.value?.flyTo(s.lat, s.lon, 10)
}

function onSearchResults(payload: { query: string; results: Array<any>; best?: { lat: string; lon: string } }) {
  const best = payload?.best
  if (best) {
    mapRef.value?.flyTo(Number(best.lat), Number(best.lon), 10)
  }
}


function parseLatLng(s?: string): { lat: number; lng: number } | null {
  if (!s) return null
  const [a, b] = String(s).split(',')
  const lat = Number(a)
  const lng = Number(b)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

async function applyMapQuery() {
  // ✅ akzeptiert beide Varianten:
  const gotoStr = (route.query.goto as string | undefined) ?? (route.query.center as string | undefined)
  const zoomStr = (route.query.zoom as string | undefined) ?? (route.query.z as string | undefined)
  const z = zoomStr ? Number(zoomStr) : 12

  const pos = parseLatLng(gotoStr)
  if (!pos) return

  // warten bis MapLoad ref wirklich da ist
  await nextTick()
  mapRef.value?.flyTo(pos.lat, pos.lng, Number.isFinite(z) ? z : 12)

  // optional: wenn new=1, direkt Draft öffnen

}

onMounted(async () => {
  await markerStore.loadMarkers().catch(console.error)
  await applyMapQuery()
})

// wenn du später erneut mit query param navigierst ohne reload:
watch(
  () => [route.query.goto, route.query.center, route.query.zoom, route.query.z, route.query.new],
  () => applyMapQuery(),
  { immediate: false }
)

const savingVisibility = ref(false)

async function onSetVisibility({ id, visibility }: { id: number; visibility: 'PRIVATE'|'PUBLIC' }) {
  savingVisibility.value = true
  try {
    await apiFetch(`/markers/${id}/visibility`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visibility }),
    })
    await markerStore.loadMarkers() // oder marker lokal updaten
  } finally {
    savingVisibility.value = false
  }
}

async function saveMarker(payload: NewMarker) {
  try {
    const withPlace: NewMarker = { ...payload }

    // ✅ nur 1x reverse, nur wenn placeName fehlt
    if (!withPlace.placeName || !withPlace.placeName.trim()) {
      withPlace.placeName = await reversePlaceName(withPlace.lat, withPlace.lng)
    }

    const created = await markerStore.addMarker(withPlace)
    await markerStore.loadMarkers()

    mapRef.value?.flyTo(created.lat, created.lng, 13)
    detailId.value = created.id
    detailOpen.value = true
    closeDraft()
  } catch (e) {
    console.error(e)
  }
}

const editSaving = ref(false)

async function onEditSubmit({ payload, files }: { payload: any; files: File[] }) {
  if (!activeMarker.value?.id) return
  editSaving.value = true
  try {
    await updateMarkerMultipart(activeMarker.value.id, payload, files)
    await markerStore.loadMarkers()

    // flyTo nur hier ✅
    mapRef.value?.flyTo(payload.lat, payload.lng, 13)

    editOpen.value = false
    editId.value = null
  } finally {
    editSaving.value = false
  }
}

async function refreshMarkers() {
  await markerStore.loadMarkers()
}


</script>

<style scoped>

</style>

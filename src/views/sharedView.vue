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
        @marker-click="onMarkerClick"
        class="z-100 h-full w-full scale-110 brightness-[0.9]"
      />
      <div class="fixed inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#0e162c_100%)]"></div>
    </div>

    <!-- Grid -->
    <div
      class="pointer-events-none fixed inset-0 z-10 opacity-40 mix-blend-screen"
      style="background-image: linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px); background-size: 80px 80px;"
    />
<LoadingOverlay
  :open="loading"
  title="Shared Map"
  subtitle="Öffentliche Marker werden geladen…"
/>
    <!-- nav -->
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

        <span
          class="hidden md:inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200"
        >
          Shared Map
        </span>
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

    <!-- sidebar -->
    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Readonly error overlay -->
    <div v-if="error" class="absolute inset-0 z-50 flex items-center justify-center p-6">
      <div class="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1228]/80 p-6 backdrop-blur-xl shadow-2xl">
        <h2 class="text-xl font-bold mb-2">Shared Map</h2>
        <p class="text-gray-300">{{ error }}</p>
        <div class="mt-5 flex gap-3 justify-end">
          <button
            class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            @click="goHome"
          >
            Zur Homepage
          </button>
          <button
            class="rounded-full border border-fuchsia-400/20 bg-fuchsia-900/20 px-4 py-2 text-sm hover:bg-fuchsia-900/30 transition"
            @click="loadSharedMarkers"
          >
            Neu laden
          </button>
        </div>
      </div>
    </div>

    <!-- detail modal (read-only: wir binden KEIN edit/delete) -->
    <MarkerDetailModal
  :open="detailOpen"
  :marker="selected"
  :readonly="true"
  @close="detailOpen = false"
  @open-on-map="handleOpenOnMap"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MapLoad from '@/components/MapLoad.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import GeoSearchBox from '@/components/GeoSearchBox.vue'
import MarkerDetailModal from '@/components/MarkerDetailModal.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import gemini2 from '@/assets/gemini2.png'

defineOptions({ name: 'SharedViewPage' })

type MarkerType = {
  id: number
  lat: number
  lng: number
  title?: string
  description?: string
  categoryId?: number | string
  color?: string
  // falls du mehr Felder hast: images/urls/etc. sind okay
  [k: string]: any
}

const router = useRouter()
const route = useRoute()

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api'

const isSidebarOpen = ref(false)
const searchQuery = ref('')

const mapRef = ref<InstanceType<typeof MapLoad> | null>(null)

const markers = ref<MarkerType[]>([])
const selectedId = ref<number | null>(null)
const detailOpen = ref(false)

const error = ref<string | null>(null)
const loading = ref(false)
const selected = computed<MarkerType | null>(() => {
  if (selectedId.value == null) return null
  return markers.value.find(m => m.id === selectedId.value) ?? null
})

function goHome() {
  router.push('/')
}

async function loadSharedMarkers() {
  error.value = null
  loading.value = true

  const code = String(route.params.code || '').trim()
  if (!code) {
    error.value = 'Kein Share-Code in der URL gefunden.'
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${API_BASE}/share/${encodeURIComponent(code)}/markers`, {
      method: 'GET',
      credentials: 'omit',
      headers: { 'Accept': 'application/json' },
    })

    if (res.status === 404) {
      error.value = 'Dieser Share-Link existiert nicht (mehr) oder wurde revoked.'
      markers.value = []
      return
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      error.value = `Fehler beim Laden (${res.status}). ${text}`
      markers.value = []
      return
    }

    const data = await res.json()
    markers.value = Array.isArray(data)
  ? data.map((m: any) => ({
      ...m,
      // wichtig fürs MarkerDetailModal dateText:
      occurredAt: m.startDate ?? m.occurredAt ?? null,
      // images einfach durchreichen (Modal normalisiert)
      images: Array.isArray(m.images) ? m.images : [],
    }))
  : []

    if (markers.value.length > 0) {
      const first = markers.value[0]
      mapRef.value?.flyTo(first.lat, first.lng, 4.5)
    }
  } catch (e) {
    console.error(e)
    error.value = 'Netzwerkfehler beim Laden der Shared Marker.'
    markers.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadSharedMarkers()

  // optional: center & zoom über query wie bei MapView
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

watch(() => route.params.code, () => {
  loadSharedMarkers()
})

watch(() => route.query.goto, () => applyGotoFromQuery())
watch(() => route.query.focus, () => applyFocusFromQuery())


// marker click -> nur details anzeigen
function onMarkerClick({ id }: { id: number }) {
  selectedId.value = id
  detailOpen.value = true
}

// map controls
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

function handleOpenOnMap(id: number) {
  const m = markers.value.find(x => x.id === id)
  if (m) mapRef.value?.flyTo(m.lat, m.lng, 13)
}

// search
function onSuggestSelect(s: { lat: number; lon: number; display_name: string }) {
  mapRef.value?.flyTo(s.lat, s.lon, 10)
}

function onSearchResults(payload: { query: string; results: Array<any>; best?: { lat: string; lon: string } }) {
  const best = payload?.best
  if (best) mapRef.value?.flyTo(Number(best.lat), Number(best.lon), 10)
}

function applyGotoFromQuery() {
  const goto = route.query.goto as string | undefined
  const zoomStr = route.query.zoom as string | undefined

  if (!goto) return

  const [latStr, lngStr] = goto.split(',')
  const lat = Number(latStr)
  const lng = Number(lngStr)
  const zoom = zoomStr ? Number(zoomStr) : 10

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    mapRef.value?.flyTo(lat, lng, Number.isFinite(zoom) ? zoom : 10)
  }
}

function applyFocusFromQuery() {
  const focusStr = route.query.focus as string | undefined
  const id = focusStr ? Number(focusStr) : NaN
  if (!Number.isFinite(id)) return

  const m = markers.value.find(x => x.id === id)
  if (m) mapRef.value?.flyTo(m.lat, m.lng, 13)
}

</script>

<style scoped>
</style>

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
        :markers="displayMarkers"
        :routes="displayRoutes"
        :cluster="clusterOn"
        @map-move="onMapMove"
        @map-click="onMapClick"
        @marker-click="onMarkerClick"
        class="z-100 h-full w-full brightness-[0.9]"
      />
      <div class="fixed inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#0e162c_100%)]"></div>
    </div>

    <!-- Grid -->
    <div
      class="pointer-events-none fixed inset-0 z-10 opacity-40 mix-blend-screen"
      style="background-image: linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px); background-size: 80px 80px;"
    />

    <LoadingOverlay
      :open="isLoading"
      title="Shared Map"
      subtitle="Öffentliche Trips & Marker werden geladen…"
    />

    <!-- nav (links oben nur: hamburger + brand + badge) -->
    <nav class="absolute top-0 left-0 w-full z-40 flex items-center justify-start p-6 md:px-12">
      <div class="flex items-center gap-4 md:gap-6">
        <button
          @click="isSidebarOpen = true"
          class="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition duration-200"
          aria-label="Menü öffnen"
        >
          <Bars3Icon class="w-8 h-8" />
        </button>

        <div class="flex items-center gap-2 select-none cursor-pointer" @click="goHome">
          <span class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Evocation
          </span>
        </div>

        <span class="hidden md:inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
          Shared Map
        </span>
      </div>
    </nav>

    <!-- Search + active trip pill (zentriert, wie MapView) -->
    <div class="absolute z-40 top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
      <div class="flex flex-col items-center gap-3">
        <GeoSearchBox
          v-model="searchQuery"
          class="w-full"
          placeholder="Ort suchen"
          @select="onSuggestSelect"
          @search="onSearchResults"
        />

        <!-- active trip pill -->
        <div class="w-full flex justify-center">
          <div
            class="inline-flex items-center justify-center gap-2 rounded-2xl
                   bg-[#111a33]/75 border border-white/18 backdrop-blur-xl
                   px-4 py-2 text-sm text-white/80 shadow-lg shadow-black/25"
          >
            <span class="text-base">🧳</span>
            <span class="text-white/55">Aktiver Trip:</span>
            <span
              class="font-semibold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent max-w-[70vw] truncate"
            >
              {{ activeTripLabel }}
            </span>

            <span
              v-if="selectedTripId != null"
              class="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70"
            >
              Filter aktiv
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Right control stack (TripSwitcher + buttons) -->
    <div class="absolute z-50 top-44 right-6 md:right-10 flex flex-col gap-3">
      <!-- Trip switcher as same-size button (read-only) -->
      <div class="evoc-ring">
        <TripSwitcher
          compact
          :trips="trips"
          :selected-id="selectedTripId"
          :allowCreate="false"
          @select="onSelectTrip"
          @create="noop"
        />
      </div>

      <div class="evoc-ring">
        <button @click="onZoomIn" class="evoc-btn" title="Zoom in" aria-label="Zoom in">
          <MagnifyingGlassPlusIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="evoc-ring">
        <button @click="onZoomOut" class="evoc-btn" title="Zoom out" aria-label="Zoom out">
          <MagnifyingGlassMinusIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="evoc-ring">
        <button @click="onLocate" class="evoc-btn" title="Mein Standort" aria-label="Mein Standort">
          <MapPinIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="evoc-ring">
        <button @click="onReset" class="evoc-btn" title="Reset" aria-label="Reset">
          <ArrowPathIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="evoc-ring">
        <button
          @click="clusterOn = !clusterOn"
          class="evoc-btn"
          :title="clusterOn ? 'Clustering deaktivieren' : 'Clustering aktivieren'"
          :aria-label="clusterOn ? 'Clustering deaktivieren' : 'Clustering aktivieren'"
        >
          <span class="text-[18px] leading-none">
            {{ clusterOn ? '🧩' : '📍' }}
          </span>
        </button>
      </div>
    </div>

    <!-- sidebar -->
    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- error overlay -->
    <div v-if="error" class="absolute inset-0 z-50 flex items-center justify-center p-6">
      <div class="relative w-full max-w-lg isolate">
        <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-60">
          <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[14px]" />
          <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]/70" />
        </div>

        <div class="relative rounded-3xl border border-white/10 bg-[#0b1228]/85 backdrop-blur-xl shadow-2xl shadow-purple-900/40 overflow-hidden">
          <div class="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 grid place-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-fuchsia-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86 2.82 17a2 2 0 0 0 1.71 3h14.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                </svg>
              </div>

              <div>
                <h2 class="text-lg font-bold tracking-tight">
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Shared Map
                  </span>
                </h2>
                <div class="text-xs text-white/45">Zugriff nicht möglich</div>
              </div>
            </div>

            <button
              class="rounded-xl p-2 text-white/60 hover:text-white hover:bg-white/5 transition"
              @click="goHome"
              aria-label="Schließen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="px-6 py-6 space-y-4">
            <p class="text-sm text-gray-300 leading-relaxed">
              {{ error }}
            </p>

            <div
              v-if="String(error).toLowerCase().includes('revoked')"
              class="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div class="pointer-events-none absolute -inset-6 opacity-30">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(240,171,252,0.35),_transparent_55%)]" />
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.25),_transparent_55%)]" />
              </div>

              <div class="relative flex gap-3">
                <div class="mt-0.5 h-9 w-9 shrink-0 rounded-xl bg-black/20 border border-white/10 grid place-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2 2l20 20"/>
                  </svg>
                </div>

                <div class="min-w-0">
                  <div class="text-xs font-semibold">
                    <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                      Link wurde zurückgezogen
                    </span>
                  </div>
                  <p class="mt-0.5 text-xs text-white/60 leading-relaxed">
                    Der Besitzer hat den Share-Link deaktiviert. Bitte lass dir einen neuen Link schicken.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- detail modal (read-only) -->
    <MarkerStoryModal
      :open="detailOpen"
      :marker="selected"
      :readonly="true"
      @close="detailOpen = false"
      @open-on-map="handleOpenOnMap"
    />

    <!-- credits -->
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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  ArrowPathIcon,
  Bars3Icon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  MapPinIcon,
} from '@heroicons/vue/24/outline'

import DashboardSidebar from '@/components/DashboardSidebar.vue'
import GeoSearchBox from '@/components/GeoSearchBox.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import MapLoad from '@/components/MapLoad.vue'
import MarkerStoryModal from '@/components/MarkerStoryModal.vue'
import TripSwitcher from '@/components/TripSwitcher.vue'

import gemini2 from '@/assets/gemini2.png'

import { useShareStore } from '@/stores/ShareStore'

import type { Marker } from '@/types/Marker'
import type { SharedTrip } from '@/types/Share'

defineOptions({ name: 'SharedViewPage' })

const router = useRouter()
const route = useRoute()

const isSidebarOpen = ref(false)
const searchQuery = ref('')

const mapRef = ref<InstanceType<typeof MapLoad> | null>(null)

const selectedTripId = ref<number | null>(null)
const clusterOn = ref(false)

const selectedId = ref<number | null>(null)
const detailOpen = ref(false)

const MIN_DETAIL_ZOOM = 6.5
const pendingOpenId = ref<number | null>(null)

const share = useShareStore()
const { markers, trips, isLoading, error } = storeToRefs(share)

const selected = computed<Marker | null>(() => {
  if (selectedId.value == null) return null
  return (markers.value as any[]).find(m => Number(m.id) === Number(selectedId.value)) ?? null
})

const displayMarkers = computed<Marker[]>(() => {
  if (selectedTripId.value == null) return markers.value as any

  const trip = (trips.value as SharedTrip[]).find(t => Number(t.id) === Number(selectedTripId.value))
  const ids = new Set<number>((trip?.stops ?? []).map(s => Number(s.markerId)))
  return (markers.value as any[]).filter(m => ids.has(Number(m.id)))
})

const displayRoutes = computed<Array<{ fromId: number; toId: number }>>(() => {
  if (selectedTripId.value == null) return []

  const trip = (trips.value as SharedTrip[]).find(t => Number(t.id) === Number(selectedTripId.value))
  const stops = [...(trip?.stops ?? [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
  if (stops.length < 2) return []

  const edges: Array<{ fromId: number; toId: number }> = []
  for (let i = 0; i < stops.length - 1; i++) {
    edges.push({ fromId: Number(stops[i].markerId), toId: Number(stops[i + 1].markerId) })
  }
  return edges
})

const activeTripLabel = computed(() => {
  if (selectedTripId.value == null) return 'Alle Marker'
  const t = (trips.value as any[]).find(x => Number(x?.id) === Number(selectedTripId.value))
  const title = (t?.title ?? '').toString().trim()
  return title ? title : `Trip #${selectedTripId.value}`
})

function noop() {}

function fitDisplayMarkers(padding = 96) {
  const list = displayMarkers.value as any[]
  if (!list?.length) return

  if (list.length === 1) {
    const m = list[0]
    mapRef.value?.flyTo(Number(m.lat), Number(m.lng), 6.5)
    return
  }

  let west = Infinity
  let south = Infinity
  let east = -Infinity
  let north = -Infinity

  for (const m of list) {
    const lat = Number(m.lat)
    const lng = Number(m.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
    west = Math.min(west, lng)
    south = Math.min(south, lat)
    east = Math.max(east, lng)
    north = Math.max(north, lat)
  }

  if (west === Infinity) return
  mapRef.value?.fitBounds?.(west, south, east, north, padding)
}

async function loadShared() {
  const code = String(route.params.code || '').trim()
  if (!code) {
    share.clear()
    ;(error as any).value = 'Kein Share-Code in der URL gefunden.'
    return
  }

  try {
    await share.loadShared(code)
    selectedTripId.value = null

    const hasForcedPos = !!route.query.goto || !!route.query.center || !!route.query.focus

    await nextTick()
    if (!hasForcedPos) {
      fitDisplayMarkers()
    }
  } catch {
    /* noop */
  }
}

function goHome() {
  router.push('/')
}

async function onSelectTrip(id: number | null) {
  selectedTripId.value = id
  await nextTick()
  fitDisplayMarkers()
}

function handleOpenOnMap(id: number) {
  const m = (markers.value as any[]).find(x => Number(x.id) === Number(id))
  if (m) mapRef.value?.flyTo(Number(m.lat), Number(m.lng), 13)
}

const onZoomIn = () => mapRef.value?.zoomIn()
const onZoomOut = () => mapRef.value?.zoomOut()
const onReset = () => mapRef.value?.resetView?.()

const onLocate = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => mapRef.value?.flyTo(coords.latitude, coords.longitude, 13),
    () => {},
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

function onSuggestSelect(s: { lat: number; lon: number; display_name: string }) {
  mapRef.value?.flyTo(s.lat, s.lon, 10)
}

function onSearchResults(payload: { query: string; results: Array<any>; best?: { lat: string; lon: string } }) {
  const best = payload?.best
  if (best) mapRef.value?.flyTo(Number(best.lat), Number(best.lon), 10)
}

async function applyGotoFromQuery() {
  const goto = route.query.goto as string | undefined
  const zoomStr = route.query.zoom as string | undefined
  if (!goto) return

  const [latStr, lngStr] = goto.split(',')
  const lat = Number(latStr)
  const lng = Number(lngStr)
  const zoom = zoomStr ? Number(zoomStr) : 10

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

  await nextTick()
  mapRef.value?.flyTo(lat, lng, Number.isFinite(zoom) ? zoom : 10)
}

async function applyFocusFromQuery() {
  const focusStr = route.query.focus as string | undefined
  const id = focusStr ? Number(focusStr) : NaN
  if (!Number.isFinite(id)) return

  await nextTick()
  const m = (markers.value as any[]).find(x => Number(x.id) === Number(id))
  if (m) mapRef.value?.flyTo(Number(m.lat), Number(m.lng), 13)
}

function openDetail(id: number) {
  selectedId.value = id
  detailOpen.value = true
}

function onMarkerClick({ id }: { id: number }) {
  const m = (markers.value as any[]).find(x => Number(x.id) === Number(id))
  if (!m) return

  const z = mapRef.value?.getZoom?.() ?? 0
  if (z < MIN_DETAIL_ZOOM) {
    pendingOpenId.value = id
    mapRef.value?.flyTo(Number(m.lat), Number(m.lng), MIN_DETAIL_ZOOM)
    return
  }

  openDetail(id)
}

function onMapMove(payload: { center: { lat: number; lng: number }; zoom: number }) {
  if (pendingOpenId.value != null && payload.zoom >= MIN_DETAIL_ZOOM) {
    const id = pendingOpenId.value
    pendingOpenId.value = null
    openDetail(id)
  }
}

function onMapClick() {
  pendingOpenId.value = null
  detailOpen.value = false
}

watch(selectedTripId, () => {
  pendingOpenId.value = null
  detailOpen.value = false
})

watch(() => route.query.goto, () => applyGotoFromQuery())
watch(() => route.query.focus, () => applyFocusFromQuery())

watch(
  () => route.params.code,
  async () => {
    await loadShared()
    applyGotoFromQuery()
    applyFocusFromQuery()
  }
)

onMounted(async () => {
  await loadShared()

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

  applyGotoFromQuery()
  applyFocusFromQuery()
})
</script>

<style scoped>
.evoc-ring {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 16px;
}

.evoc-ring::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 16px;
  background: linear-gradient(90deg, rgba(192,132,252,0.9), rgba(240,171,252,0.8), rgba(129,140,248,0.9));
  filter: blur(10px);
  opacity: 0.22;
  pointer-events: none;
  transition: opacity 200ms;
}

.evoc-ring:hover::before {
  opacity: 0.5;
}

.evoc-btn {
  position: relative;
  z-index: 1;
  height: 44px;
  width: 44px;
  border-radius: 16px;
  background: rgba(17, 26, 51, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 200ms;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.evoc-btn:hover {
  border-color: rgba(217, 70, 239, 0.4);
  background: rgba(17, 26, 51, 0.95);
}

.evoc-btn:active {
  transform: translateY(1px);
}
</style>

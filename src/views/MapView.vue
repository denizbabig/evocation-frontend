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
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]"
        />
      </div>

      <MapLoad
        ref="mapRef"
        :markers="visibleMarkers"
        :routes="routes"
        :cluster="clusterOn"
        @map-move="onMapMove"
        @map-click="onMapClick"
        @marker-click="onMarkerClick"
      />

      <div class="fixed inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#0e162c_100%)]" />
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
          <Bars3Icon class="w-8 h-8" />
        </button>

        <div class="flex items-center gap-2 select-none cursor-pointer" @click="goHome">
          <span
            class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
          >
            Evocation
          </span>
        </div>
      </div>
    </nav>

    <!-- Search + active trip (centered, bigger, clean spacing) -->
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
          </div>
        </div>
      </div>
    </div>

    <CreateTripModal
      :open="createTripOpen"
      :saving="createTripSaving"
      @close="closeCreateTrip"
      @submit="submitCreateTrip"
    />

    <!-- ✅ Right control stack (TripSwitcher + buttons) -->
    <div class="absolute z-50 top-44 right-6 md:right-10 flex flex-col gap-3">
      <!-- Trip switcher as same-size button -->
      <div class="evoc-ring">
        <TripSwitcher
          compact
          :trips="trips"
          :selected-id="tripFilterId"
          @select="chooseTrip"
          @create="openCreateTrip"
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

      <div class="evoc-ring">
        <button
          @click="shareModalOpen = true"
          class="evoc-btn"
          title="Share-Link erstellen"
          aria-label="Share-Link erstellen"
        >
          <LinkIcon class="w-5 h-5" />
        </button>
      </div>

    </div>

    <!-- sidebar load -->
    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- create modal-->
    <MarkerCreateModal
      :open="!!draft"
      :saving="isSaving"
      :categories="categoryOptions"
      :default-lat="draft?.lat ?? 52.520008"
      :default-lng="draft?.lng ?? 13.404954"
      :use-geolocation="false"
      :show-place-search="false"
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

    <ShareLinkModal v-model="shareModalOpen" />

    <!-- credits :) -->
    <div class="fixed bottom-4 right-4 z-40">
      <div
        class="pointer-events-auto rounded-lg bg-[#0b1228]/80 border border-white/12 px-3 py-1.5 text-[11px] text-gray-300 shadow-lg shadow-black/30"
      >
        Geocoding:
        <a
          href="https://nominatim.openstreetmap.org"
          target="_blank"
          rel="noopener"
          class="underline decoration-fuchsia-300/60 hover:decoration-fuchsia-300"
        >Nominatim</a
        >
        (Search) ·
        <a
          href="https://photon.komoot.io/"
          target="_blank"
          rel="noopener"
          class="underline decoration-fuchsia-300/60 hover:decoration-fuchsia-300"
        >Photon</a
        >
        (Autocomplete) — © OpenStreetMap contributors
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import {
  Bars3Icon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  MapPinIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'

import MapLoad from '@/components/MapLoad.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import GeoSearchBox from '@/components/GeoSearchBox.vue'
import gemini2 from '@/assets/gemini2.png'

import { useMarkerStore } from '@/stores/MarkerStore'
import type { NewMarker } from '@/types/Marker'
import { apiFetch } from '@/lib/api'
import { reversePlaceName } from '@/lib/reverseGeocode'
import MarkerStoryModal from '@/components/MarkerStoryModal.vue'
import { updateMarkerJson } from '@/lib/markerApi.ts'
import MarkerEditModal from '@/components/MarkerEditModal.vue'
import { useTripStore } from '@/stores/TripStore'
import TripSwitcher from '@/components/TripSwitcher.vue'
import CreateTripModal from '@/components/CreateTripModal.vue'
import MarkerCreateModal from '@/components/MarkerCreateModal.vue'
import { LinkIcon } from '@heroicons/vue/24/outline'
import ShareLinkModal from '@/components/ShareModal.vue'

defineOptions({ name: 'MapViewPage' })

const tripStore = useTripStore()
const { activeTripId, activeStopsSorted } = storeToRefs(tripStore)

const router = useRouter()
const route = useRoute()

const markerStore = useMarkerStore()
const { markers, isSaving, draft } = storeToRefs(markerStore)
const shareModalOpen = ref(false)
const detailId = ref<string | number | null>(null)

const activeDetail = computed(() => {
  if (detailId.value == null) return null
  return markers.value.find(m => String(m.id) === String(detailId.value)) ?? null
})

const isSidebarOpen = ref(false)
const searchQuery = ref('')
const detailOpen = ref(false)

const mapRef = ref<InstanceType<typeof MapLoad> | null>(null)

import type { CategoryId } from '@/types/CategoryId'

const categoryOptions: { id: CategoryId; label: string }[] = [
  { id: 'TRAVEL',    label: 'Reise' },
  { id: 'FOOD',      label: 'Essen' },
  { id: 'CULTURE',   label: 'Sightseeing / Kultur' },
  { id: 'SHOPPING',  label: 'Shopping' },
  { id: 'NATURE',    label: 'Natur' },
  { id: 'ADVENTURE', label: 'Abenteuer' },
  { id: 'SPORT',     label: 'Sport' },
]

function goHome() {
  router.push('/')
}

function onMapClick({ lat, lng }: { lat: number; lng: number }) {
  markerStore.startDraftFromMap(lat, lng)
}

function fitVisibleMarkers(padding = 96) {
  const list = visibleMarkers.value
  if (!list?.length) return

  // 1 Marker => lieber flyTo als fitBounds
  if (list.length === 1) {
    const m = list[0]
    mapRef.value?.flyTo(Number(m.lat), Number(m.lng), 6.5)
    return
  }

  let west = Infinity, south = Infinity, east = -Infinity, north = -Infinity
  for (const m of list) {
    const lat = Number((m as any).lat)
    const lng = Number((m as any).lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
    west = Math.min(west, lng)
    south = Math.min(south, lat)
    east = Math.max(east, lng)
    north = Math.max(north, lat)
  }

  if (west === Infinity) return
  mapRef.value?.fitBounds?.(west, south, east, north, padding)
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
    await markerStore.deleteMarker(id)
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
  if (best) mapRef.value?.flyTo(Number(best.lat), Number(best.lon), 10)
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
  const gotoStr = (route.query.goto as string | undefined) ?? (route.query.center as string | undefined)
  const zoomStr = (route.query.zoom as string | undefined) ?? (route.query.z as string | undefined)
  const z = zoomStr ? Number(zoomStr) : 12

  const pos = parseLatLng(gotoStr)
  if (!pos) return

  await nextTick()
  mapRef.value?.flyTo(pos.lat, pos.lng, Number.isFinite(z) ? z : 12)
}

watch(
  () => [route.query.goto, route.query.center, route.query.zoom, route.query.z, route.query.new],
  () => applyMapQuery(),
  { immediate: false }
)

type CreateSubmitPayload = { marker: NewMarker; tripId: number | null }

async function saveMarker({ marker, tripId }: CreateSubmitPayload) {
  try {
    const withPlace: NewMarker = { ...marker }

    if (!withPlace.placeName || !withPlace.placeName.trim()) {
      withPlace.placeName = await reversePlaceName(Number(withPlace.lat), Number(withPlace.lng))
    }

    const created = await markerStore.addMarker(withPlace)
    await markerStore.loadMarkers()

    if (tripId != null) {
      await tripStore.selectTrip(tripId)
      await tripStore.addStop(created.id)
      await tripStore.loadTrips()
      await refreshAssignedMarkerIds()
    }

    mapRef.value?.flyTo(created.lat, created.lng, 13)
    detailId.value = created.id
    detailOpen.value = true

    closeDraft()
  } catch (e) {
    console.error(e)
  }
}

const editSaving = ref(false)



async function onEditSubmit(
  { payload, files, tripId }:
  { payload: any; files?: File[]; tripId: number | null } // ✅ files optional
) {
  if (!activeMarker.value?.id) return

  console.log('[EDIT SUBMIT] payload.images:', payload?.images)

  const markerId = Number(activeMarker.value.id)
  editSaving.value = true

  const prevTrip = Number(activeTripId.value ?? 0) || null

  // ✅ safe default (immer ein Array)
  const safeFiles: File[] = Array.isArray(files) ? files : []

  try {
    await updateMarkerJson(markerId, payload) // ✅ statt files
    await markerStore.loadMarkers()

    const fromTripId = await findTripIdForMarker(markerId)
    const toTripId = tripId == null ? null : Number(tripId)
    const same = (fromTripId ?? null) === (toTripId ?? null)

    if (!same) {
      if (fromTripId != null) {
        await tripStore.selectTrip(fromTripId)
        await tripStore.removeStop(markerId)
      }
      if (toTripId != null) {
        await tripStore.selectTrip(toTripId)
        await tripStore.addStop(markerId)
      }

      await tripStore.loadTrips()
      if (tripStore.activeTripId) await tripStore.loadStops(tripStore.activeTripId)
      await refreshAssignedMarkerIds()
    }

    if (prevTrip != null) await tripStore.selectTrip(prevTrip)

    editOpen.value = false
    editId.value = null
  } finally {
    editSaving.value = false
  }
}

const MIN_DETAIL_ZOOM = 6.5
const pendingOpenId = ref<number | null>(null)

async function onMarkerClick({ id }: { id: number }) {
  const m = markers.value.find(x => Number(x.id) === Number(id))
  if (!m) return

  const z = mapRef.value?.getZoom?.() ?? 0
  if (z < MIN_DETAIL_ZOOM) {
    pendingOpenId.value = id
    mapRef.value?.flyTo(m.lat, m.lng, MIN_DETAIL_ZOOM)
    return
  }

  openDetail(id)
}

function openDetail(id: number) {
  detailId.value = id
  markerStore.setSelected(id)
  detailOpen.value = true
}

function onMapMove(payload: { center: { lat: number; lng: number }; zoom: number }) {
  if (pendingOpenId.value != null && payload.zoom >= MIN_DETAIL_ZOOM) {
    const id = pendingOpenId.value
    pendingOpenId.value = null
    openDetail(id)
  }
}

const routes = computed(() => {
  if (tripFilterId.value == null) return []
  const ids = activeStopsSorted.value.map(s => Number(s.markerId))
  const edges: Array<{ fromId: number; toId: number }> = []
  for (let i = 0; i < ids.length - 1; i++) edges.push({ fromId: ids[i], toId: ids[i + 1] })
  return edges
})

onMounted(async () => {
  await Promise.all([
    markerStore.loadMarkers().catch(console.error),
    tripStore.loadTrips().catch(console.error),
  ])

  await refreshAssignedMarkerIds()

  if (activeTripId.value && tripFilterId.value == null) {
    tripFilterId.value = Number(activeTripId.value)
    await tripStore.selectTrip(Number(activeTripId.value))
    await nextTick()
    fitVisibleMarkers()
  }

  await applyMapQuery()
})

const clusterOn = ref(false)

const stopIdSet = computed(() => new Set(activeStopsSorted.value.map(s => Number(s.markerId))))
const tripFilterId = ref<number | null>(null)
const trips = computed(() => tripStore.trips ?? [])

async function chooseTrip(id: number | null) {
  tripFilterId.value = id

  if (id != null) {
    await tripStore.selectTrip(id)
  }

  // wichtig: erst render/update abwarten, dann bounds berechnen
  await nextTick()
  fitVisibleMarkers()
}

const assignedMarkerIdSet = ref<Set<number>>(new Set())

async function refreshAssignedMarkerIds() {
  try {
    const all = new Set<number>()
    const list = tripStore.trips ?? []
    const counts = new Map<number, number>()

    await Promise.all(
      list.map(async (t: any) => {
        const id = Number(t.id)
        if (!id) return

        const stops = await apiFetch(`/trips/${id}/stops`, { method: 'GET' })
        const arr = Array.isArray(stops) ? stops : []

        counts.set(id, arr.length)

        for (const s of arr) {
          const mid = Number(s.markerId)
          if (Number.isFinite(mid)) all.add(mid)
        }
      })
    )

    assignedMarkerIdSet.value = all

    for (const t of list as any[]) {
      const id = Number(t?.id)
      if (!id) continue
      t.stopCount = counts.get(id) ?? 0
    }
  } catch (e) {
    console.warn('refreshAssignedMarkerIds failed', e)
    assignedMarkerIdSet.value = new Set()
  }
}

const visibleMarkers = computed(() => {
  if (tripFilterId.value == null) return markers.value

  const inActiveTrip = stopIdSet.value
  if (inActiveTrip.size === 0) {
    const assignedAnyTrip = assignedMarkerIdSet.value
    return markers.value.filter(m => !assignedAnyTrip.has(Number(m.id)))
  }

  return markers.value.filter(m => inActiveTrip.has(Number(m.id)))
})

watch(tripFilterId, () => (pendingOpenId.value = null))

const createTripOpen = ref(false)
const createTripSaving = ref(false)

function openCreateTrip() {
  createTripOpen.value = true
}

function closeCreateTrip() {
  createTripOpen.value = false
}

async function submitCreateTrip(title: string) {
  createTripSaving.value = true
  try {
    const created = await tripStore.createTrip(title)
    await tripStore.loadTrips()

    const newId = Number((created as any)?.id ?? tripStore.trips?.at(-1)?.id)
    if (Number.isFinite(newId)) {
      tripFilterId.value = newId
      await tripStore.selectTrip(newId)
    }

    closeCreateTrip()
  } catch (e: any) {
    console.error(e)
  } finally {
    createTripSaving.value = false
  }
}

async function findTripIdForMarker(markerId: number): Promise<number | null> {
  const list = tripStore.trips ?? []

  for (const t of list as any[]) {
    const id = Number(t?.id)
    if (!id) continue

    const stops = await apiFetch(`/trips/${id}/stops`, { method: 'GET' })
    const found = (stops ?? []).some((s: any) => Number(s.markerId) === Number(markerId))
    if (found) return id
  }

  return null
}

const activeTripLabel = computed(() => {
  if (!tripFilterId.value) return 'Alle Marker'
  const t = trips.value.find(x => Number((x as any).id) === Number(tripFilterId.value))
  return (t as any)?.title?.trim?.() ? (t as any).title : `Trip #${tripFilterId.value}`
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

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

    <!-- ✅ TOP OVERLAY (mobile: hamburger + search | desktop: hamburger + centered logo + search below) -->
    <header
      class="fixed top-0 left-0 right-0 z-50
         px-4 pt-4 md:px-12 md:pt-6
         pointer-events-none"
      style="padding-top: calc(env(safe-area-inset-top) + 12px);"
    >
      <!-- ✅ MOBILE ROW: hamburger + search (no logo text) -->
      <div class="md:hidden pointer-events-auto flex items-center gap-3">
        <button
          @click="isSidebarOpen = true"
          class="shrink-0 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition duration-200"
          aria-label="Menü öffnen"
        >
          <Bars3Icon class="w-7 h-7" />
        </button>

        <div class="flex-1 min-w-0">
          <GeoSearchBox
            v-model="searchQuery"
            class="w-full"
            placeholder="Ort suchen"
            :showSearchButton="false"
            @select="onSuggestSelect"
            @search="onSearchResults"
          />
        </div>
      </div>

      <!-- ✅ DESKTOP TOP ROW: hamburger left, logo centered (NOT next to each other) -->
      <div class="hidden md:block pointer-events-auto">
        <div class="relative flex items-center h-12">
          <button
            @click="isSidebarOpen = true"
            class="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition duration-200"
            aria-label="Menü öffnen"
          >
            <Bars3Icon class="w-8 h-8" />
          </button>

          <!-- centered brand -->
          <div
            class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 select-none cursor-pointer"
            @click="goHome"
          >
        <span
          class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
        >
          Evocation
        </span>
          </div>
        </div>

        <!-- desktop search in its own row -->
        <div class="mt-4 max-w-2xl mx-auto">
          <GeoSearchBox
            v-model="searchQuery"
            class="w-full"
            placeholder="Ort suchen"
            :showSearchButton="false"
            @select="onSuggestSelect"
            @search="onSearchResults"
          />
        </div>
      </div>

      <!-- Active trip pill (both) -->
      <div class="pointer-events-auto mt-3 flex justify-center">
        <div
          class="inline-flex items-center justify-center gap-2 rounded-2xl
             bg-[#111a33]/75 border border-white/18 backdrop-blur-xl
             px-4 py-2 text-sm text-white/80 shadow-lg shadow-black/25
             max-w-[92vw]"
        >
          <span class="text-base">🧳</span>
          <span class="text-white/55">Aktiver Trip:</span>
          <span
            class="font-semibold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent truncate"
          >
        {{ activeTripLabel }}
      </span>
        </div>
      </div>
    </header>

    <CreateTripModal
      :open="createTripOpen"
      :saving="createTripSaving"
      @close="closeCreateTrip"
      @submit="submitCreateTrip"
    />

    <!-- ✅ Desktop controls (right stack) -->
    <div class="hidden md:flex absolute z-50 top-44 right-6 md:right-10 flex-col gap-3">
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

    <!-- ✅ Mobile bottom dock (scrollable, no overlap) -->
    <div
      class="md:hidden fixed left-1/2 -translate-x-1/2 z-50
             w-[calc(100vw-20px)] max-w-[440px]"
      style="bottom: calc(env(safe-area-inset-bottom) + 12px);"
    >
      <div
        class="rounded-2xl border border-white/12 bg-[#0b1228]/70 backdrop-blur-xl
               shadow-2xl shadow-black/40 px-2 py-2"
      >
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div class="evoc-ring shrink-0">
            <TripSwitcher
              compact
              :trips="trips"
              :selected-id="tripFilterId"
              @select="chooseTrip"
              @create="openCreateTrip"
            />
          </div>

          <div class="evoc-ring shrink-0">
            <button @click="onZoomIn" class="evoc-btn" title="Zoom in" aria-label="Zoom in">
              <MagnifyingGlassPlusIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="evoc-ring shrink-0">
            <button @click="onZoomOut" class="evoc-btn" title="Zoom out" aria-label="Zoom out">
              <MagnifyingGlassMinusIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="evoc-ring shrink-0">
            <button @click="onLocate" class="evoc-btn" title="Mein Standort" aria-label="Mein Standort">
              <MapPinIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="evoc-ring shrink-0">
            <button @click="onReset" class="evoc-btn" title="Reset" aria-label="Reset">
              <ArrowPathIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="evoc-ring shrink-0">
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

          <div class="evoc-ring shrink-0">
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

    <!-- credits :) (hide on mobile to avoid collisions) -->
    <div class="hidden md:block fixed bottom-4 right-4 z-40">
      <div
        class="pointer-events-auto rounded-lg bg-[#0b1228]/80 border border-white/12 px-3 py-1.5 text-[11px] text-gray-300 shadow-lg shadow-black/30"
      >
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
/* Imports */
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  ArrowPathIcon,
  Bars3Icon,
  LinkIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  MapPinIcon,
} from '@heroicons/vue/24/outline'

import CreateTripModal from '@/components/CreateTripModal.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import GeoSearchBox from '@/components/GeoSearchBox.vue'
import MapLoad from '@/components/MapLoad.vue'
import MarkerCreateModal from '@/components/MarkerCreateModal.vue'
import MarkerEditModal from '@/components/MarkerEditModal.vue'
import MarkerStoryModal from '@/components/MarkerStoryModal.vue'
import ShareLinkModal from '@/components/ShareModal.vue'
import TripSwitcher from '@/components/TripSwitcher.vue'

import gemini2 from '@/assets/gemini2.png'
import { apiFetch } from '@/lib/api'
import { reversePlaceName } from '@/lib/reverseGeocode'
import { updateMarkerJson } from '@/lib/markerApi.ts'
import { useMarkerStore } from '@/stores/MarkerStore'
import { useTripStore } from '@/stores/TripStore'
import type { CategoryId } from '@/types/CategoryId'
import type { NewMarker } from '@/types/Marker'

/* Constants */
defineOptions({ name: 'MapViewPage' })

const categoryOptions: { id: CategoryId; label: string }[] = [
  { id: 'TRAVEL', label: 'Reise' },
  { id: 'FOOD', label: 'Essen' },
  { id: 'CULTURE', label: 'Sightseeing / Kultur' },
  { id: 'SHOPPING', label: 'Shopping' },
  { id: 'NATURE', label: 'Natur' },
  { id: 'ADVENTURE', label: 'Abenteuer' },
  { id: 'SPORT', label: 'Sport' },
]

const MIN_DETAIL_ZOOM = 6.5

/* Refs */
const router = useRouter()
const route = useRoute()

const pendingFocusId = ref<number | null>(null)
const lastFocusedId = ref<number | null>(null)

const isSidebarOpen = ref(false)
const searchQuery = ref('')
const clusterOn = ref(false)
const shareModalOpen = ref(false)

const mapRef = ref<InstanceType<typeof MapLoad> | null>(null)

const detailOpen = ref(false)
const detailId = ref<string | number | null>(null)

const editOpen = ref(false)
const editId = ref<number | null>(null)
const editSaving = ref(false)

const tripFilterId = ref<number | null>(null)

const createTripOpen = ref(false)
const createTripSaving = ref(false)

const pendingOpenId = ref<number | null>(null)
const assignedMarkerIdSet = ref<Set<number>>(new Set())

/* ✅ Mobile sheet */
const mobileSheetOpen = ref(false)
const mobileSheetMode = ref<'trips' | 'info'>('trips')

function openMobileSheet(mode: 'trips' | 'info') {
  mobileSheetMode.value = mode
  mobileSheetOpen.value = true
}

function closeMobileSheet() {
  mobileSheetOpen.value = false
}

/* Stores */
const markerStore = useMarkerStore()
const tripStore = useTripStore()

const { markers, draft, isSaving } = storeToRefs(markerStore)
const { activeTripId, activeStopsSorted } = storeToRefs(tripStore)

/* Computeds */
const trips = computed(() => tripStore.trips ?? [])

const activeDetail = computed(() => {
  if (detailId.value == null) return null
  return markers.value.find((m) => String(m.id) === String(detailId.value)) ?? null
})

const activeMarker = computed(() => {
  if (editId.value == null) return null
  return markers.value.find((m) => Number(m.id) === Number(editId.value)) ?? null
})

const stopIdSet = computed(() => new Set(activeStopsSorted.value.map((s) => Number(s.markerId))))

const visibleMarkers = computed(() => {
  if (tripFilterId.value == null) return markers.value

  const inActiveTrip = stopIdSet.value
  if (inActiveTrip.size === 0) {
    const assignedAnyTrip = assignedMarkerIdSet.value
    return markers.value.filter((m) => !assignedAnyTrip.has(Number(m.id)))
  }

  return markers.value.filter((m) => inActiveTrip.has(Number(m.id)))
})

const routes = computed(() => {
  if (tripFilterId.value == null) return []
  const ids = activeStopsSorted.value.map((s) => Number(s.markerId))
  const edges: Array<{ fromId: number; toId: number }> = []
  for (let i = 0; i < ids.length - 1; i++) edges.push({ fromId: ids[i], toId: ids[i + 1] })
  return edges
})

const activeTripLabel = computed(() => {
  if (!tripFilterId.value) return 'Alle Marker'
  const t = trips.value.find((x: any) => Number((x as any).id) === Number(tripFilterId.value))
  return (t as any)?.title?.trim?.() ? (t as any).title : `Trip #${tripFilterId.value}`
})

/* Pure Helpers */
function parseLatLng(s?: string): { lat: number; lng: number } | null {
  if (!s) return null
  const [a, b] = String(s).split(',')
  const lat = Number(a)
  const lng = Number(b)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

function fitVisibleMarkers(padding = 96) {
  const list = visibleMarkers.value
  if (!list?.length) return

  if (list.length === 1) {
    const m = list[0] as any
    mapRef.value?.flyTo(Number(m.lat), Number(m.lng), 6.5)
    return
  }

  let west = Infinity,
    south = Infinity,
    east = -Infinity,
    north = -Infinity

  for (const m of list as any[]) {
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

async function focusMarkerById(id: number, opts?: { zoom?: number; openDetail?: boolean }) {
  const zoom = opts?.zoom ?? 13
  const openDetail = opts?.openDetail ?? false

  if (lastFocusedId.value === Number(id)) return

  const m: any = markers.value.find((x: any) => Number(x.id) === Number(id))
  if (!m) {
    pendingFocusId.value = Number(id)
    return
  }

  pendingFocusId.value = null
  lastFocusedId.value = Number(id)

  if (tripFilterId.value != null) {
    tripFilterId.value = null
    await nextTick()
  }

  await nextTick()

  const targetZoom = Math.max(MIN_DETAIL_ZOOM, zoom)
  mapRef.value?.flyTo(Number(m.lat), Number(m.lng), targetZoom)

  if (openDetail) {
    detailId.value = Number(id)
    markerStore.setSelected?.(Number(id))
    detailOpen.value = true
  }

  try {
    const q: any = { ...route.query }
    delete q.focus
    router.replace({ query: q }).catch(() => {})
  } catch {}
}

async function applyMapQuery() {
  const focusStr = route.query.focus as string | undefined
  if (focusStr) {
    const id = Number(focusStr)
    if (Number.isFinite(id) && id > 0) {
      await focusMarkerById(id, { zoom: 13, openDetail: false })
      return
    }
  }

  const gotoStr = (route.query.goto as string | undefined) ?? (route.query.center as string | undefined)
  const zoomStr = (route.query.zoom as string | undefined) ?? (route.query.z as string | undefined)
  const z = zoomStr ? Number(zoomStr) : 12

  const pos = parseLatLng(gotoStr)
  if (!pos) return

  await nextTick()
  mapRef.value?.flyTo(pos.lat, pos.lng, Number.isFinite(z) ? z : 12)
}

/* Watcher */
watch(
  () => [route.query.focus, route.query.goto, route.query.center, route.query.zoom, route.query.z, route.query.new],
  () => applyMapQuery(),
  { immediate: false }
)

watch(
  () => markers.value.length,
  async () => {
    if (pendingFocusId.value != null) {
      await focusMarkerById(pendingFocusId.value, { zoom: 13, openDetail: false })
    }
  }
)

watch(tripFilterId, () => {
  pendingOpenId.value = null
})

/* UI Handlers */
function goHome() {
  router.push('/')
}

function onMapClick({ lat, lng }: { lat: number; lng: number }) {
  markerStore.startDraftFromMap(lat, lng)
}

function onSuggestSelect(s: { lat: number; lon: number; display_name: string }) {
  mapRef.value?.flyTo(s.lat, s.lon, 13)
}

function onSearchResults(payload: { query: string; results: Array<any>; best?: { lat: string; lon: string } }) {
  const best = payload?.best
  if (best) mapRef.value?.flyTo(Number(best.lat), Number(best.lon), 18)
}

const onZoomIn = () => mapRef.value?.zoomIn()
const onZoomOut = () => mapRef.value?.zoomOut()
const onReset = () => mapRef.value?.resetView?.()

const locateBusy = ref(false)
const locateError = ref<string | null>(null)

async function onLocate() {
  if (locateBusy.value) return
  locateError.value = null

  if (!navigator.geolocation) {
    locateError.value = 'Geolocation wird von diesem Browser nicht unterstützt.'
    console.warn(locateError.value)
    return
  }

  locateBusy.value = true
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      })
    })

    const { latitude, longitude } = pos.coords
    mapRef.value?.flyTo(latitude, longitude, 15)
  } catch (e: any) {
    console.warn('[geo] failed:', e)
    locateError.value =
      e?.code === 1 ? 'Standort blockiert (Permission denied).' :
        e?.code === 2 ? 'Standort nicht verfügbar.' :
          e?.code === 3 ? 'Standort Timeout.' :
            (e?.message ?? 'Standort konnte nicht ermittelt werden.')
    alert(locateError.value)
  } finally {
    locateBusy.value = false
  }
}

function closeDraft() {
  markerStore.clearDraft()
}

function handleOpenOnMap(id: number) {
  const m: any = markers.value.find((x: any) => x.id === id)
  if (m) mapRef.value?.flyTo(m.lat, m.lng, 13)
}

function openDetail(id: number) {
  detailId.value = id
  markerStore.setSelected(id)
  detailOpen.value = true
}

async function onMarkerClick({ id }: { id: number }) {
  const m: any = markers.value.find((x: any) => Number(x.id) === Number(id))
  if (!m) return

  const z = mapRef.value?.getZoom?.() ?? 0
  if (z < MIN_DETAIL_ZOOM) {
    pendingOpenId.value = id
    mapRef.value?.flyTo(m.lat, m.lng, MIN_DETAIL_ZOOM)
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
  } catch {}
}

async function chooseTrip(id: number | null) {
  tripFilterId.value = id

  if (id != null) {
    await tripStore.selectTrip(id)
  }

  await nextTick()
  fitVisibleMarkers()
}

/* ✅ Mobile sheet versions: close after action */
async function chooseTripFromSheet(id: number | null) {
  closeMobileSheet()
  await chooseTrip(id)
}

function openCreateTripFromSheet() {
  closeMobileSheet()
  openCreateTrip()
}

function openCreateTrip() {
  createTripOpen.value = true
}

function closeCreateTrip() {
  createTripOpen.value = false
}

/* Upload/Transform */
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
  } catch {
    assignedMarkerIdSet.value = new Set()
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

/* Final Actions */
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
  } catch {}
}

async function onEditSubmit({
                              payload,
                              files,
                              tripId,
                            }: {
  payload: any
  files?: File[]
  tripId: number | null
}) {
  if (!activeMarker.value?.id) return

  const markerId = Number(activeMarker.value.id)
  editSaving.value = true

  const prevTrip = Number(activeTripId.value ?? 0) || null
  void files

  try {
    await updateMarkerJson(markerId, payload)
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

async function submitCreateTrip(title: string) {
  createTripSaving.value = true
  try {
    const created = await tripStore.createTrip(title)
    await tripStore.loadTrips()

    const newId = Number((created as any)?.id ?? (tripStore.trips as any[])?.at(-1)?.id)
    if (Number.isFinite(newId)) {
      tripFilterId.value = newId
      await tripStore.selectTrip(newId)
    }

    closeCreateTrip()
  } catch {
  } finally {
    createTripSaving.value = false
  }
}

/* Lifecycle */
onMounted(async () => {
  await Promise.all([markerStore.loadMarkers().catch(() => {}), tripStore.loadTrips().catch(() => {})])

  await refreshAssignedMarkerIds()

  if (activeTripId.value && tripFilterId.value == null) {
    tripFilterId.value = Number(activeTripId.value)
    await tripStore.selectTrip(Number(activeTripId.value))
    await nextTick()
    fitVisibleMarkers()
  }

  await applyMapQuery()
})
</script>

<style scoped>
.evoc-ring {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  flex: 0 0 auto;
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

/* Bottom sheet transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(16px);
  opacity: 0;
}

/* Optional: if TripSwitcher needs breathing room in sheet */
.evoc-mobile-sheet :deep(*) {
  max-width: 100%;
}
</style>

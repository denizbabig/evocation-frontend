<<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col bg-[#0e162c] text-white font-sans overflow-x-hidden">

    <!-- Hintergrund: Map als softes Hero -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
        :style="{ backgroundImage: `url(${gemini2})` }"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
    </div>

    <!-- leises Grid -->
    <div
      class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
      style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
    />

    <!-- NAV -->
    <nav class="fixed top-0 left-0 w-full z-50">


      <div class="relative flex items-center justify-start p-6 md:px-12">
        <div class="flex items-center gap-6">
          <button
            @click="isSidebarOpen = true"
            class="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition duration-200"
            aria-label="Menü öffnen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>

          <div class="flex items-center gap-2 select-none cursor-pointer" @click="goDashboard">
            <span
              class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
            >
              Evocation
            </span>
          </div>
        </div>
      </div>
    </nav>

    <main class="relative z-20 flex w-full max-w-7xl mx-auto flex-col items-center p-8 pt-32 pb-20">

      <!-- Hero / Suche -->
      <header class="w-full text-center mb-16 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-lg mb-6">
          Erkunde deine <br />
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Welt der Erinnerungen
          </span>
        </h1>
        <p class="text-xl font-light leading-relaxed text-gray-300 mb-10 max-w-2xl mx-auto">
          Durchsuche deine Orte oder stöbere entspannt in deiner Sammlung.
        </p>

        <div class="relative w-full max-w-2xl mx-auto">
          <GeoSearchBox
            v-model="searchQuery"
            placeholder="Ort suchen – oder Titel/Notiz filtern"
            @select="fillOnly"
            @search="searchFillOnly"
            :showSearchButton="false"
          />
        </div>
      </header>

      <!-- Share link (unter Suchleiste) -->
      <div class="-mt-6 flex justify-center">
        <AppButton variant="secondary" size="md" @click="shareModalOpen = true">
    <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
      Link für öffentliche Map erstellen
    </span>
        </AppButton>

        <ShareLinkModal v-model="shareModalOpen" />
      </div>

      <!-- Sammlung -->
      <div class="w-full">
        <div class="flex items-center justify-between mb-6 px-2">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-2 h-8 rounded-full bg-gradient-to-b from-purple-400 via-fuchsia-300 to-indigo-400"></span>
            Deine Sammlung
          </h2>
          <div class="text-sm text-gray-400">
            {{ filteredMarkers.length }} Orte gefunden
          </div>

          <AppButton variant="primary" size="md" @click="createOpen = true">
              <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                Marker erstellen
              </span>
          </AppButton>

        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="i in 8"
            :key="i"
            class="h-[300px] rounded-3xl bg-white/5 border border-white/10 animate-pulse"
          />
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <!-- Marker Cards -->
          <div
            v-for="m in filteredMarkers"
            :key="m.id"
            class="group relative h-full cursor-pointer rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1"
            @click="openDetail(m.id)"
          >
            <!-- Gradient Border + Glow -->
            <div
              class="absolute inset-0 rounded-3xl opacity-0 blur-[12px] transition-opacity duration-300 group-hover:opacity-70"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
            />
            <div
              class="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
            />

            <!-- Card Surface -->
            <div
              class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141c34]/60 backdrop-blur-md
                     h-[360px] min-h-[300px] transition-all duration-300
                     group-hover:shadow-2xl group-hover:shadow-fuchsia-900/30"
            >
              <!-- Cover media (ohne <template>-Nesting) -->
              <video
                v-if="coverCardSrc(m) && isVideoUrl(coverCardSrc(m))"
                :src="coverCardSrc(m)!"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                muted
                playsinline
                preload="metadata"
                loop
              />

              <img
                v-else-if="coverCardSrc(m)"
                :src="coverCardSrc(m)!"
                alt=""
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />

              <div
                v-else
                class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent"
              />

              <!-- Tiefe + Lesbarkeit -->
              <div class="absolute inset-0 bg-black/15" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <!-- Badge -->
              <div class="absolute right-4 top-4 z-20">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white/95
                         bg-white/10 border border-white/15 backdrop-blur-md
                         group-hover:bg-white/12 group-hover:border-white/25 transition"
                >
                  {{ m.dateAgoText }}
                </span>
              </div>

              <!-- Bottom-left -->
              <div class="absolute left-0 bottom-0 z-20 w-full p-5">
                <div
                  class="text-lg font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm transition-all duration-300
                         group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-fuchsia-300 group-hover:to-indigo-400
                         group-hover:bg-clip-text group-hover:text-transparent"
                >
                  {{ m.title || 'Ohne Titel' }}
                </div>

                <div class="mt-2 flex items-center gap-2 text-sm text-white/80">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7.5-3.358 7.5-10.5a7.5 7.5 0 1 0-15 0C4.5 17.642 12 21 12 21z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5a2.25 2.25 0 1 0 0 .001z"/>
                  </svg>

                  <span
                    class="truncate transition-all duration-300
                           group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-fuchsia-300 group-hover:to-indigo-400
                           group-hover:bg-clip-text group-hover:text-transparent"
                  >
                    {{ markerLocation(m) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <button
            @click="createOpen = true"
            class="group relative flex flex-col items-center justify-center h-full min-h-[300px] rounded-3xl border-2 border-dashed border-white/20 hover:border-transparent bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            <svg
              class="absolute inset-0 w-full h-full rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="evoc-grad-dashed" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#a78bfa"/><stop offset="50%" stop-color="#f0abfc"/><stop offset="100%" stop-color="#60a5fa"/>
                </linearGradient>
              </defs>
              <rect
                x="1" y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="24" ry="24"
                fill="none"
                stroke="url(#evoc-grad-dashed)"
                stroke-width="2"
                stroke-dasharray="6 6"
                stroke-linecap="round"
                vector-effect="non-scaling-stroke"
              />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg"
                 class="w-14 h-14 text-white opacity-90 group-hover:opacity-100 transition-opacity"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>

            <span class="mt-4 text-gray-400 group-hover:text-white font-semibold">
              Neuen Marker hinzufügen
            </span>
          </button>
        </div>
      </div>
    </main>

    <span class="relative z-20 w-full mt-auto py-6 text-center text-xs text-gray-500">
      &copy; 2025 Evocation Systems. All rights reserved.
    </span>

    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />



    <!-- Detail-Modal -->
    <MarkerStoryModal
      :open="detailOpen"
      :marker="activeDetail"
      :readonly="false"
      @close="detailOpen = false"
      @open-on-map="handleOpenOnMap"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Create -->
    <MarkerCreateModal
      :open="createOpen"
      :saving="isSaving"
      :categories="categoryOptions"
      :default-lat="52.520008"
      :default-lng="13.404954"
      @close="createOpen = false"
      @submit="saveMarker"
    />


    <MarkerEditModal
      :open="editOpen"
      :marker="activeMarker"
      :saving="editSaving"
      @close="editOpen = false"
      @submit="onEditSubmit"
    />

    <!-- Share link output -->
    <div v-if="shareLink" class="mt-5 text-center text-gray-400">
      <span class="text-sm">Dein Share-Link:</span>
      <div class="flex justify-center items-center gap-2">
        <a :href="shareLink" target="_blank" class="text-fuchsia-300 hover:underline">{{ shareLink }}</a>
        <AppButton @click="copyLink" variant="secondary" size="sm">Copy Link</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* Imports */
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { CameraIcon, GlobeEuropeAfricaIcon, MapPinIcon } from '@heroicons/vue/24/outline'

import AppButton from '@/components/AppButton.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import GeoSearchBox from '@/components/GeoSearchBox.vue'
import MarkerCreateModal from '@/components/MarkerCreateModal.vue'
import MarkerEditModal from '@/components/MarkerEditModal.vue'
import MarkerStoryModal from '@/components/MarkerStoryModal.vue'
import ShareLinkModal from '@/components/ShareModal.vue'

import gemini2 from '@/assets/gemini2.png'

import { apiFetch } from '@/lib/api'
import { markerCover } from '@/lib/markerImages'
import { reversePlaceName } from '@/lib/reverseGeocode'

import { useMarkerStore } from '@/stores/MarkerStore'
import { useTripStore } from '@/stores/TripStore'

import type { CategoryId } from '@/types/CategoryId'
import type { NewMarker } from '@/types/Marker'

/* Constants */
defineOptions({ name: 'MarkersView' })

const categoryOptions: { id: CategoryId; label: string }[] = [
  { id: 'TRAVEL', label: 'Reise' },
  { id: 'FOOD', label: 'Essen' },
  { id: 'CULTURE', label: 'Sightseeing / Kultur' },
  { id: 'SHOPPING', label: 'Shopping' },
  { id: 'NATURE', label: 'Natur' },
  { id: 'ADVENTURE', label: 'Abenteuer' },
  { id: 'SPORT', label: 'Sport' },
]

const categoryLabelMap: Record<CategoryId, string> = {
  TRAVEL: 'Reise',
  FOOD: 'Essen',
  CULTURE: 'Sightseeing / Kultur',
  SHOPPING: 'Shopping',
  NATURE: 'Natur',
  ADVENTURE: 'Abenteuer',
  SPORT: 'Sport',
}

const categoryIconMap: Record<CategoryId, any> = {
  TRAVEL: GlobeEuropeAfricaIcon,
  FOOD: MapPinIcon,
  CULTURE: CameraIcon,
  SHOPPING: MapPinIcon,
  NATURE: GlobeEuropeAfricaIcon,
  ADVENTURE: CameraIcon,
  SPORT: MapPinIcon,
}

/* Refs */
const isSidebarOpen = ref(false)
const searchQuery = ref('')

const shareModalOpen = ref(false)
const shareLink = ref<string | null>(null)

const createOpen = ref(false)

const detailOpen = ref(false)
const detailId = ref<string | number | null>(null)

const editOpen = ref(false)
const editId = ref<number | null>(null)
const editSaving = ref(false)

/* Stores */
const router = useRouter()
const markerStore = useMarkerStore()
const tripStore = useTripStore()

const { markers, isLoading, isSaving } = storeToRefs(markerStore)

/* Computeds */
const uiMarkers = computed(() => {
  return markers.value.map((m) => {
    const cid = (m.categoryId as CategoryId | null) ?? null
    return {
      ...m,
      categoryLabel: cid ? categoryLabelMap[cid] : 'Ohne Kategorie',
      icon: cid ? categoryIconMap[cid] : MapPinIcon,
      dateText: formatDate(m.occurredAt),
      dateAgoText: daysAgoLabel(m.occurredAt),
    }
  })
})

const filteredMarkers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return uiMarkers.value

  return uiMarkers.value.filter(
    (m: any) =>
      (m.title ?? '').toLowerCase().includes(q) ||
      (m.description ?? '').toLowerCase().includes(q) ||
      (m.categoryLabel ?? '').toLowerCase().includes(q)
  )
})

const activeDetail = computed(() => {
  if (detailId.value == null) return null
  return uiMarkers.value.find((m: any) => String(m.id) === String(detailId.value)) ?? null
})

const activeMarker = computed(() => {
  if (editId.value == null) return null
  return uiMarkers.value.find((m: any) => Number(m.id) === Number(editId.value)) ?? null
})

/* Init */
onMounted(() => {
  markerStore.loadMarkers().catch(() => {})
})

/* UI Handlers */
function goDashboard() {
  router.push('/').catch(() => {})
}

function openDetail(id: string | number) {
  detailId.value = id
  detailOpen.value = true
}

function handleOpenOnMap(id: number) {
  detailOpen.value = false
  router.push({ path: '/mapview', query: { focus: String(id) } })
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

/* Pure Helpers */
function primaryLabel(name: string) {
  const parts = name
    .split(/[,\u2013\u2014\-|·]+/g)
    .map((s) => s.trim())
    .filter(Boolean)

  const seen = new Set<string>()
  const uniq = parts.filter((p) => {
    const k = p.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  return uniq[0] || name.trim()
}

function fillOnly(s: { lat: number; lon: number; display_name: string }) {
  searchQuery.value = primaryLabel(s.display_name)
}

function searchFillOnly(payload: {
  query: string
  results: Array<{ lat: string; lon: string; display_name?: string }>
  best?: { lat: string; lon: string; display_name?: string }
}) {
  searchQuery.value = payload.query
}

function formatDate(isoYmd?: string | null) {
  if (!isoYmd) return '—'
  const [y, m, d] = isoYmd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1))
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }).format(dt)
}

function daysAgoLabel(isoYmd?: string | null) {
  if (!isoYmd) return '—'
  const [y, m, d] = String(isoYmd).split('-').map(Number)
  if (!y || !m || !d) return '—'

  const then = new Date(Date.UTC(y, m - 1, d))
  const now = new Date()
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const diffDays = Math.floor((todayUtc.getTime() - then.getTime()) / 86400000)

  if (diffDays <= 0) return 'Heute'
  if (diffDays === 1) return 'vor 1 Tag'
  return `vor ${diffDays} Tagen`
}

function isVideoUrl(u?: string | null) {
  if (!u) return false
  const s = String(u).toLowerCase()
  return (
    s.includes('/video/upload/') ||
    s.endsWith('.mp4') ||
    s.endsWith('.mov') ||
    s.endsWith('.webm') ||
    s.endsWith('.ogg') ||
    s.endsWith('.m4v') ||
    s.endsWith('.mkv')
  )
}

function coverCardSrc(m: any): string | null {
  try {
    return markerCover(m)?.card ?? null
  } catch {
    return null
  }
}

function markerLocation(m: any): string {
  return m.placeName || m.location || m.address || m.city || 'Ort unbekannt'
}

/* Final Actions */
type CreateSubmitPayload = { marker: NewMarker; tripId: number | null }

async function saveMarker({ marker, tripId }: CreateSubmitPayload) {
  try {
    const title = (marker.title ?? '').trim()
    const lat = Number(marker.lat)
    const lng = Number(marker.lng)

    if (!title || !Number.isFinite(lat) || !Number.isFinite(lng)) return

    const withPlace: NewMarker = { ...marker }
    if (!withPlace.placeName || !withPlace.placeName.trim()) {
      withPlace.placeName = await reversePlaceName(lat, lng)
    }

    const body = {
      title,
      description: withPlace.description ?? '',
      categoryId: withPlace.categoryId ?? null,
      startDate: withPlace.occurredAt,
      lat,
      lng,
      visibility: (withPlace as any).visibility ?? 'PRIVATE',
      placeName: withPlace.placeName ?? null,
      images: (withPlace as any).images ?? [],
    }

    const created = await apiFetch('/markers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (tripId != null) {
      await tripStore.selectTrip(tripId)
      await tripStore.addStop(created.id)
      await tripStore.loadTrips()
    }

    await markerStore.loadMarkers()
    detailId.value = created.id
    detailOpen.value = true
  } catch {
  } finally {
    createOpen.value = false
  }
}

async function onEditSubmit({ payload }: { payload: any; files: File[]; tripId: number | null }) {
  if (!activeMarker.value?.id) return

  editSaving.value = true
  try {
    const id = Number((activeMarker.value as any).id)

    await updateMarker(id, payload)

    if (payload.visibility) {
      await apiFetch(`/markers/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: payload.visibility }),
      })
    }

    await markerStore.loadMarkers()
    editOpen.value = false
    editId.value = null
  } finally {
    editSaving.value = false
  }
}

function updateMarker(id: number, payload: any) {
  const body = {
    title: payload.title,
    description: payload.description ?? '',
    categoryId: payload.categoryId ?? null,
    startDate: payload.occurredAt ?? payload.startDate ?? null,
    lat: Number(payload.lat),
    lng: Number(payload.lng),
    visibility: payload.visibility ?? 'PRIVATE',
    placeName: payload.placeName ?? null,
    images: payload.images ?? [],
    removedImageIds: payload.removedImageIds ?? [],
  }

  return apiFetch(`/markers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

async function copyLink() {
  if (!shareLink.value) return
  try {
    await navigator.clipboard.writeText(shareLink.value)
    alert('Link kopiert!')
  } catch {}
}
</script>
<style scoped>
/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0e162c; }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #4b5563; }

/* kleine Transitionen */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all .25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(8px); }
</style>

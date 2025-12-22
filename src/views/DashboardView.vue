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
    <nav class="absolute top-0 left-0 w-full z-40 flex items-center justify-start p-6 md:px-12">
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
        <div class="flex items-center gap-2 select-none cursor-pointer" @click="$router.push('/')">
          <span class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Evocation
          </span>
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
          />
        </div>
      </header>

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

    <div v-if="filteredMarkers.length" class="flex justify-center">
      <AppButton @click="shareModalOpen = true" variant="secondary">
        <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
          Link für öffentliche Map erstellen
        </span>
      </AppButton>

      <ShareLinkModal v-model="shareModalOpen" />
    </div>

    <span class="relative z-20 w-full mt-auto py-6 text-center text-xs text-gray-500">
      &copy; 2025 Evocation Systems. All rights reserved.
    </span>

    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Optionales einmaliges Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCard" class="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm" @click="showCard = false" />
      </Transition>
      <Transition name="fade-slide">
        <div v-if="showCard" class="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
          <BaseCard class="relative bg-[#1a233e]/90 border border-fuchsia-600/50 shadow-2xl shadow-fuchsia-900/40 max-w-lg w-full pointer-events-auto backdrop-blur-md p-8 text-center">
            <button @click="showCard = false" class="absolute top-4 right-4 text-gray-400 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <h3 class="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Willkommen zurück!
            </h3>
            <p class="text-gray-300 mb-6">
              Dein Dashboard wurde aktualisiert. Nutze die Suche, um deine Erinnerungen schneller zu finden.
            </p>
            <div class="flex justify-center">
              <AppButton @click="showCard = false" variant="primary" size="md">Verstanden</AppButton>
            </div>
          </BaseCard>
        </div>
      </Transition>
    </Teleport>

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
      :categories="[{id:1,label:'Reise'},{id:2,label:'Essen'},{id:3,label:'Sightseeing'},{id:4,label:'Shopping'}]"
      :saving="isLoading"
      @close="createOpen = false"
      @submit="saveCreatedMarker"
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
import AppButton from '@/components/AppButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import MarkerDetailModal from '@/components/MarkerDetailModal.vue'
import GeoSearchBox from '@/components/GeoSearchBox.vue'

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMarkerStore } from '@/stores/MarkerStore'
import MarkerCreateModal from '@/components/MarkerCreateModal.vue'
import type { NewMarker } from '@/types/Marker'
import GlobeBg from '@/assets/globe-bg.png'
import gemini1 from '@/assets/gemini1.png'
import gemini2 from '@/assets/gemini2.png'
import { apiFetch } from '@/lib/api'
import type { Visibility } from '@/types/Marker'
import { markerCover } from '@/lib/markerImages'
import { reversePlaceName } from '@/lib/reverseGeocode'
// Icons
import { MapPinIcon, CameraIcon, GlobeEuropeAfricaIcon } from '@heroicons/vue/24/outline'
import ShareLinkModal from '@/components/ShareModal.vue'
import MarkerStoryModal from "@/components/MarkerStoryModal.vue";
import MarkerEditModal from "@/components/MarkerEditModal.vue";
import { updateMarkerMultipart } from '@/lib/markerApi'
const shareModalOpen = ref(false)
defineOptions({ name: 'DashboardView' })

const router = useRouter()
const isSidebarOpen = ref(false)
const showCard = ref(true)
const searchQuery = ref('') // wird von GeoSearchBox gebunden
const lastGeoPick = ref<{ lat:number; lon:number; display_name:string } | null>(null)

// Store: echte Marker laden
const markerStore = useMarkerStore()
const { markers, isLoading } = storeToRefs(markerStore)
onMounted(() => { markerStore.loadMarkers().catch(console.error) })

// Anzeige-Helfer (Labels & Icons; keine Farben/Gradients)
const categoryLabelMap: Record<number, string> = {
  1: 'Reise', 2: 'Essen', 3: 'Sightseeing', 4: 'Shopping',
}
const categoryIconMap: Record<number, any> = {
  1: GlobeEuropeAfricaIcon,
  2: MapPinIcon,
  3: CameraIcon,
  4: MapPinIcon,
}

function formatDate(isoYmd?: string | null) {
  if (!isoYmd) return '—'
  const [y, m, d] = isoYmd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1))
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }).format(dt)
}

// UI-Projection der Store-Marker
const uiMarkers = computed(() => {
  return markers.value.map(m => {
    const cid = (m.categoryId as number | null) ?? null
    return {
      ...m,
      categoryLabel: cid ? categoryLabelMap[cid] : 'Ohne Kategorie',
      icon: cid ? categoryIconMap[cid] : MapPinIcon,
      dateText: formatDate(m.occurredAt),
      dateAgoText: daysAgoLabel(m.occurredAt),
    }
  })
})

// Text-Filter (lokal)
const filteredMarkers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return uiMarkers.value
  return uiMarkers.value.filter(m =>
    (m.title ?? '').toLowerCase().includes(q) ||
    (m.description ?? '').toLowerCase().includes(q) ||
    (m.categoryLabel ?? '').toLowerCase().includes(q)
  )
})

/* Detail-Modal State + Actions */
const detailOpen = ref(false)
const detailId = ref<string | number | null>(null)

const activeDetail = computed(() => {
  if (detailId.value == null) return null
  return uiMarkers.value.find(m => String(m.id) === String(detailId.value)) ?? null
})

function openDetail(id: string | number) {
  detailId.value = id
  detailOpen.value = true
}
function handleOpenOnMap(id: number) {
  detailOpen.value = false
  router.push({ path: '/map', query: { focus: String(id) } })
}
function handleEdit(id: number) {
  detailOpen.value = false
  editId.value = id
  editOpen.value = true
}

async function handleEditSubmit(payload: any) {
  console.log('EDIT SUBMIT payload:', payload)

  // TODO: später: API call / store.updateMarker(...)
  // await markerStore.updateMarker(payload)

  editOpen.value = false
  editId.value = null

  // optional: refresh
  // await markerStore.loadMarkers()
}

async function handleDelete(id: number) {
  try {
    await markerStore.deleteMarker(id)   // ✅ ruft /api/markers/:id → Backend löscht auch Cloudinary
    detailOpen.value = false
    detailId.value = null
  } catch (e) {
    console.error('[Dashboard] delete failed', e)
  }
}

/* GeoSearchBox Events
   - select: wähle Vorschlag -> zur Map springen (optional)
   - search: Enter/Button -> wenn Treffer vorhanden, ebenfalls zur Map; sonst bleibt der Text als Filter hier im Dashboard
*/
function onGeoSelect(s: { lat: number; lon: number; display_name: string }) {
  // Optional: gleich zur Map und zentrieren
  router.push({ path: '/map', query: { goto: `${s.lat},${s.lon}`, zoom: '11' } })
}

function onGeoSearch(payload: { query: string; results: Array<{ lat: string; lon: string }>; best?: { lat: string; lon: string } }) {
  // Immer den Text als lokalen Filter setzen
  searchQuery.value = payload.query
  // Wenn es einen „besten“ Treffer gibt -> Map öffnen und dorthin springen
  if (payload.best) {
    const lat = Number(payload.best.lat)
    const lon = Number(payload.best.lon)
    router.push({ path: '/map', query: { goto: `${lat},${lon}`, zoom: '10' } })
  }
}

const createOpen = ref(false)


// Nur ins Feld übernehmen – KEIN Routing, kein flyTo
function primaryLabel(name: string) {
  // Split an üblichen Trennern: Komma, Gedankenstrich, Bindestrich, Pipe, Punkt-Mittig
  const parts = name
    .split(/[,\u2013\u2014\-|·]+/g)
    .map(s => s.trim())
    .filter(Boolean)

  // Doppelte entfernen (Italien - Italien)
  const seen = new Set<string>()
  const uniq = parts.filter(p => {
    const k = p.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  return uniq[0] || name.trim()
}

// Nur ins Feld übernehmen – kurz & clean
function fillOnly(s: { lat:number; lon:number; display_name:string }) {
  searchQuery.value = primaryLabel(s.display_name) // 👈 bereinigt
  lastGeoPick.value = s
}

// Optional: Enter/„Suchen“-Button → auch nur Feld/State setzen
function searchFillOnly(payload: {
  query: string
  results: Array<{ lat:string; lon:string; display_name?: string }>
  best?: { lat:string; lon:string; display_name?: string }
}) {
  searchQuery.value = payload.query
  if (payload.best) {
    lastGeoPick.value = {
      lat: Number(payload.best.lat),
      lon: Number(payload.best.lon),
      display_name: payload.best.display_name ?? payload.query
    }
  }
  // kein router.push(), kein mapRef.flyTo() hier!
}

const shareLink = ref<string | null>(null)

// Function to call backend and generate share link
const generateShareLink = async () => {
  try {
    const data = await apiFetch('/share', { method: 'POST' })
    shareLink.value = `${window.location.origin}/shared/${data.code}`
  } catch (e) {
    console.error('Error generating share link:', e)
  }
}

const copyLink = async () => {
  if (!shareLink.value) return
  try {
    await navigator.clipboard.writeText(shareLink.value)
    // optional nicer als alert: später Toast
    alert('Link kopiert!')
  } catch (e) {
    console.error('Failed to copy link:', e)
  }
}
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

function coverCard(m: any): string | null {
  try {
    return markerCover(m)?.card ?? null
  } catch {
    return null
  }
}

function markerLocation(m: any): string {
  // nutzt was du evtl. schon hast – sonst fallback ohne Koordinaten
  return (
    m.placeName ||
    m.location ||
    m.address ||
    m.city ||
    'Ort unbekannt'
  )
}

async function saveCreatedMarker(data: NewMarker) {
  try {
    const withPlace: NewMarker = { ...data }

    if (!withPlace.placeName || !withPlace.placeName.trim()) {
      withPlace.placeName = await reversePlaceName(withPlace.lat, withPlace.lng)
    }

    const created = await markerStore.addMarker(withPlace)
    detailId.value = created.id
    detailOpen.value = true
  } catch (e) {
    console.error('[Dashboard] create failed', e)
  } finally {
    createOpen.value = false
  }

}
function daysAgoLabel(isoYmd?: string | null) {
  if (!isoYmd) return '—'

  const [y, m, d] = String(isoYmd).split('-').map(Number)
  if (!y || !m || !d) return '—'

  // UTC-Datum aus ISO (damit Zeitzonen nicht “einen Tag klauen”)
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

const editOpen = ref(false)
const editId = ref<number | null>(null)

const activeMarker = computed(() => {
  if (editId.value == null) return null
  return uiMarkers.value.find(m => Number(m.id) === Number(editId.value)) ?? null
})



const editSaving = ref(false)

async function onEditSubmit({ payload, files }: { payload: any; files: File[] }) {
  if (!activeMarker.value?.id) return
  editSaving.value = true
  try {
    await updateMarkerMultipart(activeMarker.value.id, payload, files)
    await markerStore.loadMarkers()
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

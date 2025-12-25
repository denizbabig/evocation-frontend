<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col bg-[#0e162c] text-white font-sans overflow-x-hidden">

    <!-- Background wie Dashboard -->
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

    <!-- NAV (Dashboard-Look) -->
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

        <div class="flex items-center gap-2 select-none cursor-pointer" @click="goDashboard">
          <span class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Evocation
          </span>
        </div>
      </div>
    </nav>

    <main class="relative z-20 flex w-full max-w-7xl mx-auto flex-col items-center p-8 pt-32 pb-20">

      <!-- HERO (Dashboard-Style: centered) -->
      <header class="w-full text-center mb-16 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-lg mb-6">
          Das sind deine
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
     unvergesslichen Trips
  </span>
        </h1>

        <p class="text-xl font-light leading-relaxed text-gray-300 mb-10 max-w-2xl mx-auto">
          Erstelle Trips und ordne Marker zu – als nächstes bauen wir Stops, Reihenfolge & Route.
        </p>

        <!-- Search (Dashboard-Glow) -->
        <div class="mt-2 relative group isolate w-full max-w-2xl mx-auto">
          <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-40">
            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
            <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
          </div>

          <div class="relative z-10 flex items-center gap-3 rounded-2xl bg-[#111a33]/85 backdrop-blur-xl border border-white/15 px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>

            <input
              v-model="q"
              type="text"
              placeholder="Trip-Titel filtern…"
              class="w-full bg-transparent border-none outline-none text-white placeholder-white/35 h-10 text-base focus:ring-0"
            />
          </div>
        </div>

        <!-- mini stats chips -->
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <div class="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-sm text-white/80">
            <span class="text-white/50 mr-2">Trips</span>
            <span class="font-semibold text-white">{{ trips.length }}</span>
          </div>

          <div class="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-sm text-white/80">
            <span class="text-white/50 mr-2">Marker gesamt</span>
            <span class="font-semibold text-white">{{ totalStops }}</span>
          </div>
        </div>
      </header>

      <!-- SECTION HEADER (wie "Deine Sammlung") -->
      <div class="w-full">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 px-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-8 rounded-full bg-gradient-to-b from-purple-400 via-fuchsia-300 to-indigo-400"></span>
            <h2 class="text-xl font-bold text-white">Deine Trips</h2>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-3">
            <div class="text-sm text-gray-400">
              {{ filteredTrips.length }} Trips gefunden
            </div>

            <AppButton variant="primary" size="md" @click="openCreate()">
              <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                + Trip erstellen
              </span>
            </AppButton>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="rounded-2xl bg-red-500/10 border border-red-400/20 px-5 py-4 text-sm text-red-200">
          {{ error }}
        </div>

        <!-- Loading -->
        <div v-else-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="i in 6"
            :key="i"
            class="h-[360px] rounded-3xl bg-white/5 border border-white/10 animate-pulse"
          />
        </div>

        <!-- Empty: Search -->
        <div v-else-if="filteredTrips.length === 0 && q.trim().length" class="relative isolate rounded-3xl p-[1px]">
          <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-50">
            <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[14px]" />
            <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]/70" />
          </div>

          <div class="relative rounded-3xl border border-white/15 bg-[#111a33]/85 backdrop-blur-xl p-8">
            <h3 class="text-2xl font-bold mb-2">Keine Treffer</h3>
            <p class="text-white/60">
              Für <span class="text-white/85 font-semibold">“{{ q }}”</span> wurde kein Trip gefunden.
            </p>
          </div>
        </div>

        <!-- Empty: No trips -->
        <div v-else-if="filteredTrips.length === 0" class="relative isolate rounded-3xl p-[1px]">
          <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-50">
            <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[14px]" />
            <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]/70" />
          </div>

          <div class="relative rounded-3xl border border-white/15 bg-[#111a33]/85 backdrop-blur-xl p-8">
            <h3 class="text-2xl font-bold mb-2">Noch keine Trips</h3>
            <p class="text-white/60 mb-6">
              Erstelle deinen ersten Trip, dann kannst du Marker hinzufügen und daraus eine Route bauen.
            </p>

            <div class="flex justify-end">
              <AppButton variant="primary" size="md" @click="openCreate()">
                <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                  + Trip erstellen
                </span>
              </AppButton>
            </div>
          </div>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <!-- Trip Cards (1:1 Dashboard Marker Card Feel) -->
          <div
            v-for="t in filteredTrips"
            :key="t.id"
            class="group relative h-full cursor-pointer rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1"
            @click="openDetail(t.id)"
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

            <!-- Card Surface (same sizing as dashboard) -->
            <div
              class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141c34]/60 backdrop-blur-md
             h-[360px] min-h-[300px] transition-all duration-300
             group-hover:shadow-2xl group-hover:shadow-fuchsia-900/30"
            >
              <!-- Cover -->
              <img
                v-if="t.coverUrl"
                :src="t.coverUrl"
                alt=""
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div v-else class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

              <!-- Depth + readability -->
              <div class="absolute inset-0 bg-black/15" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <!-- Badge (top-right) -->
              <div class="absolute right-4 top-4 z-20">
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white/95
                 bg-white/10 border border-white/15 backdrop-blur-md
                 group-hover:bg-white/12 group-hover:border-white/25 transition"
        >
          {{ (t.stopCount ?? 0) }} Marker
        </span>
              </div>

              <!-- Bottom-left like dashboard -->
              <div class="absolute left-0 bottom-0 z-20 w-full p-5">
                <div
                  class="text-lg font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm transition-all duration-300
                 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-fuchsia-300 group-hover:to-indigo-400
                 group-hover:bg-clip-text group-hover:text-transparent"
                >
                  {{ t.title || 'Ohne Titel' }}
                </div>

                <div class="mt-2 text-sm text-white/80 flex items-center justify-between gap-3">
                  <span class="text-white/55">Erstellt: {{ formatDate(t.createdAt) }}</span>

                  <!-- Mini action: Map (keine fetten Buttons -> Dashboard-feel bleibt clean) -->
                  <button
                    class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold tracking-wide
                   bg-white/10 border border-white/15 backdrop-blur-md text-white/90
                   hover:bg-white/12 hover:border-white/25 transition"
                    @click.stop="openInMap(t.id)"
                  >
                    In Map
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Card (same as dashboard) -->
          <button
            @click="openCreate()"
            class="group relative flex flex-col items-center justify-center h-full min-h-[300px] rounded-3xl border-2 border-dashed border-white/20 hover:border-transparent bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            <svg
              class="absolute inset-0 w-full h-full rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="evoc-grad-trip-cta" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#a78bfa"/><stop offset="50%" stop-color="#f0abfc"/><stop offset="100%" stop-color="#60a5fa"/>
                </linearGradient>
              </defs>
              <rect
                x="1" y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="24" ry="24"
                fill="none"
                stroke="url(#evoc-grad-trip-cta)"
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
      Neuen Trip erstellen
    </span>
          </button>
        </div>
      </div>
    </main>

    <span class="relative z-20 w-full mt-auto py-6 text-center text-xs text-gray-500">
      &copy; 2025 Evocation Systems. All rights reserved.
    </span>

    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Create Modal bleibt wie bei dir -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="createOpen"
          class="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
          @click="closeCreate()"
        />
      </Transition>

      <Transition name="fade-slide">
        <div v-if="createOpen" class="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
          <div class="pointer-events-auto w-full max-w-lg rounded-3xl border border-white/12 bg-[#141c34]/80 backdrop-blur-md p-7 shadow-2xl shadow-fuchsia-900/25">
            <div class="flex items-start justify-between gap-4">
              <h3 class="text-2xl font-bold tracking-tight">
                <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                  Trip erstellen
                </span>
              </h3>

              <button @click="closeCreate()" class="text-gray-300 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <p class="mt-2 text-sm text-gray-300/90">
              Gib deinem Trip einen Titel. Stops/Route bauen wir direkt im nächsten Schritt.
            </p>

            <div class="mt-5">
              <input
                ref="titleInput"
                v-model="newTitle"
                type="text"
                placeholder="z.B. China 2025"
                class="w-full rounded-2xl bg-[#0b1228]/55 border border-white/10 px-5 py-3 text-white placeholder:text-white/40
                       outline-none focus:border-fuchsia-500/50 transition"
                @keydown.enter.prevent="submitCreate()"
              />
            </div>

            <div class="mt-4">
              <TripCoverPicker @change="onCreateCoverChange" />
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <AppButton variant="secondary" size="md" @click="closeCreate()">
                <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                  Abbrechen
                </span>
              </AppButton>

              <AppButton variant="primary" size="md" @click="submitCreate()">
                <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                  Erstellen
                </span>
              </AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppButton from '@/components/AppButton.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import gemini2 from '@/assets/gemini2.png'
import { useTripStore } from '@/stores/TripStore'
import TripCoverPicker from "@/components/TripCoverPicker.vue";

defineOptions({ name: 'TripsView' })

const router = useRouter()
const isSidebarOpen = ref(false)

const tripStore = useTripStore()
const { trips, activeTripId, stops, isLoading } = storeToRefs(tripStore)

const error = ref<string | null>(null)
const q = ref('')

const filteredTrips = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return trips.value
  return trips.value.filter(t => (t.title ?? '').toLowerCase().includes(s))
})

const activeTrip = computed(() => trips.value.find(t => t.id === activeTripId.value) ?? null)
const activeStopsCount = computed(() => (activeTripId.value ? (stops.value?.length ?? 0) : 0))

async function reload() {
  error.value = null
  try {
    await tripStore.loadTrips()
  } catch (e: any) {
    console.error(e)
    error.value = e?.message ?? 'Konnte Trips nicht laden.'
  }
}

onMounted(reload)

function goDashboard() {
  router.push('/dashboard')
}

async function setActive(id: number) {
  try {
    await tripStore.selectTrip(id)
  } catch (e) {
    console.error(e)
  }
}

/** Create modal */
const createOpen = ref(false)
const newTitle = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

const createCoverUrl = ref<string | null>(null)
const createCoverPublicId = ref<string | null>(null)
// ...
function openCreate() {
  createOpen.value = true
  newTitle.value = ''
  createCoverUrl.value = null
  createCoverPublicId.value = null
  nextTick(() => titleInput.value?.focus())
}

function closeCreate() {
  createOpen.value = false
}

async function submitCreate() {
  const title = newTitle.value.trim() || 'New Trip'
  try {
    await tripStore.createTrip({
      title,
      coverUrl: createCoverUrl.value,
      coverPublicId: createCoverPublicId.value,
      coverMarkerId: null, // später optional
    })
    closeCreate()
  } catch (e: any) {
    console.error(e)
    error.value = e?.message ?? 'Konnte Trip nicht erstellen.'
  }
}

function formatDate(s?: string | null) {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleString()
  } catch {
    return String(s)
  }
}

const totalStops = computed(() =>
  trips.value.reduce((sum, t: any) => sum + Number(t.stopCount ?? 0), 0)
)

function openDetail(id: number) {
  // Option A: eigene Route (empfohlen)
  router.push(`/trips/${id}`)
  // Option B: später Modal -> dann hier state setzen statt routing
}

async function openInMap(id: number) {
  // intern den Trip-Kontext setzen (für Map), ohne UI-"aktiv" zu zeigen
  await tripStore.selectTrip(id)
  router.push('/mapview')
}

function onCreateCoverChange(p: { coverUrl: string | null; coverPublicId: string | null }) {
  createCoverUrl.value = p.coverUrl
  createCoverPublicId.value = p.coverPublicId
}

</script>

<style scoped>
/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0e162c; }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #4b5563; }

.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all .25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(8px); }
</style>

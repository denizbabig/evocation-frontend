<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col bg-[#0e162c] text-white font-sans overflow-x-hidden">
    <!-- Background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
        :style="{ backgroundImage: `url(${gemini2})` }"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
    </div>

    <!-- Grid overlay -->
    <div
      class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
      style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
    />

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
      <!-- HERO -->
      <header class="w-full text-center mb-16 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-lg mb-6">
          Dein
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>

        <p class="text-xl font-light leading-relaxed text-gray-300 mb-10 max-w-2xl mx-auto">
          Überblick über deine Welt — Stats, letzte Trips & letzte Marker.
        </p>

        <!-- Quick Actions -->
        <div class="flex flex-wrap justify-center gap-3">
          <button
            class="rounded-2xl bg-[#111a33]/85 backdrop-blur-xl border border-white/15 px-5 py-3 text-sm text-white/90
                   hover:border-white/25 hover:bg-white/10 transition"
            @click="router.push('/markers')"
          >
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent font-semibold">
              Deine Marker
            </span>
          </button>

          <button
            class="rounded-2xl bg-[#111a33]/85 backdrop-blur-xl border border-white/15 px-5 py-3 text-sm text-white/90
                   hover:border-white/25 hover:bg-white/10 transition"
            @click="router.push('/trips')"
          >
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent font-semibold">
              Deine Trips
            </span>
          </button>

          <button
            class="rounded-2xl bg-[#111a33]/85 backdrop-blur-xl border border-white/15 px-5 py-3 text-sm text-white/90
                   hover:border-white/25 hover:bg-white/10 transition"
            @click="router.push('/mapview')"
          >
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent font-semibold">
              Deine Karte
            </span>
          </button>
        </div>
      </header>

      <!-- 1) STATS ROW (Dummy) -->
      <section class="w-full mb-14">
        <div class="flex items-center justify-between mb-6 px-2">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-2 h-8 rounded-full bg-gradient-to-b from-purple-400 via-fuchsia-300 to-indigo-400"></span>
            Overview
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="s in statCards"
            :key="s.label"
            class="relative group rounded-3xl p-[1px]"
          >
            <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-70 transition duration-300">
              <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]" />
              <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]" />
            </div>

            <div class="relative rounded-3xl border border-white/10 bg-[#141c34]/60 backdrop-blur-md p-5 h-full">
              <div class="flex items-start justify-between gap-3">
                <div class="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 grid place-items-center">
                  <span class="text-lg">{{ s.icon }}</span>
                </div>

                <div class="text-right">
                  <div class="text-xs text-white/45">Stat</div>
                  <div class="text-2xl font-bold leading-tight text-white/95">
                    {{ s.value }}
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <div class="text-base font-semibold">
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    {{ s.label }}
                  </span>
                </div>
                <div class="mt-1 text-sm text-white/55">
                  {{ s.hint }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2) TRIPS ROW (Real) -->
      <section class="w-full mb-14">
        <div class="flex items-center justify-between mb-6 px-2">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-2 h-8 rounded-full bg-gradient-to-b from-purple-400 via-fuchsia-300 to-indigo-400"></span>
            Letzte Trips
          </h2>

          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-400">{{ trips.length }} Trips</div>
            <button class="text-sm text-white/65 hover:text-white transition" @click="router.push('/trips')">
              Alle anzeigen →
            </button>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="tripIsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="i in 5" :key="`t-skel-${i}`" class="h-[300px] rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
        </div>

        <!-- Empty -->
        <div
          v-else-if="recentTrips.length === 0"
          class="rounded-3xl border border-white/10 bg-[#141c34]/50 backdrop-blur-md p-8 text-white/60"
        >
          Noch keine Trips — erstelle deinen ersten.
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            v-for="t in recentTrips"
            :key="t.id"
            class="group relative h-full cursor-pointer rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1"
            @click="openTrip(t.id)"
          >
            <div
              class="absolute inset-0 rounded-3xl opacity-0 blur-[12px] transition-opacity duration-300 group-hover:opacity-70"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
            />
            <div
              class="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
            />

            <div
              class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141c34]/60 backdrop-blur-md
                     h-[300px] transition-all duration-300
                     group-hover:shadow-2xl group-hover:shadow-fuchsia-900/30"
            >
              <img
                v-if="t.coverUrl"
                :src="t.coverUrl"
                alt=""
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div v-else class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

              <div class="absolute inset-0 bg-black/15" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div class="absolute right-4 top-4 z-20">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white/95
                         bg-white/10 border border-white/15 backdrop-blur-md"
                >
                  {{ Number(t.stopCount ?? 0) }} Marker
                </span>
              </div>

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
                  <span class="text-white/35">›</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3) MARKERS ROW (Real) -->
      <section class="w-full">
        <div class="flex items-center justify-between mb-6 px-2">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-2 h-8 rounded-full bg-gradient-to-b from-purple-400 via-fuchsia-300 to-indigo-400"></span>
            Letzte Marker
          </h2>

          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-400">{{ markers.length }} Marker</div>
            <button class="text-sm text-white/65 hover:text-white transition" @click="router.push('/markers')">
              Alle anzeigen →
            </button>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="markerIsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="i in 5" :key="`m-skel-${i}`" class="h-[300px] rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
        </div>

        <!-- Empty -->
        <div
          v-else-if="recentMarkers.length === 0"
          class="rounded-3xl border border-white/10 bg-[#141c34]/50 backdrop-blur-md p-8 text-white/60"
        >
          Noch keine Marker — leg los.
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            v-for="m in recentMarkers"
            :key="m.id"
            class="group relative h-full cursor-pointer rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1"
            @click="router.push('/markers')"
          >
            <div
              class="absolute inset-0 rounded-3xl opacity-0 blur-[12px] transition-opacity duration-300 group-hover:opacity-70"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
            />
            <div
              class="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
            />

            <div
              class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141c34]/60 backdrop-blur-md
                     h-[300px] transition-all duration-300
                     group-hover:shadow-2xl group-hover:shadow-fuchsia-900/30"
            >
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

              <div v-else class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

              <div class="absolute inset-0 bg-black/15" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div class="absolute right-4 top-4 z-20">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white/95
                         bg-white/10 border border-white/15 backdrop-blur-md"
                >
                  {{ daysAgoLabel(m.occurredAt ?? m.startDate ?? null) }}
                </span>
              </div>

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
        </div>
      </section>
    </main>

    <span class="relative z-20 w-full mt-auto py-6 text-center text-xs text-gray-500">
      &copy; 2025 Evocation Systems. All rights reserved.
    </span>

    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import gemini2 from '@/assets/gemini2.png'
import { apiFetch } from '@/lib/api'
import { useTripStore } from '@/stores/TripStore'
import { useMarkerStore } from '@/stores/MarkerStore'
import { markerCover } from '@/lib/markerImages'

defineOptions({ name: 'DashboardHomeView' })

const router = useRouter()
const isSidebarOpen = ref(false)

/** Dummy Stats (nur das bleibt “dumm”) */
type DashboardStats = {
  markerCount?: number
  markersThisYear?: number
  totalDistanceKm?: number
  favoriteCountry?: string
}

const statsLoading = ref(false)
const statsError = ref<string | null>(null)
const apiStats = ref<DashboardStats | null>(null)

function thisYearFromMarker(m: any) {
  const d = m?.occurredAt ?? m?.startDate ?? null
  if (!d) return false
  const y = Number(String(d).slice(0, 4))
  return y === new Date().getFullYear()
}

function formatKm(v?: number | null) {
  if (v == null || !Number.isFinite(v)) return '—'
  // nice dashboard style: keine Nachkommastellen
  return `${Math.round(v).toLocaleString('de-DE')} km`
}

const markerCountFallback = computed(() => (markers.value ?? []).length)
const markersThisYearFallback = computed(
  () => (markers.value ?? []).filter(thisYearFromMarker).length
)

/** 4 Stats: Marker, Distanz, Dieses Jahr, Lieblingsland */
const statCards = computed(() => {
  const markerCount = apiStats.value?.markerCount ?? markerCountFallback.value
  const markersThisYear = apiStats.value?.markersThisYear ?? markersThisYearFallback.value

  const distanceLabel =
    apiStats.value?.totalDistanceKm != null ? formatKm(apiStats.value.totalDistanceKm) : '—'

  const favorite =
    (apiStats.value?.favoriteCountry && apiStats.value.favoriteCountry.trim()) ? apiStats.value.favoriteCountry : '—'

  return [
    { label: 'Marker', value: String(markerCount ?? 0), hint: 'Anzahl deiner Marker', icon: '📍' },
    { label: 'Distanz', value: distanceLabel, hint: 'Summe aller Trip-Strecken', icon: '🛰️' },
    { label: 'Dieses Jahr', value: String(markersThisYear ?? 0), hint: 'Marker in diesem Jahr', icon: '✨' },
    { label: 'Lieblingsland', value: favorite, hint: 'Land mit den meisten Markern', icon: '🌍' },
  ]
})

/** Stores */
const tripStore = useTripStore()
const markerStore = useMarkerStore()

const { trips, isLoading: tripIsLoading } = storeToRefs(tripStore)
const { markers, isLoading: markerIsLoading } = storeToRefs(markerStore)

onMounted(async () => {
  try {
    // Trips + Marker “echt” laden
    if (!trips.value.length) await tripStore.loadTrips()
    if (!markers.value.length) await markerStore.loadMarkers()

    // Stats (Backend) – fällt automatisch auf Store-Fallback zurück, wenn es nicht klappt
    statsLoading.value = true
    statsError.value = null
    try {
      const data = await apiFetch('/dashboard')
      apiStats.value = data?.stats ?? null
    } catch (e: any) {
      statsError.value = e?.message ?? 'Failed to load dashboard stats'
      apiStats.value = null
    } finally {
      statsLoading.value = false
    }

  } catch (e) {
    console.error('[Dashboard] load failed', e)
  }
})

/** Sort helper (desc) */
function ts(v?: string | null) {
  if (!v) return 0
  const t = Date.parse(String(v))
  return Number.isFinite(t) ? t : 0
}

/** 5 letzte Trips (prefer createdAt; fallback id) */
const recentTrips = computed(() => {
  return [...(trips.value ?? [])]
    .sort((a: any, b: any) => ts(b.createdAt) - ts(a.createdAt) || Number(b.id) - Number(a.id))
    .slice(0, 5)
})

/** 5 letzte Marker (prefer occurredAt/startDate; fallback createdAt/id) */
const recentMarkers = computed(() => {
  return [...(markers.value ?? [])]
    .sort((a: any, b: any) => {
      const da = ts(b.occurredAt ?? b.startDate ?? b.createdAt)
      const db = ts(a.occurredAt ?? a.startDate ?? a.createdAt)
      return da - db || Number(b.id) - Number(a.id)
    })
    .slice(0, 5)
})

function openTrip(id: number) {
  router.push(`/trips/${id}`)
}

function formatDate(s?: string | null) {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleString()
  } catch {
    return String(s)
  }
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
</script>

<style scoped>
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0e162c; }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #4b5563; }
</style>

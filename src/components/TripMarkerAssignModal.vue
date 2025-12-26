<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1500] flex items-center justify-center px-6 py-10"
        @click="busy ? null : emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/65 backdrop-blur-md"></div>
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.18),_rgba(14,22,44,0.92)_65%,_rgba(0,0,0,0.95))]"
        />

        <!-- Modal -->
        <div
          class="relative z-20 w-full max-w-[1240px] pointer-events-auto"
          @click.stop
          role="dialog"
          aria-modal="true"
        >
          <!-- Glow shell -->
          <div class="relative isolate rounded-[28px] p-[1px]">
            <div class="pointer-events-none absolute -inset-[1px] rounded-[28px] opacity-45">
              <div
                class="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]"
              />
              <div
                class="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
              />
              <div class="absolute inset-[1px] rounded-[26px] bg-[#0e162c]" />
            </div>

            <!-- Card -->
            <div
              class="relative rounded-[28px] bg-[#0b1228]/75 border border-white/10 ring-1 ring-white/5
                     backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-900/30
                     max-h-[82dvh] flex flex-col"
            >
              <!-- Header -->
              <div class="px-8 pt-7 pb-5 border-b border-white/10">
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <div class="text-lg font-bold">
                      <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                        Marker zuordnen
                      </span>
                      <span class="text-white/40 font-semibold text-sm ml-2">
                        (Trip: {{ currentTripTitle || `#${currentTripId}` }})
                      </span>
                    </div>

                    <div class="mt-1 text-sm text-white/55 max-w-3xl">
                      Freie Marker hinzufügen oder Marker aus anderen Trips übernehmen.
                    </div>
                  </div>

                  <button
                    type="button"
                    class="h-11 w-11 rounded-2xl bg-[#111a33]/70 border border-white/10
                           hover:bg-white/10 hover:border-white/20 transition grid place-items-center disabled:opacity-50"
                    :disabled="busy"
                    @click="emit('close')"
                    aria-label="Schließen"
                    title="Schließen"
                  >
                    ✕
                  </button>
                </div>

                <!-- Mode toggle -->
                <div class="mt-5 flex gap-2 rounded-2xl bg-white/5 border border-white/10 p-1">
                  <button
                    type="button"
                    class="flex-1 h-10 rounded-xl text-sm font-semibold transition"
                    :class="mode==='free' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'"
                    :disabled="busy"
                    @click="mode='free'"
                  >
                    Freie Marker <span class="ml-2 text-xs text-white/50">({{ freeMarkers.length }})</span>
                  </button>
                  <button
                    type="button"
                    class="flex-1 h-10 rounded-xl text-sm font-semibold transition"
                    :class="mode==='reassign' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'"
                    :disabled="busy"
                    @click="mode='reassign'"
                  >
                    Aus anderen Trips <span class="ml-2 text-xs text-white/50">({{ otherTripMarkers.length }})</span>
                  </button>
                </div>

                <!-- Search -->
                <div class="mt-4 relative group isolate">
                  <!-- glow -->
                  <div
                    class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0
                           group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"
                  >
                    <div
                      class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]"
                    />
                    <div
                      class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
                    />
                    <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                  </div>

                  <input
                    v-model="q"
                    placeholder="Suche nach Titel/Notiz/Place…"
                    class="relative z-10 w-full rounded-2xl bg-[#0b1228]/55 border border-white/10 px-5 py-3 text-white placeholder:text-white/40
                           outline-none focus:border-fuchsia-500/50 transition
                           shadow-lg shadow-purple-900/10 hover:shadow-purple-900/25"
                    :disabled="busy"
                  />
                </div>

                <div v-if="mode==='reassign'" class="mt-3 text-xs text-white/55">
                  ⚠️ Beim Übernehmen wird der Marker aus seinem aktuellen Trip entfernt und diesem Trip hinzugefügt.
                </div>

                <!-- Error -->
                <div
                  v-if="error"
                  class="mt-4 rounded-2xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200"
                >
                  {{ error }}
                </div>
              </div>

              <!-- Content -->
              <div class="px-8 py-7 overflow-y-auto">
                <!-- responsive grid: auto-fill minmax(240px,1fr) -->
                <div
                  class="grid gap-x-10 gap-y-10
                         grid-cols-[repeat(auto-fill,minmax(260px,1fr))]"
                >
                  <div
                    v-for="m in visibleMarkers"
                    :key="m.id"
                    class="justify-self-center w-full max-w-[260px]"
                  >
                    <!-- Outer shell (Glow + Scale on hover) -->
                    <div
                      class="group relative rounded-[22px] p-[1px] transition-all duration-300
           hover:-translate-y-1"
                    >
                      <!-- Gradient border + glow (outside, visible) -->
                      <div
                        class="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 blur-[12px]
             transition-opacity duration-300 group-hover:opacity-70"
                        style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
                      />
                      <div
                        class="pointer-events-none absolute inset-0 rounded-[22px] opacity-0
             transition-opacity duration-300 group-hover:opacity-100"
                        style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
                      />

                      <!-- Card surface -->
                      <div
                        class="relative h-[360px] overflow-hidden rounded-[22px]
             border border-white/10 bg-[#141c34]/60 backdrop-blur-md
             transition-all duration-300
             group-hover:scale-[1.02]
             group-hover:shadow-2xl group-hover:shadow-fuchsia-900/30
             group-hover:border-white/20"
                      >
                        <!-- Media (image/video) -->
                        <video
                          v-if="markerCoverSrc(m.id) && isVideoUrl(markerCoverSrc(m.id)!)"
                          :src="markerCoverSrc(m.id)!"
                          class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                          muted
                          playsinline
                          preload="metadata"
                          loop
                        />
                        <img
                          v-else-if="markerCoverSrc(m.id)"
                          :src="markerCoverSrc(m.id)!"
                          alt=""
                          class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                          loading="lazy"
                          draggable="false"
                        />
                        <div v-else class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

                        <!-- Depth -->
                        <div class="absolute inset-0 bg-black/15" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <!-- Trip pill (nur Step 2) -->
                        <div
                          v-if="mode==='reassign' && tripLabelForMarker(m.id) && !isInCurrentTrip(m.id)"
                          class="absolute left-4 top-4 z-20 max-w-[150px]"
                        >
        <span
          class="block rounded-full px-3 py-1 text-xs font-semibold bg-white/10 border border-white/15 backdrop-blur-md truncate"
          :title="`Trip: ${tripLabelForMarker(m.id)}`"
        >
          Trip: {{ tripLabelForMarker(m.id) }}
        </span>
                        </div>

                        <!-- Action (oben rechts, kollisionsfrei) -->
                        <div class="absolute right-4 top-4 z-20">
                          <AppButton
                            v-if="mode==='free'"
                            variant="primary"
                            size="md"
                            class="h-10 px-4"
                            :disabled="busy || isInCurrentTrip(m.id)"
                            @click="addToCurrentTrip(m.id)"
                          >
          <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
            {{ lastTouchedId === m.id ? '✓ Added' : '+ Add' }}
          </span>
                          </AppButton>

                          <AppButton
                            v-else
                            variant="primary"
                            size="md"
                            class="h-10 px-4"
                            :disabled="busy || isInCurrentTrip(m.id) || !markerTripId(m.id)"
                            @click="reassignToCurrentTrip(m.id)"
                          >
          <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
            {{ lastTouchedId === m.id ? '✓ Übernommen' : 'Übernehmen' }}
          </span>
                          </AppButton>
                        </div>

                        <!-- Bottom text -->
                        <div class="absolute left-0 bottom-0 z-20 w-full p-5">
                          <div
                            class="text-lg font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm transition-all duration-300
                 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-fuchsia-300 group-hover:to-indigo-400
                 group-hover:bg-clip-text group-hover:text-transparent"
                          >
                            {{ m.title || 'Ohne Titel' }}
                          </div>

                          <div
                            class="mt-1 text-sm text-white/70 line-clamp-1 transition-all duration-300
                 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-fuchsia-300 group-hover:to-indigo-400
                 group-hover:bg-clip-text group-hover:text-transparent"
                          >
                            {{ m.placeName || '' }}
                          </div>

                          <div v-if="isInCurrentTrip(m.id)" class="mt-2 text-[11px] text-white/55">
                            Bereits in diesem Trip
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="visibleMarkers.length === 0" class="text-white/60 text-sm mt-6 text-center">
                  Keine passenden Marker gefunden.
                </div>
              </div>

              <!-- Footer -->
              <div class="px-8 py-6 border-t border-white/10 flex items-center justify-between">
                <AppButton :disabled="busy" variant="secondary" size="md" @click="emit('close')">
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Schließen
                  </span>
                </AppButton>

                <div class="text-xs text-white/45">
                  Tipp: Suche nutzen, dann schnell mehrere Marker hinzufügen.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AppButton from '@/components/AppButton.vue'
import { useTripStore } from '@/stores/TripStore'
import { useMarkerStore } from '@/stores/MarkerStore'
import { markerCover } from '@/lib/markerImages'
import { apiFetch } from '@/lib/api'

type MarkerLite = {
  id: number
  title?: string | null
  description?: string | null
  placeName?: string | null
}

const props = withDefaults(defineProps<{
  open: boolean
  currentTripId: number
  currentTripTitle?: string | null
  externalBusy?: boolean
}>(), {
  currentTripTitle: null,
  externalBusy: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'added'): void
}>()

const tripStore = useTripStore()
const markerStore = useMarkerStore()

const { trips, stops } = storeToRefs(tripStore)
const { markers } = storeToRefs(markerStore)

const mode = ref<'free' | 'reassign'>('free')
const q = ref('')
const error = ref<string | null>(null)
const working = ref(false)
const lastTouchedId = ref<number | null>(null)

const busy = computed(() => working.value || !!props.externalBusy)

/** ✅ Backend-Wahrheit: welche Marker sind in IRGENDEINEM Trip zugeordnet */
const assignedIds = ref<Set<number>>(new Set())

async function loadAssignedIds() {
  const ids = await apiFetch('/trips/assigned-marker-ids') as number[]
  assignedIds.value = new Set((ids ?? []).map(Number))
}

/** membership im current trip (über stops) */
const markerIdsInCurrentTrip = computed(() => new Set((stops.value ?? []).map(s => Number(s.markerId))))
function isInCurrentTrip(markerId: number) {
  return markerIdsInCurrentTrip.value.has(Number(markerId))
}

/**
 * ⚠️ Step 2: Trip-Label "best effort" (weil Marker->Trip Mapping fehlt)
 * Wenn du später ein API `marker-assignments` hast, tauschen wir das sauber aus.
 */
function markerTripId(markerId: number): number | null {
  const m: any = markers.value.find((x: any) => Number(x.id) === Number(markerId))
  const tid = m?.tripId ?? m?.assignedTripId ?? null
  return tid ? Number(tid) : null
}

function tripTitleById(id: number | null) {
  if (!id) return null
  return (trips.value ?? []).find(t => Number(t.id) === Number(id))?.title ?? `Trip ${id}`
}

function tripLabelForMarker(markerId: number) {
  if (isInCurrentTrip(markerId)) return props.currentTripTitle || `#${props.currentTripId}`
  const tid = markerTripId(markerId)
  return tid ? tripTitleById(tid) : null
}

/** ✅ FIX: "Freie Marker" = NICHT in assignedIds (=> auch nicht im current trip) */
const freeMarkers = computed(() => {
  return (markers.value as any as MarkerLite[])
    .filter(m => !assignedIds.value.has(Number(m.id)))
})

/** Step 2 bleibt wie gehabt (best effort via markerTripId) */
const otherTripMarkers = computed(() => {
  return (markers.value as any as MarkerLite[])
    .filter(m => {
      const tid = markerTripId(Number(m.id))
      return !!tid && Number(tid) !== Number(props.currentTripId)
    })
})

const baseList = computed(() => (mode.value === 'free' ? freeMarkers.value : otherTripMarkers.value))

const visibleMarkers = computed(() => {
  const s = q.value.trim().toLowerCase()
  const list = baseList.value

  if (!s) return list

  return list.filter(m => {
    const t = (m.title ?? '').toLowerCase()
    const d = (m.description ?? '').toLowerCase()
    const p = (m.placeName ?? '').toLowerCase()
    return t.includes(s) || d.includes(s) || p.includes(s)
  })
})

async function addToCurrentTrip(markerId: number) {
  if (busy.value) return
  error.value = null
  working.value = true
  try {
    await tripStore.addStop(markerId)

    // ✅ refresh, damit der Marker sofort aus "Freie Marker" verschwindet
    await loadAssignedIds()
    if (tripStore.activeTripId) await tripStore.loadStops?.(tripStore.activeTripId)

    lastTouchedId.value = markerId
    setTimeout(() => { if (lastTouchedId.value === markerId) lastTouchedId.value = null }, 900)
    emit('added')
  } catch (e: any) {
    error.value = 'Konnte Marker nicht hinzufügen.'
  } finally {
    working.value = false
  }
}

async function reassignToCurrentTrip(markerId: number) {
  if (busy.value) return
  error.value = null
  working.value = true
  try {
    const fromTripId = markerTripId(markerId)
    if (fromTripId) {
      const prev = tripStore.activeTripId
      await tripStore.selectTrip(fromTripId)
      await tripStore.removeStop(markerId)

      await tripStore.selectTrip(props.currentTripId)
      void prev
    }

    await tripStore.addStop(markerId)

    // ✅ refresh assignment truth
    await loadAssignedIds()
    if (tripStore.activeTripId) await tripStore.loadStops?.(tripStore.activeTripId)

    lastTouchedId.value = markerId
    setTimeout(() => { if (lastTouchedId.value === markerId) lastTouchedId.value = null }, 900)
    emit('added')
  } catch (e: any) {
    error.value = 'Konnte Marker nicht übernehmen.'
  } finally {
    working.value = false
  }
}

watch(
  () => props.open,
  async (o) => {
    if (!o) return
    error.value = null
    q.value = ''
    mode.value = 'free'

    if (!trips.value?.length) await tripStore.loadTrips?.()
    if (!markers.value?.length) await markerStore.loadMarkers?.()

    // ✅ Wichtig: assignedIds laden (Backend-Wahrheit)
    await loadAssignedIds()

    // current trip stops laden (für "Bereits in diesem Trip")
    await tripStore.selectTrip(props.currentTripId)
  },
  { immediate: true }
)

function markerCoverSrc(markerId: number): string | null {
  const m = markers.value.find((x: any) => Number(x.id) === Number(markerId))
  if (!m) return null
  try {
    const c = markerCover(m)
    return (c?.card ?? c?.thumb ?? null) as any
  } catch {
    return null
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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

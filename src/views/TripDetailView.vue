<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col bg-[#0e162c] text-white font-sans overflow-x-hidden">
    <!-- Background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
           :style="{ backgroundImage: `url(${gemini2})` }" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
    </div>

    <!-- Grid -->
    <div class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
         style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;" />

    <!-- NAV -->
    <nav class="absolute top-0 left-0 w-full z-40 flex items-center justify-start p-6 md:px-12">
      <div class="flex items-center gap-6">
        <button
          @click="goBack"
          class="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition duration-200"
          aria-label="Zurück"
        >
          ←
        </button>

        <div class="flex items-center gap-2 select-none cursor-pointer" @click="$router.push('/dashboard')">
          <span class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Evocation
          </span>
        </div>
      </div>
    </nav>

    <main class="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
      <header class="w-full max-w-5xl mx-auto mb-10">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-tight">

              <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                {{ activeTrip?.title ?? '—' }}
              </span>
            </h1>
            <p class="text-white/60 mt-3 text-base md:text-lg max-w-2xl">
              Marker hinzufügen, Reihenfolge ändern, Route in der Map anzeigen.
            </p>

            <div class="mt-5 flex flex-wrap gap-3">
              <div class="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-sm text-white/80">
                <span class="text-white/50 mr-2">Marker</span>
                <span class="font-semibold text-white">{{ stopsSorted.length }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-3 md:justify-end">
            <AppButton variant="secondary" size="md" @click="openInMap" class="w-full sm:w-auto">
              <span class="whitespace-nowrap bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                In Map öffnen
              </span>
            </AppButton>

            <AppButton variant="primary" size="md" @click="openAddModal()" class="w-full sm:w-auto">
  <span class="whitespace-nowrap bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
    + Marker hinzufügen
  </span>
            </AppButton>
          </div>
        </div>
      </header>

      <!-- Layout -->
      <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Stops -->
        <section class="lg:col-span-2 relative isolate rounded-3xl p-[1px]">
          <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-40">
            <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[14px]" />
            <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]/70" />
          </div>

          <div class="relative rounded-3xl border border-white/12 bg-[#141c34]/60 backdrop-blur-md p-6">
            <h2 class="text-xl font-bold mb-4">Stops</h2>

            <div v-if="stopsSorted.length === 0" class="text-white/60">
              Noch keine Marker im Trip. Klicke auf „Marker hinzufügen“.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(s, idx) in stopsSorted"
                :key="s.markerId"
                class="flex items-center justify-between gap-3 rounded-2xl bg-black/20 border border-white/10 px-4 py-3"
              >
                <div class="min-w-0">
                  <div class="text-sm text-white/50">#{{ idx + 1 }}</div>
                  <div class="font-semibold truncate">
                    {{ markerById(s.markerId)?.title ?? `Marker ${s.markerId}` }}
                  </div>
                  <div class="text-xs text-white/50 truncate">
                    {{ markerById(s.markerId)?.placeName ?? '' }}
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    class="h-10 w-10 rounded-2xl bg-black/30 border border-white/15 hover:bg-black/45 hover:border-white/25 transition"
                    :disabled="idx === 0"
                    @click="move(idx, -1)"
                    title="Nach oben"
                  >↑</button>

                  <button
                    class="h-10 w-10 rounded-2xl bg-black/30 border border-white/15 hover:bg-black/45 hover:border-white/25 transition"
                    :disabled="idx === stopsSorted.length - 1"
                    @click="move(idx, +1)"
                    title="Nach unten"
                  >↓</button>

                  <button
                    class="h-10 w-10 rounded-2xl bg-black/30 border border-white/15 hover:bg-black/45 hover:border-white/25 transition"
                    @click="remove(s.markerId)"
                    title="Entfernen"
                  >🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Side panel: quick info + search -->
        <aside class="relative rounded-3xl border border-white/12 bg-[#141c34]/60 backdrop-blur-md p-6 h-fit">
          <h3 class="text-lg font-bold">Schnellaktionen</h3>
          <p class="text-white/60 text-sm mt-2">
            Tipp: In der Map kannst du im „Route-Mode“ Marker direkt zum Trip hinzufügen.
          </p>

          <div class="mt-5">
            <AppButton variant="secondary" size="md" class="w-full" @click="$router.push('/trips')">
              <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                Zurück zur Liste
              </span>
            </AppButton>
          </div>
          <div class="mt-4">
            <AppButton variant="secondary" size="md" class="w-full" @click="editCoverOpen = true">
    <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
      Cover ändern
    </span>
            </AppButton>

            <AppButton variant="secondary" size="md" class="w-full mt-3" @click="onDeleteTrip">
    <span class="text-red-300">
      Trip löschen
    </span>
            </AppButton>
          </div>

          <Teleport to="body">
            <Transition name="fade">
              <div v-if="editCoverOpen" class="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm" @click="editCoverOpen=false" />
            </Transition>

            <Transition name="fade-slide">
              <div v-if="editCoverOpen" class="fixed inset-0 z-[1201] flex items-center justify-center p-4 pointer-events-none">
                <div class="pointer-events-auto w-full max-w-xl rounded-3xl border border-white/12 bg-[#141c34]/85 backdrop-blur-md p-7" @click.stop>
                  <div class="flex items-start justify-between">
                    <div class="text-lg font-bold">Trip Cover</div>
                    <button class="text-gray-300 hover:text-white" @click="editCoverOpen=false">✕</button>
                  </div>

                  <TripCoverPicker
                    :initialCoverUrl="activeTrip?.coverUrl ?? null"
                    :initialCoverPublicId="activeTrip?.coverPublicId ?? null"
                    @change="onCoverPicked"
                  />

                  <div class="mt-6 flex justify-end">
                    <AppButton variant="secondary" size="md" @click="editCoverOpen=false">
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Schließen
            </span>
                    </AppButton>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </aside>
      </div>
    </main>

    <!-- Add Marker Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="addOpen" class="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm" @click="addOpen = false" />
      </Transition>

      <Transition name="fade-slide">
        <div v-if="addOpen" class="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
          <div class="pointer-events-auto w-full max-w-2xl rounded-3xl border border-white/12 bg-[#141c34]/85 backdrop-blur-md p-7">
            <div class="flex items-start justify-between gap-4">
              <h3 class="text-2xl font-bold tracking-tight">
                <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                  Marker hinzufügen
                </span>
              </h3>
              <button @click="addOpen = false" class="text-gray-300 hover:text-white transition">✕</button>
            </div>

            <div class="mt-4 relative">
              <input
                v-model="mq"
                placeholder="Suche nach Titel/Notiz/Place…"
                class="w-full rounded-2xl bg-[#0b1228]/55 border border-white/10 px-5 py-3 text-white placeholder:text-white/40
                       outline-none focus:border-fuchsia-500/50 transition"
              />
            </div>

            <div v-if="addError" class="mt-4 rounded-2xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200">
              {{ addError }}
            </div>

            <div class="mt-5 max-h-[55vh] overflow-auto space-y-2 pr-1">
              <div
                v-for="m in filteredMarkersToAdd"
                :key="m.id"
                class="flex items-center justify-between gap-3 rounded-2xl bg-black/20 border border-white/10 px-4 py-3"
              >
                <div class="min-w-0">
                  <div class="font-semibold truncate">{{ m.title || 'Ohne Titel' }}</div>
                  <div class="text-xs text-white/50 truncate">{{ m.placeName || '' }}</div>
                </div>

                <AppButton variant="primary" size="md" @click="add(m.id)">
  <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
    {{ lastAddedId === m.id ? '✓ Added' : '+ Add' }}
  </span>
                </AppButton>
              </div>

              <div v-if="filteredMarkersToAdd.length === 0" class="text-white/60 text-sm">
                Keine Marker gefunden (oder alle sind schon zugeordnet).
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <AppButton variant="secondary" size="md" @click="addOpen = false">
                <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                  Schließen
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
import {computed, onMounted, ref, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppButton from '@/components/AppButton.vue'
import gemini2 from '@/assets/gemini2.png'
import { useTripStore } from '@/stores/TripStore'
import { useMarkerStore } from '@/stores/MarkerStore'
import { apiFetch } from '@/lib/api'

defineOptions({ name: 'TripDetailView' })

const router = useRouter()
const route = useRoute()

const tripStore = useTripStore()
const { trips, stops, activeTripId } = storeToRefs(tripStore)

const markerStore = useMarkerStore()
const { markers } = storeToRefs(markerStore)

const tripId = computed(() => Number(route.params.id))

const activeTrip = computed(() => trips.value.find(t => Number(t.id) === Number(tripId.value)) ?? null)
const stopsSorted = computed(() => [...(stops.value ?? [])].sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)))

function markerById(id: number) {
  return markers.value.find(m => Number(m.id) === Number(id)) ?? null
}

onMounted(async () => {
  await tripStore.selectTrip(tripId.value)
  if (!markers.value.length) await markerStore.loadMarkers()
  await loadAssignedIds()
})

function goBack() {
  router.back()
}

async function openInMap() {
  // activeTrip ist eh gesetzt – einfach zur Map
  router.push('/mapview')
}

async function remove(markerId: number) {
  await tripStore.removeStop(markerId)
}

async function move(index: number, dir: -1 | 1) {
  const list = [...stopsSorted.value]
  const j = index + dir
  if (j < 0 || j >= list.length) return
  const tmp = list[index]
  list[index] = list[j]
  list[j] = tmp

  const markerIdsInOrder = list.map(x => x.markerId)
  await tripStore.reorder(markerIdsInOrder)
}

/** Add modal */
const addOpen = ref(false)
const mq = ref('')
const addError = ref<string | null>(null)

const markerIdsInTrip = computed(() => new Set(stopsSorted.value.map(s => Number(s.markerId))))

const filteredMarkersToAdd = computed(() => {
  const q = mq.value.trim().toLowerCase()

  return markers.value
    // 1) nicht im aktuellen Trip
    .filter(m => !markerIdsInTrip.value.has(Number(m.id)))
    // 2) nicht in irgendeinem Trip (Backend-Regel)
    .filter(m => !assignedIds.value.has(Number(m.id)))
    // 3) Suche
    .filter(m => {
      if (!q) return true
      return (
        (m.title ?? '').toLowerCase().includes(q) ||
        (m.description ?? '').toLowerCase().includes(q) ||
        (m.placeName ?? '').toLowerCase().includes(q)
      )
    })
})

const lastAddedId = ref<number | null>(null)

async function add(markerId: number) {
  addError.value = null
  try {
    await tripStore.addStop(markerId)

    // wichtig: Daten refreshen, damit der Marker sofort aus der Liste verschwindet
    await loadAssignedIds()
    if (tripStore.activeTripId) await tripStore.loadStops(tripStore.activeTripId)

    // Mini-Feedback (optional)
    lastAddedId.value = markerId
    setTimeout(() => {
      if (lastAddedId.value === markerId) lastAddedId.value = null
    }, 900)

    // Modal bleibt offen ✅
    // mq.value bleibt wie es ist (damit man schnell mehrere aus einem Suchbegriff adden kann)
  } catch (e: any) {
    const msg = String(e?.message ?? e)
    if (msg.includes('409') || msg.includes('already assigned')) {
      addError.value = 'Dieser Marker ist bereits in einem anderen Trip.'
    } else {
      addError.value = 'Konnte Marker nicht hinzufügen.'
    }
  }
}
const assignedIds = ref<Set<number>>(new Set())

async function loadAssignedIds() {
  const ids = await apiFetch('/trips/assigned-marker-ids') as number[]
  assignedIds.value = new Set((ids ?? []).map(Number))
}

async function openAddModal() {
  addError.value = null
  addOpen.value = true
  await loadAssignedIds()
}

import TripCoverPicker from '@/components/TripCoverPicker.vue'

const editCoverOpen = ref(false)

async function onCoverPicked(p: { coverUrl: string | null; coverPublicId: string | null }) {
  if (!activeTrip.value) return
  await tripStore.updateTrip(activeTrip.value.id, {
    coverUrl: p.coverUrl,
    coverPublicId: p.coverPublicId,
    coverMarkerId: null,
  })
}

async function onDeleteTrip() {
  if (!activeTrip.value) return
  await tripStore.deleteTrip(activeTrip.value.id)
  router.push('/trips')
}

const coverModalKey = ref(0)

watch(editCoverOpen, (o) => {
  if (o) coverModalKey.value++
})

</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all .25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(8px); }
</style>

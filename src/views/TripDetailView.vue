<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col bg-[#0e162c] text-white font-sans overflow-x-hidden">

    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Background -->
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

    <!-- Grid -->
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

    <main class="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
      <header class="w-full max-w-6xl mx-auto mb-8">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                {{ tripTitle }}
              </span>
            </h1>


            <div class="mt-5 flex flex-wrap gap-3">
              <div class="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-sm text-white/80">
                <span class="text-white/50 mr-2">Marker</span>
                <span class="font-semibold text-white">{{ stopsSorted.length }}</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Quick actions -->
        <section class="relative isolate rounded-3xl p-[1px]">
          <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-35">
            <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[14px]" />
            <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]/70" />
          </div>

          <div class="relative rounded-3xl border border-white/12 bg-[#141c34]/60 backdrop-blur-md p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">



              <div class="flex flex-col sm:flex-row flex-wrap gap-3 w-full justify-center">


                <AppButton variant="secondary" size="md" class="w-full sm:w-auto" @click="$router.push('/trips')">
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Zurück zur Liste
                  </span>
                </AppButton>

                <AppButton variant="secondary" size="md" @click="openAddModal()" class="w-full sm:w-auto">
              <span class="whitespace-nowrap bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                Marker hinzufügen
              </span>
                </AppButton>

                <AppButton variant="secondary" size="md" @click="openInMap" class="w-full sm:w-auto">
              <span class="whitespace-nowrap bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                In Map öffnen
              </span>
                </AppButton>


                <AppButton variant="secondary" size="md" class="w-full sm:w-auto" @click="editCoverOpen = true">
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Trip bearbeiten
                  </span>
                </AppButton>

                <AppButton variant="secondary" size="md" class="w-full sm:w-auto" @click="onDeleteTrip">
                  <span class="text-red-300">Trip löschen</span>
                </AppButton>
              </div>
            </div>

            <!-- Cover Modal -->
            <Teleport to="body">
              <Transition name="fade">
                <div
                  v-if="editCoverOpen"
                  class="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm"
                  @click="editCoverOpen=false"
                />
              </Transition>

              <Transition name="fade-slide">
                <div v-if="editCoverOpen" class="fixed inset-0 z-[1201] flex items-center justify-center p-4 pointer-events-none">
                  <div
                    class="pointer-events-auto w-full max-w-xl rounded-3xl border border-white/12 bg-[#141c34]/85 backdrop-blur-md p-7"
                    @click.stop
                  >
                    <div class="flex items-start justify-between">
                      <div class="text-lg font-bold">Trip Cover</div>
                      <button class="text-gray-300 hover:text-white" @click="editCoverOpen=false">✕</button>
                    </div>

                    <TripEditModal
                      :key="coverModalKey"
                      :open="editCoverOpen"
                      :initialTitle="activeTrip?.title ?? ''"
                      :initialCoverUrl="activeTrip?.coverUrl ?? null"
                      :initialCoverPublicId="activeTrip?.coverPublicId ?? null"
                      :initialVisibility="activeTrip?.visibility ?? 'PRIVATE'"
                      @close="editCoverOpen = false"
                      @change="onTripEdit"
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
          </div>
        </section>

        <!-- Stops -->
        <section class="relative isolate rounded-3xl p-[1px]">
          <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-40">
            <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[14px]" />
            <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]/70" />
          </div>

          <div class="relative rounded-3xl border border-white/12 bg-[#141c34]/60 backdrop-blur-md p-6">
            <div class="flex items-center justify-between gap-4">
              <h2 class="text-xl font-bold">Stops</h2>

              <div class="text-sm text-white/55 hidden md:block">
                <span class="font-semibold text-white/75">Tipp:</span> Zieh die Cards per Drag & Drop, um die Reihenfolge zu ändern.
              </div>
            </div>

            <div v-if="stopsSorted.length === 0" class="text-white/60 mt-4">
              Noch keine Marker im Trip. Klicke auf „Marker hinzufügen“.
            </div>

            <div v-else class="mt-5">
              <div class="relative">
                <div
                  ref="stopsScrollEl"
                  class="flex gap-8 overflow-x-auto overflow-y-visible pl-4 pt-4 pb-10 pr-20 scroll-smooth evoc-scroll"
                  @scroll="onStopsScroll"
                >
                  <!-- ✅ Stop Cards mit gleichem Glow/Shadow wie MarkerView -->
                  <div
                    v-for="(s, idx) in stopsUi"
                    :key="s.markerId"
                    class="group relative shrink-0 w-[240px] h-[360px] cursor-pointer rounded-[22px] p-[1px]
                           transition-all duration-300 will-change-transform origin-center
                           hover:scale-[1.03]"
                    :class="[
                      stopDraggingIndex === idx ? 'opacity-80' : '',
                      isStopDragging && stopDraggingIndex !== idx ? 'border-white/15' : '',
                      isStopDragging && stopDragOverIndex === idx && stopDraggingIndex !== idx ? 'scale-[1.04]' : ''
                    ]"
                    draggable="true"
                    @click="isStopDragging ? null : openMarkerStory(s.markerId)"
                    @dragstart="onStopDragStart(idx)"
                    @dragenter.prevent="onStopDragEnter(idx)"
                    @dragover.prevent
                    @drop.prevent="onStopDrop(idx)"
                    @dragend="onStopDragEnd"
                  >
                    <!-- Gradient Border + Glow (1:1 wie Marker Cards) -->
                    <div
                      class="absolute inset-0 rounded-[22px] opacity-0 blur-[12px] transition-opacity duration-300 group-hover:opacity-70"
                      style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
                    />
                    <div
                      class="absolute inset-0 rounded-[22px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
                    />

                    <!-- Card Surface -->
                    <div
                      class="relative h-full w-full rounded-[22px] overflow-hidden bg-white/5 border border-white/10
                             transition-all duration-300
                             group-hover:shadow-2xl group-hover:shadow-fuchsia-900/30
                             cursor-grab active:cursor-grabbing"
                    >
                      <!-- (A) Drag-Mode: dashed Gradient-Border -->
                      <svg
                        v-if="isStopDragging && stopDraggingIndex !== idx"
                        class="pointer-events-none absolute inset-0 z-[5] opacity-80"
                        width="240"
                        height="360"
                        viewBox="0 0 240 360"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient :id="stopDashGradId(s.markerId)" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="rgba(167,139,250,.95)" />
                            <stop offset="50%" stop-color="rgba(240,171,252,.95)" />
                            <stop offset="100%" stop-color="rgba(96,165,250,.95)" />
                          </linearGradient>
                        </defs>

                        <rect
                          x="1" y="1" width="236" height="356"
                          rx="20" ry="20"
                          fill="none"
                          :stroke="`url(#${stopDashGradId(s.markerId)})`"
                          stroke-width="2"
                          stroke-dasharray="10 8"
                          stroke-linecap="round"
                        />
                      </svg>

                      <!-- (B) Drop-Target emphasis -->
                      <svg
                        v-if="isStopDragging && stopDragOverIndex === idx && stopDraggingIndex !== idx"
                        class="pointer-events-none absolute inset-0 z-[6] opacity-95"
                        width="240"
                        height="360"
                        viewBox="0 0 240 360"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <rect
                          x="1" y="1" width="236" height="356"
                          rx="20" ry="20"
                          fill="none"
                          :stroke="`url(#${stopDashGradId(s.markerId)})`"
                          stroke-width="2.5"
                          stroke-dasharray="10 8"
                          stroke-linecap="round"
                        />
                      </svg>

                      <!-- Media -->
                      <video
                        v-if="stopCoverSrc(s.markerId) && isVideoUrl(stopCoverSrc(s.markerId)!)"
                        :src="stopCoverSrc(s.markerId)!"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        muted
                        playsinline
                        preload="metadata"
                        loop
                      />
                      <img
                        v-else-if="stopCoverSrc(s.markerId)"
                        :src="stopCoverSrc(s.markerId)!"
                        alt=""
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        loading="lazy"
                        draggable="false"
                      />
                      <div v-else class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

                      <div class="absolute inset-0 bg-black/10" />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                      <!-- index badge -->
                      <div class="absolute left-4 top-4 z-20">
                        <span class="rounded-full px-3 py-1 text-xs font-semibold bg-white/10 border border-white/15 backdrop-blur-md">
                          #{{ idx + 1 }}
                        </span>
                      </div>

                      <!-- actions -->
                      <div class="absolute right-4 top-4 z-20 flex items-center gap-2">
                        <button
                          class="h-10 w-10 rounded-xl bg-black/45 border border-white/15 backdrop-blur
                                 hover:bg-black/60 hover:border-white/25 transition disabled:opacity-40"
                          :disabled="idx === 0"
                          @click.stop="moveUi(idx, -1)"
                          title="Nach links"
                        >←</button>

                        <button
                          class="h-10 w-10 rounded-xl bg-black/45 border border-white/15 backdrop-blur
                                 hover:bg-black/60 hover:border-white/25 transition disabled:opacity-40"
                          :disabled="idx === stopsUi.length - 1"
                          @click.stop="moveUi(idx, +1)"
                          title="Nach rechts"
                        >→</button>

                        <button
                          class="h-10 w-10 rounded-xl bg-black/45 border border-white/15 backdrop-blur
                                 hover:bg-black/60 hover:border-white/25 transition"
                          @click.stop="remove(s.markerId)"
                          title="Entfernen"
                        >🗑️</button>
                      </div>

                      <!-- title -->
                      <div class="absolute left-0 bottom-0 z-20 w-full p-5">
                        <div class="text-lg font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm">
                          {{ markerById(s.markerId)?.title ?? `Marker ${s.markerId}` }}
                        </div>
                        <div class="mt-1 text-sm text-white/70 line-clamp-1">
                          {{ markerById(s.markerId)?.placeName ?? '' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Scroll buttons -->
                <button
                  v-if="showStopsScrollLeft"
                  type="button"
                  class="absolute left-3 top-1/2 -translate-y-1/2 z-20
                         h-12 w-12 rounded-full bg-black/35 border border-white/20 backdrop-blur
                         shadow-lg shadow-black/30 hover:bg-black/45 hover:border-white/30
                         transition grid place-items-center"
                  @click="stopsScrollLeft"
                  aria-label="Nach links scrollen"
                >
                  <span class="text-white/95 text-3xl leading-none translate-y-[-1px]">‹</span>
                </button>

                <button
                  v-if="showStopsScrollRight"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 z-20
                         h-12 w-12 rounded-full bg-black/35 border border-white/20 backdrop-blur
                         shadow-lg shadow-black/30 hover:bg-black/45 hover:border-white/30
                         transition grid place-items-center"
                  @click="stopsScrollRight"
                  aria-label="Nach rechts scrollen"
                >
                  <span class="text-white/95 text-3xl leading-none translate-y-[-1px]">›</span>
                </button>
              </div>

              <div class="mt-4 text-sm text-white/55 md:hidden">
                <span class="font-semibold text-white/75">Tipp:</span> Zieh die Cards per Drag & Drop, um die Reihenfolge zu ändern.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <TripMarkerAssignModal
      :open="addOpen"
      :currentTripId="tripId"
      :currentTripTitle="activeTrip?.title ?? null"
      @close="addOpen=false"
      @added="afterMarkerAdded"
    />

    <MarkerStoryModal
      :open="detailOpen"
      :marker="activeDetail"
      :readonly="false"
      @close="detailOpen = false"
      @open-on-map="openMarkerOnMap"
      @edit="handleEdit"
      @delete="deleteMarker"
    />

    <MarkerEditModal
      :open="editOpen"
      :marker="activeMarker"
      :saving="editSaving"
      @close="editOpen = false"
      @submit="onEditSubmit"
    />

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import AppButton from '@/components/AppButton.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import TripEditModal from '@/components/TripEditModal.vue'
import TripMarkerAssignModal from '@/components/TripMarkerAssignModal.vue'

import gemini2 from '@/assets/gemini2.png'

import { useMarkerStore } from '@/stores/MarkerStore'
import { useTripStore } from '@/stores/TripStore'
import { apiFetch } from '@/lib/api'
import { markerCover } from '@/lib/markerImages'

import type { Visibility } from '@/types/Marker'

import MarkerStoryModal from '@/components/MarkerStoryModal.vue'
import MarkerEditModal from '@/components/MarkerEditModal.vue'
import { updateMarkerJson } from '@/lib/markerApi'

defineOptions({ name: 'TripDetailView' })

const router = useRouter()
const route = useRoute()

const isSidebarOpen = ref(false)

const stopsUi = ref<any[]>([])

const stopDraggingIndex = ref<number | null>(null)
const stopDragOverIndex = ref<number | null>(null)

const addOpen = ref(false)

const editCoverOpen = ref(false)
const coverModalKey = ref(0)

const detailOpen = ref(false)
const detailId = ref<number | null>(null)

const editOpen = ref(false)
const editId = ref<number | null>(null)
const editSaving = ref(false)

const activeDetail = computed(() => {
  if (detailId.value == null) return null
  return markers.value.find((m: any) => Number(m.id) === Number(detailId.value)) ?? null
})

const activeMarker = computed(() => {
  if (editId.value == null) return null
  return markers.value.find((m: any) => Number(m.id) === Number(editId.value)) ?? null
})

const stopsScrollEl = ref<HTMLDivElement | null>(null)
const showStopsScrollLeft = ref(false)
const showStopsScrollRight = ref(false)

let stopsRaf = 0

const tripStore = useTripStore()
const { trips, stops } = storeToRefs(tripStore)

const markerStore = useMarkerStore()
const { markers } = storeToRefs(markerStore)

const assignedIds = ref<Set<number>>(new Set())

const tripId = computed(() => Number(route.params.id))

const activeTrip = computed(() => trips.value.find(t => Number(t.id) === Number(tripId.value)) ?? null)

const stopsSorted = computed(() =>
  [...(stops.value ?? [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
)

const isStopDragging = computed(() => stopDraggingIndex.value !== null)

const tripTitle = computed(() => activeTrip.value?.title || '—')

function safeId(s: string) {
  return String(s).replace(/[^a-zA-Z0-9_-]/g, '_')
}

function stopDashGradId(markerId: number) {
  return `stop-dash-${safeId(String(markerId))}`
}

function markerById(id: number) {
  return markers.value.find(m => Number(m.id) === Number(id)) ?? null
}

function stopCoverSrc(markerId: number): string | null {
  const m = markerById(markerId)
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

async function loadAssignedIds() {
  const ids = (await apiFetch('/trips/assigned-marker-ids')) as number[]
  assignedIds.value = new Set((ids ?? []).map(Number))
}

watch(
  stopsSorted,
  (v) => {
    if (stopDraggingIndex.value != null) return
    stopsUi.value = [...(v ?? [])]
  },
  { immediate: true }
)

watch(editCoverOpen, (o) => {
  if (o) coverModalKey.value++
})

watch(
  stopsUi,
  () => {
    requestAnimationFrame(updateStopsScrollHints)
  },
  { deep: false }
)

/* BUGFIX: template handler missing */
function goDashboard() {
  router.push('/dashboard')
}

async function openInMap() {
  router.push('/mapview')
}

async function openAddModal() {
  addOpen.value = true
  await loadAssignedIds()
}

function onStopDragStart(i: number) {
  stopDraggingIndex.value = i
  stopDragOverIndex.value = i
}

function onStopDragEnter(i: number) {
  if (stopDraggingIndex.value == null) return
  stopDragOverIndex.value = i
}

async function onStopDrop(targetIndex: number) {
  const from = stopDraggingIndex.value
  if (from == null) return

  if (from !== targetIndex) {
    const arr = [...stopsUi.value]
    const [moved] = arr.splice(from, 1)
    arr.splice(targetIndex, 0, moved)
    stopsUi.value = arr

    const markerIdsInOrder = arr.map(x => x.markerId)
    await tripStore.reorder(markerIdsInOrder)
  }

  onStopDragEnd()
}

function onStopDragEnd() {
  stopDraggingIndex.value = null
  stopDragOverIndex.value = null
}

async function moveUi(index: number, dir: -1 | 1) {
  const arr = [...stopsUi.value]
  const j = index + dir
  if (j < 0 || j >= arr.length) return

  const tmp = arr[index]
  arr[index] = arr[j]
  arr[j] = tmp
  stopsUi.value = arr

  const markerIdsInOrder = arr.map(x => x.markerId)
  await tripStore.reorder(markerIdsInOrder)
}

function onStopsScroll() {
  cancelAnimationFrame(stopsRaf)
  stopsRaf = requestAnimationFrame(updateStopsScrollHints)
}

function updateStopsScrollHints() {
  const el = stopsScrollEl.value
  if (!el) {
    showStopsScrollLeft.value = false
    showStopsScrollRight.value = false
    return
  }

  const EPS = 6
  showStopsScrollLeft.value = el.scrollLeft > EPS
  showStopsScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - EPS
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

  editSaving.value = true
  void files
  void tripId

  try {
    const markerId = Number((activeMarker.value as any).id)

    await updateMarkerJson(markerId, payload)

    await markerStore.loadMarkers()

    editOpen.value = false
    editId.value = null
  } finally {
    editSaving.value = false
  }
}

function openMarkerStory(markerId: number) {
  detailId.value = Number(markerId)
  detailOpen.value = true
}

function openMarkerOnMap(markerId: number) {
  detailOpen.value = false
  router.push({ path: '/mapview', query: { focus: String(markerId) } })
}

function handleEdit(markerId: number) {
  detailOpen.value = false
  editId.value = Number(markerId)
  editOpen.value = true
}

async function deleteMarker(markerId: number) {
  try {
    await markerStore.deleteMarker(markerId)
    detailOpen.value = false
    detailId.value = null
    if (tripStore.activeTripId) await tripStore.loadStops(tripStore.activeTripId)
  } catch {}
}

function stopsScrollLeft() {
  const el = stopsScrollEl.value
  if (!el) return
  el.scrollBy({ left: -320, behavior: 'smooth' })
  requestAnimationFrame(updateStopsScrollHints)
}

function stopsScrollRight() {
  const el = stopsScrollEl.value
  if (!el) return
  el.scrollBy({ left: 320, behavior: 'smooth' })
  requestAnimationFrame(updateStopsScrollHints)
}

async function remove(markerId: number) {
  await tripStore.removeStop(markerId)
}

async function onTripEdit(p: { title: string; coverUrl: string | null; coverPublicId: string | null; visibility: Visibility }) {
  if (!activeTrip.value) return
  await tripStore.updateTrip(activeTrip.value.id, {
    title: p.title,
    coverUrl: p.coverUrl,
    coverPublicId: p.coverPublicId,
    coverMarkerId: null,
    visibility: p.visibility,
  })
}

async function onDeleteTrip() {
  if (!activeTrip.value) return
  await tripStore.deleteTrip(activeTrip.value.id)
  router.push('/trips')
}

async function afterMarkerAdded() {
  await loadAssignedIds()
  if (tripStore.activeTripId) await tripStore.loadStops(tripStore.activeTripId)
}

onMounted(async () => {
  if (!trips.value?.length) {
    await tripStore.loadTrips()
  }

  await tripStore.selectTrip(tripId.value)

  if (!markers.value.length) await markerStore.loadMarkers()
  await loadAssignedIds()
  requestAnimationFrame(updateStopsScrollHints)
})
</script>

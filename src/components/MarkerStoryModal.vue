<!-- src/components/MarkerStoryModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1300] flex items-center justify-center p-4"
        @click="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <!-- Frame Wrap -->
        <div class="relative pointer-events-auto w-full flex items-center justify-center" @click.stop>

          <!-- SIZE WRAPPER (Glow darf nur hier drin bluren) -->
          <div class="relative w-full max-w-[480px] aspect-[9/16] max-h-[90dvh]">

            <!-- Glow (jetzt NICHT mehr screen-wide) -->
            <!-- Glow (clean like MarkerDetailModal) -->
            <div class="pointer-events-none absolute -inset-[1px] rounded-[2rem] opacity-40">
              <div class="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]" />
              <div class="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
              <!-- inner "mask" layer to make it crisp -->
              <div class="absolute inset-[1px] rounded-[calc(2rem-2px)] bg-[#0e162c]" />
            </div>

            <!-- Story Card -->
            <div
              class="relative z-10 w-full h-full rounded-[2rem] overflow-hidden border border-white/10 bg-[#0b1228]/85
             shadow-2xl shadow-purple-900/40"
            >

            <!-- MEDIA AREA -->
            <div class="absolute inset-0 bg-black">
              <!-- Media (no crop!) -->
              <template v-if="displaySrc">
                <video
                  v-if="displayIsVideo"
                  ref="videoEl"
                  :src="displaySrc"
                  class="evoc-video w-full h-full object-contain bg-black"
                  playsinline
                  preload="metadata"
                  @click.stop="togglePlay"
                  @loadedmetadata="onLoadedMetadata"
                  @play="isPlaying = true; startRaf()"
                  @pause="isPlaying = false; stopRaf()"
                  @ended="isPlaying = false; stopRaf(); onEnded()"
                />
                <img
                  v-else
                  :src="displaySrc"
                  alt=""
                  class="w-full h-full object-contain bg-black"
                  draggable="false"
                />
              </template>

              <div v-else class="w-full h-full grid place-items-center text-gray-400">
                <div class="w-16 h-16 rounded-xl bg-white/10 border border-white/10 grid place-items-center">🖼️</div>
              </div>

              <!-- readability overlays -->
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/0 to-black/65" />
            </div>

            <!-- TAP AREAS -->
              <button
                v-if="images.length > 1 && !displayIsVideo"
                type="button"
                class="absolute left-0 top-0 h-full w-1/3 z-20"
                aria-label="Vorheriges Medium"
                @click="prev"
              />

              <button
                v-if="images.length > 1 && !displayIsVideo"
                type="button"
                class="absolute right-0 top-0 h-full w-1/3 z-20"
                aria-label="Nächstes Medium"
                @click="next"
              />

            <!-- NEXT CIRCLE BUTTON -->
            <button
              v-if="images.length > 1"
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 z-30
                     h-12 w-12 rounded-full bg-black/35 border border-white/10 backdrop-blur
                     grid place-items-center hover:bg-black/45 transition"
              aria-label="Nächstes Medium"
              @click="next"
            >
              <span class="text-white text-2xl leading-none">›</span>
            </button>

            <!-- TOP UI -->
            <div class="absolute left-0 top-0 z-30 w-full px-4 pt-4">
              <!-- Segments -->
              <!-- Segments -->
              <div class="flex gap-2">
                <div
                  v-for="(_, i) in images"
                  :key="`seg-${i}`"
                  class="h-1.5 flex-1 rounded-full overflow-hidden bg-white/15"
                >
                  <div
                    class="h-full w-full origin-left rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400"
                    :style="{ transform: `scaleX(${segmentFill(i) / 100})` }"
                  />
                </div>
              </div>


              <!-- Header row -->
              <div class="mt-4 flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="text-2xl font-bold leading-tight truncate">
                    {{ marker?.title || 'Ohne Titel' }}
                  </div>

                  <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
                    <span class="inline-flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5"/>
                      </svg>
                      {{ dateText }}
                    </span>

                    <span class="opacity-70">•</span>

                    <span class="inline-flex items-center gap-2 truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 10.5-7.5 10.5S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                      </svg>
                      {{ placeText }}
                    </span>
                  </div>
                </div>

                <div class="shrink-0 flex flex-col items-end gap-2">
                  <!-- top-right buttons row -->
                  <div class="flex items-center gap-2">
                    <!-- 3 dots (Download) -->
                    <a
                      v-if="displayIsVideo && displaySrc"
                      :href="displaySrc"
                      class="h-10 w-10 rounded-full bg-white/10 border border-white/10 backdrop-blur
             grid place-items-center hover:bg-white/15 transition"
                      title="Download"
                      target="_blank"
                      rel="noopener"
                      download
                      @click.stop
                    >
                      <!-- three dots icon -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/90" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <circle cx="6" cy="12" r="1.6" />
                        <circle cx="12" cy="12" r="1.6" />
                        <circle cx="18" cy="12" r="1.6" />
                      </svg>
                    </a>

                    <!-- close -->
                    <button
                      type="button"
                      class="h-10 w-10 rounded-full bg-white/10 border border-white/10 backdrop-blur
             grid place-items-center hover:bg-white/15 transition"
                      aria-label="Schließen"
                      @click="emit('close')"
                    >
                      <span class="text-white text-xl leading-none">×</span>
                    </button>
                  </div>

                  <!-- counter -->
                  <div
                    v-if="images.length"
                    class="rounded-full px-3 py-1 text-xs text-white/90 bg-black/35 border border-white/10 backdrop-blur"
                  >
                    {{ activeIndex + 1 }}/{{ images.length }}
                  </div>
                </div>
                </div>
              </div>

            <!-- BOTTOM UI -->
              <div
                class="absolute left-0 z-30 w-full px-5 pb-6"
                :style="{ bottom: 'calc(env(safe-area-inset-bottom) + 8px)' }"
              >
              <!-- Description -->
              <div
                class="mb-4 rounded-2xl bg-black/35 border border-white/10 backdrop-blur
                       px-5 py-4 text-white/90 text-base"
                style="box-shadow: 0 12px 40px rgba(0,0,0,.35);"
              >
                <div class="max-h-[18dvh] overflow-auto whitespace-pre-line pr-1">
                  {{ marker?.description || 'Keine Beschreibung.' }}
                </div>
              </div>
                <!-- Actions -->
                <div class="flex items-center gap-4">
                  <AppButton
                    variant="secondary"
                    type="button"
                    class="flex-1 group"
                    @click="marker?.id && emit('open-on-map', marker.id)"
                  >
    <span class="inline-flex w-full items-center justify-center gap-2">
      <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
        Auf Karte
      </span>

      </span>
                  </AppButton>

                  <AppButton
                    v-if="!readonly"
                    variant="primary"
                    type="button"
                    class="flex-[1.2] group"
                    @click="marker?.id && emit('edit', marker.id)"
                  >
    <span class="inline-flex w-full items-center justify-center gap-2">
      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
        Bearbeiten
      </span>

    </span>
                  </AppButton>

                  <AppButton
                    v-if="!readonly"
                    variant="secondary"
                    type="button"
                    class="!w-14 !px-0 !py-0 h-12 group"
                    @click="marker?.id && emit('delete', marker.id)"
                  >
    <span class="inline-flex w-full items-center justify-center">
      <span class="text-red-300">🗑️</span>
    </span>
                  </AppButton>
                </div>

              <div v-if="readonly" class="mt-3 text-[11px] text-white/50">
                Shared · Read-only
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
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import AppButton from '@/components/AppButton.vue'
import { normalizeMarkerImages } from '@/lib/markerImages'

type Visibility = 'PRIVATE' | 'PUBLIC'

type ImageLike =
  | { id?: string | number; url?: string; secureUrl?: string; secure_url?: string; path?: string; order?: number | null }
  | string

type MarkerLike = {
  id: number
  title?: string | null
  description?: string | null
  occurredAt?: string | null
  placeName?: string | null
  images?: ImageLike[]
  visibility?: Visibility | string | null
} | null

const props = withDefaults(defineProps<{
  open: boolean
  marker: MarkerLike
  readonly?: boolean
}>(), {
  readonly: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'open-on-map', id: number): void
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}>()

const images = computed(() => normalizeMarkerImages(props.marker))

const activeIndex = ref(0)
watch(() => props.open, (o) => { if (o) activeIndex.value = 0 })

const activeItem = computed(() => images.value[activeIndex.value] ?? images.value[0] ?? null)
const displaySrc = computed(() => activeItem.value?.full ?? '')

function isVideoUrl(u?: string) {
  if (!u) return false
  const s = u.toLowerCase()
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
const displayIsVideo = computed(() => isVideoUrl(displaySrc.value) || isVideoUrl(activeItem.value?.thumb))

function prev() {
  if (images.value.length <= 1) return
  activeIndex.value = (activeIndex.value - 1 + images.value.length) % images.value.length
}
function next() {
  if (images.value.length <= 1) return
  activeIndex.value = (activeIndex.value + 1) % images.value.length
}

const placeText = computed(() => {
  const p = props.marker?.placeName?.trim()
  return p && p.length ? p : 'Ort unbekannt'
})

const dateText = computed(() => {
  const d = props.marker?.occurredAt
  if (!d) return '—'
  const [y, m, day] = String(d).split('-').map(Number)
  if (!y || !m || !day) return String(d)
  const dt = new Date(Date.UTC(y, m - 1, day))
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }).format(dt)
})

function onKey(e: KeyboardEvent) {
  if (!props.open) return

  if (e.key === 'Escape') {
    emit('close')
    return
  }
  if (images.value.length > 1) {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }
}

const videoEl = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)

async function togglePlay() {
  const v = videoEl.value
  if (!v) return
  if (v.paused) {
    try { await v.play() } catch {}
  } else {
    v.pause()
  }
}

// wenn Medium wechselt: Video stoppen + zurücksetzen
watch(displaySrc, () => {
  stopRaf()
  videoDuration.value = 0
  videoTime.value = 0
  const v = videoEl.value
  if (!v) return
  v.pause()
  v.currentTime = 0
  isPlaying.value = false
})

onBeforeUnmount(() => stopRaf())

const videoDuration = ref(0)
const videoTime = ref(0)

function onLoadedMetadata(e: Event) {
  const v = e.target as HTMLVideoElement
  videoDuration.value = Number.isFinite(v.duration) ? v.duration : 0
}

function onTimeUpdate(e: Event) {
  const v = e.target as HTMLVideoElement
  videoTime.value = v.currentTime || 0
}

function onEnded() {
  isPlaying.value = false
  next() // optional: automatisch zum nächsten Medium
}

function segmentFill(i: number) {
  if (i < activeIndex.value) return 100
  if (i > activeIndex.value) return 0

  // aktuelles Segment
  if (displayIsVideo.value) {
    const d = videoDuration.value
    if (!d) return 0
    return Math.max(0, Math.min(100, (videoTime.value / d) * 100))
  }
  return 100
}

let rafId: number | null = null

function stopRaf() {
  if (rafId != null) cancelAnimationFrame(rafId)
  rafId = null
}

function startRaf() {
  stopRaf()
  const tick = () => {
    const v = videoEl.value
    if (!v) return
    // solange Video läuft: 60fps Fortschritt ziehen
    if (!v.paused && !v.ended) {
      videoTime.value = v.currentTime || 0
      rafId = requestAnimationFrame(tick)
    } else {
      stopRaf()
    }
  }
  rafId = requestAnimationFrame(tick)
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Fullscreen: keep aspect ratio (Safari/iOS + others) */
.evoc-video:fullscreen { object-fit: contain !important; background: black; }
.evoc-video:-webkit-full-screen { object-fit: contain !important; background: black; }
</style>

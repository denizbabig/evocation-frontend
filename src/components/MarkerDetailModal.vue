<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1100] flex items-center justify-center p-4"
        @click="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal Wrap -->
        <div class="relative w-full max-w-2xl pointer-events-auto" @click.stop>
          <!-- Glow -->
          <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-40">
            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]" />
            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
            <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
          </div>

          <!-- Card -->
          <div class="relative z-10 rounded-2xl bg-[#0b1228]/95 border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-purple-900/40 overflow-hidden flex flex-col max-h-[86dvh]">

            <!-- Header (Prototype-style) -->
            <div class="flex items-start justify-between gap-4 p-6">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="text-3xl font-bold leading-tight truncate">
                    {{ marker?.title || 'Ohne Titel' }}
                  </h3>

                  <!-- readonly badge -->
                  <span
                    v-if="readonly"
                    class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200"
                  >
                    Shared · Read-only
                  </span>

                  <!-- Visibility: BUTTON (nur wenn nicht readonly) -->
                  <AppButton
                    v-if="!readonly"
                    variant="secondary"
                    size="md"
                    type="button"
                    class="!rounded-full !px-3 !py-1"
                    :disabled="visibilitySaving || !marker?.id"
                    @click="toggleVisibility"
                  >
                    <span class="inline-flex items-center gap-2 text-xs">
                      <span>{{ markerVisibility === 'PUBLIC' ? '🌍' : '🔒' }}</span>
                      <span
                        class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
                      >
                        {{ markerVisibility === 'PUBLIC' ? 'Öffentlich' : 'Privat' }}
                      </span>
                    </span>
                  </AppButton>

                  <!-- In readonly nur anzeigen -->
                  <span
                    v-else-if="markerVisibility"
                    class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200"
                  >
                    <span class="mr-1.5">{{ markerVisibility === 'PUBLIC' ? '🌍' : '🔒' }}</span>
                    {{ markerVisibility === 'PUBLIC' ? 'Öffentlich' : 'Privat' }}
                  </span>
                </div>

                <p class="mt-2 text-sm text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span class="inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5"/>
                    </svg>
                    {{ dateText }}
                  </span>

                  <span class="inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 10.5-7.5 10.5S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                    </svg>
                    {{ placeText }}
                  </span>
                </p>
              </div>

              <!-- Close Icon -->
              <button
                type="button"
                class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
                aria-label="Schließen"
                @click="emit('close')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 pb-6">
              <!-- Main image (Prototype hero) -->
              <div
                class="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                @mousemove="hoveringHero = true"
                @mouseleave="hoveringHero = false"
              >
                <button
                  type="button"
                  class="absolute inset-0"
                  @click="openLightbox"
                  aria-label="Bild vergrößern"
                >
                  <template v-if="displaySrc">
                    <video
                      v-if="displayIsVideo"
                      :src="displaySrc"
                      class="evoc-video w-full h-full object-cover"
                      controls
                      playsinline
                      preload="metadata"
                    />
                    <img
                      v-else
                      :src="displaySrc"
                      alt=""
                      class="w-full h-full object-cover"
                    />
                  </template>
                  <div v-else class="w-full h-full grid place-items-center text-gray-400">
                    <div class="w-16 h-16 rounded-xl bg-white/10 border border-white/10 grid place-items-center">🖼️</div>
                  </div>
                </button>

                <!-- Left click area -->
                <button
                  v-if="images.length > 1"
                  type="button"
                  class="absolute left-0 top-0 h-full w-1/3 flex items-center justify-start pl-4"
                  @click.stop="prevImage"
                  aria-label="Vorheriges Bild"
                >
                  <div
                    class="pointer-events-none transition-opacity duration-200"
                    :class="hoveringHero ? 'opacity-100' : 'opacity-0'"
                  >
                    <div class="h-10 w-10 rounded-full bg-black/45 border border-white/10 backdrop-blur grid place-items-center">
                      <span class="text-white text-xl leading-none">‹</span>
                    </div>
                  </div>
                </button>

                <!-- Right click area -->
                <button
                  v-if="images.length > 1"
                  type="button"
                  class="absolute right-0 top-0 h-full w-1/3 flex items-center justify-end pr-4"
                  @click.stop="nextImage"
                  aria-label="Nächstes Bild"
                >
                  <div
                    class="pointer-events-none transition-opacity duration-200"
                    :class="hoveringHero ? 'opacity-100' : 'opacity-0'"
                  >
                    <div class="h-10 w-10 rounded-full bg-black/45 border border-white/10 backdrop-blur grid place-items-center">
                      <span class="text-white text-xl leading-none">›</span>
                    </div>
                  </div>
                </button>

                <!-- Counter bottom-right -->
                <div
                  v-if="images.length"
                  class="absolute bottom-4 right-4 text-xs px-3 py-1 rounded-full bg-black/50 border border-white/10"
                >
                  {{ activeIndex + 1 }} / {{ images.length }}
                </div>
              </div>

              <!-- Thumbnails row -->
             <!-- Thumbnails row (Glow nicht abgeschnitten) -->
<div class="mt-4 -mx-3 px-3">
  <!-- x-scroll, aber genug vertikaler “breathing room” für blur/glow -->
  <div class="overflow-x-auto overflow-y-hidden py-5 scroll-smooth">
    <div class="flex gap-3 items-center px-4">
      <button
        v-for="(img, i) in images"
        :key="img.id ?? i"
        type="button"
        class="relative isolate shrink-0 w-[84px] h-[84px] rounded-2xl transition"
        :class="i === activeIndex ? 'z-10 scale-[1.02]' : 'z-0'"
        @click="activeIndex = i"
      >
        <!-- EVOCATION GLOW wenn aktiv -->
        <div
          v-if="i === activeIndex"
          aria-hidden="true"
          class="pointer-events-none absolute -inset-[2px] rounded-2xl"
        >
          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[8px]" />
          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/25 via-fuchsia-300/18 to-indigo-400/25" />
          <div class="absolute inset-[3px] rounded-[14px] bg-[#0b1228]" />
        </div>

        <!-- Surface -->
        <div
          class="relative z-10 w-full h-full rounded-2xl overflow-hidden border bg-white/5"
          :class="i === activeIndex ? 'border-transparent' : 'border-white/10 hover:border-white/20'"
        >
          <template v-if="isVideoUrl(img.thumb) || isVideoUrl(img.full)">
            <video
              :src="img.full"
              class="w-full h-full object-cover"
              muted
              playsinline
              preload="metadata"
            />
          </template>
          <img
            v-else
            :src="img.thumb"
            alt=""
            class="w-full h-full object-cover"
          />
          <div
            v-if="i === activeIndex"
            class="absolute inset-0 ring-2 ring-fuchsia-400/30"
            aria-hidden="true"
          />
        </div>
      </button>
    </div>

</div>
              </div>

              <!-- Description field -->
              <div class="mt-5 rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-gray-200 text-sm whitespace-pre-line">
                {{ marker?.description || 'Keine Beschreibung.' }}
              </div>
            </div>

            <!-- Footer actions (Prototype-style) -->
            <div class="p-6 pt-4 border-t border-white/10 bg-white/5">
              <div class="flex items-center gap-4">
                <AppButton
                  variant="secondary"
                  type="button"
                  class="flex-1"
                  @click="marker?.id && emit('open-on-map', marker.id)"
                >
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Auf Karte
                  </span>
                </AppButton>

                <AppButton
                  v-if="!readonly"
                  variant="primary"
                  type="button"
                  class="flex-[1.2]"
                  @click="marker?.id && emit('edit', marker.id)"
                >
                  <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                    Bearbeiten
                  </span>
                </AppButton>

                <AppButton
                  v-if="!readonly"
                  variant="secondary"
                  type="button"
                  class="!w-20 !px-0 !py-0 h-12"
                  @click="marker?.id && emit('delete', marker.id)"
                >
                  <span class="text-red-300">
                    🗑️
                  </span>
                </AppButton>
              </div>

              <div v-if="readonly" class="mt-4 text-[11px] text-gray-500">
                Tip: In Shared-Ansicht sind Bearbeiten/Löschen deaktiviert.
              </div>
            </div>
          </div>
        </div>

        <!-- Lightbox -->
        <!-- Lightbox -->
        <!-- Lightbox -->
        <Transition name="fade">
          <div
            v-if="lightboxOpen && displaySrc"
            class="fixed inset-0 z-[1200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            @click="lightboxOpen = false"
          >
            <div class="relative max-w-5xl w-full" @click.stop>
              <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-40">
                <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]" />
                <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
              </div>

              <div class="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0b1228]/90">
                <video
                  v-if="displayIsVideo"
                  :src="displaySrc"
                  class="w-full h-full object-contain bg-black/20"
                  controls
                  playsinline
                  preload="metadata"
                />
                <img
                  v-else
                  :src="displaySrc"
                  class="w-full max-h-[80vh] object-contain bg-black/20"
                  alt=""
                />

                <div class="p-3 flex justify-end border-t border-white/10 bg-white/5">
                  <AppButton variant="secondary" size="md" type="button" @click="lightboxOpen = false">
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Schließen
            </span>
                  </AppButton>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/* Imports */
import AppButton from '@/components/AppButton.vue'
import { normalizeMarkerImages } from '@/lib/markerImages'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/* Types */
type Visibility = 'PRIVATE' | 'PUBLIC'

type ImageLike =
  | { id?: string | number; url?: string; secureUrl?: string; secure_url?: string; path?: string; order?: number | null }
  | string

type MarkerLike =
  | {
  id: number
  title?: string | null
  description?: string | null
  occurredAt?: string | null
  lat?: number
  lng?: number
  placeName?: string | null
  images?: ImageLike[]
  visibility?: Visibility | string | null
}
  | null

/* Props / Emits */
const props = withDefaults(
  defineProps<{
    open: boolean
    marker: MarkerLike
    readonly?: boolean
    visibilitySaving?: boolean
  }>(),
  {
    readonly: false,
    visibilitySaving: false,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'open-on-map', id: number): void
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
  (e: 'set-visibility', payload: { id: number; visibility: Visibility }): void
}>()

/* State */
const activeIndex = ref(0)
const hoveringHero = ref(false)
const lightboxOpen = ref(false)

/* Computed */
const images = computed(() => normalizeMarkerImages(props.marker))

const markerVisibility = computed<Visibility>(() => {
  const v = props.marker?.visibility
  if (v === 'PUBLIC' || v === 'PRIVATE') return v
  return (v ? String(v).toUpperCase() : 'PRIVATE') as Visibility
})

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

const activeItem = computed(() => images.value[activeIndex.value] ?? images.value[0] ?? null)
const displaySrc = computed(() => activeItem.value?.full ?? '')
const displayIsVideo = computed(() => isVideoUrl(displaySrc.value) || isVideoUrl(activeItem.value?.thumb))

/* Watch */
watch(
  () => props.open,
  (o) => {
    if (o) activeIndex.value = 0
    else lightboxOpen.value = false
  }
)

/* Actions */
function toggleVisibility() {
  if (props.readonly) return
  if (!props.marker?.id) return

  const next: Visibility = markerVisibility.value === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'
  emit('set-visibility', { id: props.marker.id, visibility: next })
}

function prevImage() {
  const n = images.value.length
  if (n <= 1) return
  activeIndex.value = (activeIndex.value - 1 + n) % n
}

function nextImage() {
  const n = images.value.length
  if (n <= 1) return
  activeIndex.value = (activeIndex.value + 1) % n
}

function openLightbox() {
  if (!displaySrc.value) return
  if (displayIsVideo.value) return
  lightboxOpen.value = true
}

/* Keyboard */
function onKey(e: KeyboardEvent) {
  if (!props.open) return

  if (e.key === 'Escape') {
    if (lightboxOpen.value) lightboxOpen.value = false
    else emit('close')
    return
  }

  if (images.value.length > 1) {
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
  }
}

function isVideoUrl(u?: string) {
  if (!u) return false
  const s = u.toLowerCase()
  return (
    s.includes('/video/upload/') ||
    s.endsWith('.mp4') ||
    s.endsWith('.mov') ||
    s.endsWith('.webm') ||
    s.endsWith('.ogg')
  )
}

/* Lifecycle */
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>

.evoc-video:fullscreen {
  object-fit: contain !important;
  background: black;
}

/* Safari / iOS */
.evoc-video:-webkit-full-screen {
  object-fit: contain !important;
  background: black;
}

</style>

<!-- src/components/MarkerMapModal.vue -->
<template>
  <Teleport to="body">
    <transition name="evoc-modal" appear>
      <div
        v-show="open"
        class="fixed inset-0 z-[80] flex items-center justify-center"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/55 backdrop-blur-sm" @click="close"></div>

        <!-- Dialog -->
        <div class="relative w-full px-4 will-change-transform will-change-opacity">
          <div class="relative isolate w-[min(92vw,64rem)] mx-auto">
            <!-- Always-on Glow um das gesamte Modal -->
            <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-40">
              <div
                class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]"
              ></div>
              <div
                class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
              ></div>
              <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]"></div>
            </div>

            <!-- Panel -->
            <div
              class="relative rounded-2xl bg-[#0b1228]/95 border border-white/1 ring-1 ring-white/1 shadow-2xl shadow-purple-900/50 overflow-hidden"
            >
              <!-- Header -->
              <div class="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                <h3
                  class="text-xl font-semibold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
                >
                  Neuen Marker erstellen
                </h3>
                <button
                  @click="close"
                  class="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <!-- Body -->
              <div class="p-5 space-y-5">
                <!-- ===== Formular ===== -->
                <form @submit.prevent="onSubmit" class="space-y-4">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- LEFT COLUMN -->
                    <div class="space-y-4">
                      <!-- Grundinformationen Gruppe -->
                      <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div class="flex items-center gap-2 mb-4 text-sm text-gray-300">
                          <span class="opacity-80">🏷️</span>
                          <span class="font-medium">Grundinformationen</span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <!-- Titel -->
                          <div class="md:col-span-2">
                            <label class="text-sm text-gray-300">Titel</label>
                            <div class="relative group mt-1">
                              <div
                                class="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"
                              >
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[8px]"
                                ></div>
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
                                ></div>
                                <div class="absolute inset-[1px] rounded-[12px] bg-[#0e162c]"></div>
                              </div>

                              <input
                                v-model="form.title"
                                required
                                placeholder="z. B. Oriental Pearl Tower"
                                class="relative w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-0 text-white placeholder-gray-500 transition-all"
                              />
                            </div>
                          </div>

                          <!-- Datum -->
                          <div>
                            <label class="text-sm text-gray-300">Datum</label>
                            <div class="relative group mt-1">
                              <div
                                class="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"
                              >
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[8px]"
                                ></div>
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
                                ></div>
                                <div class="absolute inset-[1px] rounded-[12px] bg-[#0e162c]"></div>
                              </div>

                              <input
                                type="date"
                                v-model="form.occurredAt"
                                class="relative w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-0 text-white placeholder-gray-500 [color-scheme:dark] transition-all"
                                aria-label="Datum wählen"
                              />
                            </div>
                          </div>

                          <!-- Kategorie -->
                          <div>
                            <label class="text-sm text-gray-300">Kategorie</label>
                            <div class="relative group mt-1">
                              <div
                                class="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"
                              >
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[8px]"
                                ></div>
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
                                ></div>
                                <div class="absolute inset-[1px] rounded-[12px] bg-[#0e162c]"></div>
                              </div>

                              <select
                                v-model.number="form.categoryId"
                                class="relative z-10 w-full appearance-none rounded-xl bg-white/5 border border-white/10 px-3 py-2 pr-9 outline-none focus:ring-0 text-white cursor-pointer transition-all"
                              >
                                <option :value="null" class="bg-[#1a233e] text-gray-400">– keine –</option>
                                <option v-for="c in categories" :key="c.id" :value="c.id" class="bg-[#1a233e]">
                                  {{ c.label }}
                                </option>
                              </select>

                              <div class="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center px-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          <!-- Beschreibung -->
                          <div class="md:col-span-2">
                            <label class="text-sm text-gray-300">Beschreibung</label>
                            <div class="relative group mt-1 isolate">
                              <div
                                class="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300 z-0"
                              >
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[8px]"
                                ></div>
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
                                ></div>
                                <div class="absolute inset-[1px] rounded-[12px] bg-[#0e162c]"></div>
                              </div>

                              <textarea
                                v-model="form.description"
                                rows="3"
                                placeholder="Optional: kurze Erinnerung"
                                class="relative z-10 block w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-0 text-white placeholder-gray-500 transition-all resize-none align-top"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Koordinaten Gruppe -->
                      <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div class="flex items-center gap-2 mb-4 text-sm text-gray-300">
                          <span class="opacity-80">📍</span>
                          <span class="font-medium">Koordinaten</span>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="text-xs text-gray-400 uppercase tracking-wider">Latitude</label>
                            <div class="relative group mt-1">
                              <div
                                class="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition duration-300"
                              >
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[8px]"
                                ></div>
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
                                ></div>
                                <div class="absolute inset-[1px] rounded-[12px] bg-[#0e162c]"></div>
                              </div>

                              <input
                                :value="form.lat.toFixed(6)"
                                disabled
                                class="relative w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-gray-400 font-mono text-sm opacity-75"
                              />
                            </div>
                          </div>

                          <div>
                            <label class="text-xs text-gray-400 uppercase tracking-wider">Longitude</label>
                            <div class="relative group mt-1">
                              <div
                                class="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition duration-300"
                              >
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[8px]"
                                ></div>
                                <div
                                  class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
                                ></div>
                                <div class="absolute inset-[1px] rounded-[12px] bg-[#0e162c]"></div>
                              </div>

                              <input
                                :value="form.lng.toFixed(6)"
                                disabled
                                class="relative w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-gray-400 font-mono text-sm opacity-75"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- RIGHT COLUMN -->
                    <div class="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col h-full">
                      <div class="flex items-center gap-2 mb-4 text-sm text-gray-300">
                        <span class="opacity-80">🖼️</span>
                        <span class="font-medium">Fotos</span>
                      </div>

                      <!-- Dropzone Frame -->
                      <div
                        class="rounded-2xl border border-dashed border-white/12 bg-white/5 p-4 transition relative isolate"
                        :class="isDragOver ? 'border-transparent' : ''"
                        @dragenter.prevent="onDragEnter"
                        @dragover.prevent="onDragOver"
                        @dragleave.prevent="onDragLeave"
                        @drop.prevent="onDrop"
                      >
                        <div
                          v-if="isDragOver"
                          aria-hidden="true"
                          class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-90"
                        >
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]"></div>
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"></div>
                          <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]"></div>
                        </div>

                        <div class="relative z-10">
                          <!-- Hidden input -->
                          <input
                            ref="fileInputEl"
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            class="hidden"
                            @change="onPickFiles"
                          />

                          <!-- TOP: Pick files -->
                          <AppButton
                            type="button"
                            variant="primary"
                            class="w-full h-12 flex items-center justify-center gap-2"
                            @click="fileInputEl?.click()"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"/>
                            </svg>
                            <span class="bg-gradient-to-r from-purple-600 via-fuchsia-400 to-indigo-600 bg-clip-text text-transparent">
                              Bilder auswählen
                            </span>
                          </AppButton>

                          <p class="mt-3 text-center text-xs text-gray-500">
                            oder per Drag & Drop hier ablegen
                          </p>

                          <p v-if="uploadError" class="mt-2 text-sm text-red-300">
                            {{ uploadError }}
                          </p>
                        </div>
                      </div>

                      <!-- MIDDLE: Preview Grid -->
                      <div v-if="pendingImages.length" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div
                          v-for="p in pendingImages"
                          :key="p.id"
                          class="relative rounded-xl overflow-hidden border border-white/10 bg-white/5"
                        >
                          <img
                            v-if="p.kind === 'image'"
                            :src="p.previewUrl"
                            class="h-28 w-full object-cover"
                          />

                          <video
                            v-else
                            :src="p.previewUrl"
                            class="h-28 w-full object-cover"
                            muted
                            playsinline
                            controls
                          />

                          <div class="absolute top-2 left-2 text-[11px] px-2 py-1 rounded bg-black/60 border border-white/10">
                            <span v-if="p.uploading">⚙️</span>
                            <span v-else-if="p.uploaded">✅</span>
                            <span v-else>⏸️</span>
                          </div>

                          <button
                            type="button"
                            class="absolute top-2 right-2 text-[11px] px-2 py-1 rounded bg-black/60 border border-white/10 hover:bg-black/70 hover:scale-105 hover:shadow-[0_0_20px_-10px_rgba(255,255,255,0.8)] transition-transform"
                            @click="setCover(p.id)"
                          >
                            <span v-if="p.isCover">🌟 Cover</span>
                            <span v-else>☆ Cover</span>
                          </button>

                          <button
                            type="button"
                            class="absolute bottom-2 right-2 text-[11px] px-2 py-1 rounded bg-black/60 border border-white/10 hover:bg-black/70 hover:scale-105 hover:shadow-[0_0_20px_-10px_rgba(255,255,255,0.8)] transition-transform"
                            @click="removePending(p.id)"
                            :disabled="p.uploading"
                          >
                            Entfernen
                          </button>

                          <p v-if="p.error" class="p-2 text-xs text-red-300">
                            {{ p.error }}
                          </p>
                        </div>
                      </div>

                      <p v-if="pendingImages.length && !allUploaded" class="mt-2 text-xs text-gray-400">
                        Hinweis: Erst „Bilder hochladen“, dann „Speichern“.
                      </p>

                      <!-- BOTTOM: Confirm upload -->
                      <div class="mt-auto pt-4">
                        <AppButton
                          type="button"
                          variant="primary"
                          class="w-full h-12 flex items-center justify-center"
                          :disabled="!canUpload"
                          @click="uploadAll"
                        >
                          <span class="bg-gradient-to-r from-purple-600 via-fuchsia-400 to-indigo-600 bg-clip-text text-transparent">
                            Bilder hochladen
                          </span>
                        </AppButton>
                      </div>
                    </div>
                  </div>

                 <!-- Footer -->
<div class="mt-5 border-t border-white/10 pt-4">
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    <!-- Visibility Toggle (links) -->
    <div class="flex items-center gap-3">
      <AppButton
        type="button"
        variant="secondary"
        @click="toggleVisibility"
        class="px-4"
      >
        <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
          {{ form.visibility === 'PUBLIC' ? 'Öffentlich' : 'Privat' }}
        </span>

      </AppButton>
    </div>

    <!-- Actions (rechts) -->
    <div class="flex items-center justify-end gap-3">
      <AppButton type="button" variant="secondary" @click="close">
        <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
          Abbrechen
        </span>
      </AppButton>

      <AppButton
        type="submit"
        variant="primary"
        :disabled="saving || !isValid || (pendingImages.length > 0 && !allUploaded)"
      >
        <span class="bg-gradient-to-r from-purple-600 via-fuchsia-400 to-indigo-600 bg-clip-text text-transparent">
          {{ saving ? 'Speichern…' : 'Speichern' }}
        </span>
      </AppButton>
    </div>
  </div>

  <p class="mt-2 text-[11px] text-gray-400">
    Bitte gebe an, ob du diese Erinnerung mit Freunden teilen möchtest oder nicht
  </p>
</div>
                </form>
                <!-- ===== /Formular ===== -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import AppButton from '@/components/AppButton.vue'
import type { NewMarker } from '@/types/Marker'
import type { ImageAsset } from '@/types/ImageAsset'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { Visibility } from '@/types/Marker'

type CategoryOption = { id: number; label: string }

type PendingMedia = {
  id: string
  file: File
  previewUrl: string
  kind: 'image' | 'video'
  uploading: boolean
  uploaded?: ImageAsset
  error?: string | null
  isCover: boolean
}

const pendingImages = ref<PendingMedia[]>([])
const uploadError = ref<string | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)

function uid() {
  return crypto.randomUUID?.() ?? String(Math.random()).slice(2)
}

function clearPending() {
  for (const p of pendingImages.value) URL.revokeObjectURL(p.previewUrl)
  pendingImages.value = []
  uploadError.value = null
}

onBeforeUnmount(clearPending)

const props = withDefaults(
  defineProps<{
    open: boolean
    categories?: CategoryOption[]
    saving?: boolean
    defaultLat?: number
    defaultLng?: number
  }>(),
  {
    categories: () => [
      { id: 1, label: 'Reise' },
      { id: 2, label: 'Essen' },
      { id: 3, label: 'Sightseeing' },
      { id: 4, label: 'Shopping' },
    ],
    saving: false,
    defaultLat: 52.520008,
    defaultLng: 13.404954,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: NewMarker): void
}>()

function ymd(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Formular */
const form = ref<NewMarker>({
  title: '',
  description: '',
  categoryId: null,
  occurredAt: ymd(),
  lat: props.defaultLat,
  lng: props.defaultLng,
  images: [],
  visibility: 'PRIVATE',
})

watch(
  () => [props.open, props.defaultLat, props.defaultLng] as const,
  ([isOpen, lat, lng]) => {
    if (!isOpen) {
      clearPending()
      return
    }

    clearPending()

    form.value = {
      title: '',
      description: '',
      categoryId: null,
      occurredAt: ymd(),
      lat: lat ?? props.defaultLat,
      lng: lng ?? props.defaultLng,
      images: [],
      visibility: 'PRIVATE',
    }
  }
)

const isValid = computed(() => !!form.value.title?.trim() && !!form.value.occurredAt)

/* Bilder: lokal wählen -> Upload bestätigen */
function onPickFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (!files.length) return
  addFiles(files)
  input.value = ''
}

function addFiles(files: File[]) {
  const accepted = files.filter(
    (f) => f.type?.startsWith('image/') || f.type?.startsWith('video/')
  )
  if (!accepted.length) return

  const VIDEO_LIMIT = 2

  // wie viele Videos sind schon drin?
  const existingVideoCount = pendingImages.value.filter((p) => p.kind === 'video').length

  // wie viele Videos kommen neu rein?
  const incomingVideos = accepted.filter((f) => f.type?.startsWith('video/'))

  // Wenn wir über das Limit kommen würden -> Fehlermeldung + nur bis Limit hinzufügen
  const maxVideosWeCanAdd = Math.max(0, VIDEO_LIMIT - existingVideoCount)
  if (incomingVideos.length > maxVideosWeCanAdd) {
    uploadError.value = `Du kannst aktuell maximal ${VIDEO_LIMIT} Videos pro Marker hinzufügen.`
  }

  let videosAdded = 0

  for (const file of accepted) {
    const kind: 'image' | 'video' = file.type?.startsWith('video/') ? 'video' : 'image'

    // Video-Limit enforce
    if (kind === 'video') {
      if (existingVideoCount + videosAdded >= VIDEO_LIMIT) {
        // skip this video
        continue
      }
      videosAdded++
    }

    const previewUrl = URL.createObjectURL(file)
    pendingImages.value.push({
      id: uid(),
      file,
      previewUrl,
      kind,
      uploading: false,
      uploaded: undefined,
      error: null,
      isCover: pendingImages.value.length === 0,
    })
  }
}

function removePending(id: string) {
  const idx = pendingImages.value.findIndex((p) => p.id === id)
  if (idx === -1) return
  URL.revokeObjectURL(pendingImages.value[idx].previewUrl)
  pendingImages.value.splice(idx, 1)

  if (!pendingImages.value.some((p) => p.isCover) && pendingImages.value.length) {
    pendingImages.value[0].isCover = true
  }
}

function setCover(id: string) {
  for (const p of pendingImages.value) p.isCover = p.id === id
}

const canUpload = computed(
  () =>
    pendingImages.value.length > 0 &&
    pendingImages.value.some((p) => !p.uploaded) &&
    !pendingImages.value.some((p) => p.uploading)
)

const allUploaded = computed(
  () => pendingImages.value.length > 0 && pendingImages.value.every((p) => !!p.uploaded)
)

async function uploadAll() {
  uploadError.value = null

  const cover = pendingImages.value.find((p) => p.isCover)
  const ordered = [...(cover ? [cover] : []), ...pendingImages.value.filter((p) => p !== cover)]

  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i].uploaded) ordered[i].uploaded!.order = i
  }

  for (let i = 0; i < ordered.length; i++) {
    const p = ordered[i]
    if (p.uploaded) continue

    p.uploading = true
    p.error = null
    try {
      const asset = await uploadToCloudinary(p.file, { log: true, order: i })
      p.uploaded = { ...asset, order: i }
    } catch (err: any) {
      p.error = err?.message ?? 'Upload fehlgeschlagen'
      uploadError.value = p.error
      break
    } finally {
      p.uploading = false
    }
  }

  form.value.images = ordered.map((p) => p.uploaded).filter(Boolean) as ImageAsset[]
}

/* Drag & Drop */
function onDragEnter() { isDragOver.value = true }
function onDragOver()  { isDragOver.value = true }
function onDragLeave() { isDragOver.value = false }
function onDrop(e: DragEvent) {
  isDragOver.value = false
  const files = Array.from(e.dataTransfer?.files ?? [])
  if (!files.length) return
  addFiles(files)
}

/* Actions */
function close() {
  emit('close')
}

function onSubmit() {
  if (!isValid.value) return

  if (pendingImages.value.length && !allUploaded.value) {
    uploadError.value = 'Bitte erst „Bilder hochladen“ klicken (oder Bilder entfernen).'
    return
  }

  emit('submit', {
    ...form.value,
    title: form.value.title.trim(),
    categoryId: form.value.categoryId ?? null,
    images: form.value.images ?? [],
    visibility: form.value.visibility ?? 'PRIVATE',
  })
}
function toggleVisibility() {
  form.value.visibility = form.value.visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'
}
</script>

<style scoped>
/* =========================
   Modal (rein/raus) – langsamer & softer
   ========================= */
.evoc-modal-enter-active {
  transition:
    opacity 260ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 340ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 340ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform, filter;
}
.evoc-modal-leave-active {
  transition:
    opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 500ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform, filter;
}
.evoc-modal-enter-from,
.evoc-modal-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.985);
  filter: blur(4px);
}
.evoc-modal-enter-to,
.evoc-modal-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}
</style>

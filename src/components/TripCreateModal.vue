<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1200] flex items-center justify-center px-6 py-10"
        @click="onBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/65 backdrop-blur-md"></div>
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.18),_rgba(14,22,44,0.92)_65%,_rgba(0,0,0,0.95))]"
        />

        <!-- Modal -->
        <div
          class="relative z-20 w-full max-w-[730px] pointer-events-auto"
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
                     h-[680px] max-h-[80dvh] flex flex-col"
            >
              <!-- Header -->
              <div class="px-10 pt-9 pb-6 border-b border-white/10">
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <div class="text-2xl font-bold tracking-tight">
                      <span
                        class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
                      >
                        Trip erstellen
                      </span>
                    </div>
                    <div class="mt-2 text-sm text-white/55">
                      Titel ist Pflicht. Cover ist optional (mit Upload).
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

                <!-- Error -->
                <div
                  v-if="localError"
                  class="mt-5 rounded-2xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200"
                >
                  {{ localError }}
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 overflow-y-auto px-10 py-10">
                <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">
                  <!-- LEFT: Cover -->
                  <div class="relative group isolate h-[400px] rounded-3xl">
                    <!-- Glow like marker edit preview -->
                    <div
                      class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
                    >
                      <div
                        class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]"
                      />
                      <div
                        class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
                      />
                      <div class="absolute inset-[1px] rounded-[calc(1.5rem-1px)] bg-[#0e162c]" />
                    </div>

                    <!-- Surface -->
                    <button
                      type="button"
                      :class="[
                        'relative z-10 h-[400px] w-full overflow-hidden rounded-3xl',
                        'bg-[#141c34]/60 backdrop-blur-md border border-white/10',
                        'transition hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed',
                        'transform-gpu duration-300 ease-out',
                        // Hover-scale nur im Empty-State
                        !coverPreview ? 'group-hover:scale-[1.02]' : ''
                      ]"
                      :disabled="busy"
                      @click="pickCover"
                    >
                      <!-- Preview -->
                      <template v-if="coverPreview">
                        <img
                          v-if="!coverIsVideo"
                          :src="coverPreview"
                          class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          draggable="false"
                          alt=""
                        />
                        <video
                          v-else
                          :src="coverPreview"
                          class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          muted
                          playsinline
                          preload="metadata"
                        />

                        <div class="absolute inset-0 bg-black/15" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                        <!-- Top actions -->
                        <div class="absolute top-4 right-4 flex items-center gap-2">
                          <button
                            type="button"
                            class="h-10 w-10 rounded-xl bg-black/45 border border-white/15 backdrop-blur
                                   grid place-items-center hover:bg-black/60 hover:border-white/25 transition disabled:opacity-50"
                            :disabled="busy"
                            @click.stop="pickCover"
                            title="Cover ändern"
                            aria-label="Cover ändern"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            class="h-10 w-10 rounded-xl bg-black/45 border border-white/15 backdrop-blur
                                   grid place-items-center hover:bg-black/60 hover:border-white/25 transition disabled:opacity-50"
                            :disabled="busy"
                            @click.stop="clearCover"
                            title="Cover entfernen"
                            aria-label="Cover entfernen"
                          >
                            🗑️
                          </button>
                        </div>

                        <!-- Bottom label -->
                        <div class="absolute left-0 bottom-0 w-full p-5">
                          <div class="text-lg font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm">
                            {{ titleOk ? title.trim() : 'Dein Trip' }}
                          </div>

                          <div class="mt-2 text-sm text-white/80 flex items-center justify-between gap-3">
                            <span class="truncate opacity-80">
                              {{ coverFile?.name || 'Cover ausgewählt' }}
                            </span>
                            <span
                              class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white/95
                                     bg-white/10 border border-white/15 backdrop-blur-md"
                            >
                              Cover
                            </span>
                          </div>
                        </div>
                      </template>

                      <!-- Empty state -->
                      <template v-else>
                        <!-- 1) DEFAULT dashed border (neutral/white) -->
                        <svg
                          class="pointer-events-none absolute inset-0 opacity-90"
                          aria-hidden="true"
                          preserveAspectRatio="none"
                          viewBox="0 0 300 400"
                        >
                          <rect
                            x="1" y="1"
                            width="298" height="398"
                            rx="24" ry="24"
                            fill="none"
                            stroke="rgba(255,255,255,0.18)"
                            stroke-width="2"
                            stroke-dasharray="8 7"
                            stroke-linecap="round"
                            vector-effect="non-scaling-stroke"
                          />
                        </svg>

                        <!-- 2) Gradient dashed border ONLY on hover -->
                        <svg
                          class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
                          aria-hidden="true"
                          preserveAspectRatio="none"
                          viewBox="0 0 300 400"
                        >
                          <defs>
                            <linearGradient id="trip-cover-dash-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stop-color="rgba(167,139,250,.95)" />
                              <stop offset="50%" stop-color="rgba(240,171,252,.95)" />
                              <stop offset="100%" stop-color="rgba(96,165,250,.95)" />
                            </linearGradient>
                          </defs>
                          <rect
                            x="1" y="1"
                            width="298" height="398"
                            rx="24" ry="24"
                            fill="none"
                            stroke="url(#trip-cover-dash-grad)"
                            stroke-width="2"
                            stroke-dasharray="8 7"
                            stroke-linecap="round"
                            vector-effect="non-scaling-stroke"
                          />
                        </svg>

                        <div class="absolute inset-0 flex flex-col items-center justify-center gap-4">
                          <div
                            class="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 grid place-items-center text-white/80
                                   transition-transform duration-300 group-hover:scale-[1.06]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-7 w-7"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </div>
                          <div class="text-white/85 text-sm font-semibold">Cover hinzufügen</div>
                          <div class="text-white/45 text-xs">Klicke, um eine Datei auszuwählen</div>
                        </div>
                      </template>
                    </button>

                    <input
                      ref="coverInputEl"
                      type="file"
                      class="hidden"
                      accept="image/*,video/*"
                      @change="onPickCover"
                    />

                    <!-- cover status + error -->
                    <div class="mt-4 flex items-center justify-between">
                      <div class="text-xs text-white/50">
                        <span v-if="coverUploading">⚙️ Upload…</span>
                        <span v-else-if="coverUploaded">✅ Uploaded</span>
                        <span v-else-if="coverFile">⏸️ Pending</span>
                        <span v-else>Kein Cover</span>
                      </div>

                      <button
                        v-if="coverFile && !coverUploaded && !coverUploading"
                        type="button"
                        class="text-xs font-semibold text-white/60 hover:text-white transition disabled:opacity-50"
                        :disabled="busy"
                        @click="clearCover"
                      >
                        Auswahl entfernen
                      </button>
                    </div>

                    <div v-if="coverError" class="mt-2 text-sm text-red-300">
                      {{ coverError }}
                    </div>
                  </div>

                  <!-- RIGHT: Title + Upload -->
                  <div class="space-y-6 min-w-0">
                    <!-- Title required (FIX: glow wraps ONLY the input, error is outside) -->
                    <div class="space-y-2">
                      <div class="relative group isolate">
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

                        <div class="relative z-10 flex items-center rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                          <input
                            ref="titleInput"
                            v-model="title"
                            type="text"
                            placeholder="Titel*"
                            class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0"
                            :disabled="busy"
                            @blur="titleTouched = true"
                            @keydown.enter.prevent="submit()"
                          />
                        </div>
                      </div>

                      <div v-if="titleTouched && !titleOk" class="text-xs text-red-300">
                        Bitte gib einen Titel ein.
                      </div>
                    </div>

                    <!-- Upload box -->
                    <div class="relative group isolate">
                      <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300">
                        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                        <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                      </div>

                      <div class="relative z-10 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-5 py-5">
                        <div class="flex items-start justify-between gap-4">
                          <div class="min-w-0">
                            <div class="text-sm font-semibold text-white/85">Cover Upload</div>
                            <div class="mt-1 text-xs text-white/50">
                              Optional. Du kannst es auch später ändern.
                            </div>
                          </div>

                          <div class="shrink-0 text-xs px-3 py-1 rounded-xl border border-white/10 bg-white/5 text-white/70">
                            <span v-if="coverUploading">⚙️ Upload…</span>
                            <span v-else-if="coverUploaded">✅ Uploaded</span>
                            <span v-else-if="coverFile">⏸️ Pending</span>
                            <span v-else>—</span>
                          </div>
                        </div>

                        <div class="mt-4">
                          <AppButton
                            type="button"
                            variant="primary"
                            size="md"
                            class="w-full h-12 flex items-center justify-center"
                            :disabled="busy || !coverFile || coverUploading || coverUploaded"
                            @click="uploadCover"
                          >
                            <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                              {{ coverUploading ? 'Hochladen…' : (coverUploaded ? 'Uploaded' : 'Upload') }}
                            </span>
                          </AppButton>

                          <div v-if="coverFile && !coverUploaded" class="mt-2 text-xs text-white/50">
                            Tipp: Du kannst auch direkt „Erstellen“ klicken – Upload passiert dann automatisch.
                          </div>

                          <div v-if="!coverFile" class="mt-2 text-xs text-white/45">
                            Wähle links ein Cover aus, dann kannst du es hier hochladen.
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-end gap-4 pt-2">
                      <AppButton :disabled="busy" variant="secondary" size="md" @click="emit('close')">
                        <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                          Abbrechen
                        </span>
                      </AppButton>

                      <AppButton :disabled="busy || !titleOk" variant="primary" size="md" @click="submit()">
                        <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                          {{ busy ? 'Erstelle…' : 'Erstellen' }}
                        </span>
                      </AppButton>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer hint -->
              <div class="px-10 py-5 border-t border-white/10 text-xs text-white/45">
                Hinweis: Cover ist optional. Wenn du eins ausgewählt hast, wird es bei „Erstellen“ automatisch hochgeladen (falls noch nicht passiert).
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppButton from '@/components/AppButton.vue'
import { useTripStore } from '@/stores/TripStore'
import { uploadToCloudinary } from '@/lib/cloudinary'

const props = withDefaults(
  defineProps<{
    open: boolean
    externalBusy?: boolean
  }>(),
  { externalBusy: false }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const tripStore = useTripStore()

/** Title */
const title = ref('')
const titleTouched = ref(false)
const titleInput = ref<HTMLInputElement | null>(null)
const titleOk = computed(() => !!title.value.trim())

/** Busy */
const working = ref(false)
const coverUploading = ref(false)
const busy = computed(() => working.value || coverUploading.value || !!props.externalBusy)

/** Errors */
const localError = ref<string | null>(null)
const coverError = ref<string | null>(null)

/** Cover */
const coverInputEl = ref<HTMLInputElement | null>(null)
const coverFile = ref<File | null>(null)
const coverPreview = ref<string | null>(null)
const coverAsset = ref<any | null>(null)

const coverUploaded = computed(() => {
  const a = coverAsset.value
  return !!a && !!(a.url || a.secureUrl || a.secure_url)
})
const coverIsVideo = computed(() => !!coverFile.value?.type?.startsWith('video/'))

function revokeCoverPreview() {
  if (coverPreview.value) {
    URL.revokeObjectURL(coverPreview.value)
    coverPreview.value = null
  }
}

function reset() {
  title.value = ''
  titleTouched.value = false
  localError.value = null

  coverError.value = null
  coverUploading.value = false
  coverAsset.value = null
  coverFile.value = null
  revokeCoverPreview()
}

function onBackdropClick() {
  if (busy.value) return
  emit('close')
}

/** Pick / clear */
function pickCover() {
  if (busy.value) return
  coverInputEl.value?.click()
}

function onPickCover(e: Event) {
  const input = e.target as HTMLInputElement
  const f = (input.files?.[0] ?? null) as File | null
  input.value = ''

  coverError.value = null
  coverAsset.value = null

  coverFile.value = f
  revokeCoverPreview()
  if (f) coverPreview.value = URL.createObjectURL(f)
}

function clearCover() {
  if (busy.value) return
  coverError.value = null
  coverAsset.value = null
  coverFile.value = null
  revokeCoverPreview()
}

/** Upload */
async function uploadCover() {
  if (!coverFile.value) return
  if (busy.value) return

  coverError.value = null
  coverUploading.value = true
  try {
    const asset = await uploadToCloudinary(coverFile.value, { log: true, order: 0 })
    coverAsset.value = asset
  } catch (e: any) {
    console.error(e)
    coverError.value = e?.message ?? 'Cover-Upload fehlgeschlagen.'
  } finally {
    coverUploading.value = false
  }
}

async function ensureCoverUploadedIfNeeded() {
  if (!coverFile.value) return
  if (coverUploaded.value) return
  await uploadCover()
  if (!coverUploaded.value) throw new Error(coverError.value || 'Cover konnte nicht hochgeladen werden.')
}

/** Create */
async function submit() {
  titleTouched.value = true
  if (!titleOk.value) return
  if (busy.value) return

  localError.value = null
  working.value = true

  try {
    await ensureCoverUploadedIfNeeded()

    const payload: any = {
      title: title.value.trim(),
      coverMarkerId: null,
    }

    if (coverUploaded.value) {
      const a = coverAsset.value
      const url = a?.url ?? a?.secureUrl ?? a?.secure_url ?? null
      const publicId = a?.publicId ?? a?.public_id ?? null
      if (url) payload.coverUrl = url
      if (publicId) payload.coverPublicId = publicId
    }

    await tripStore.createTrip(payload)
    emit('created')
    emit('close')
  } catch (e: any) {
    console.error(e)
    localError.value = e?.message ?? 'Konnte Trip nicht erstellen.'
  } finally {
    working.value = false
  }
}

/** Escape */
function onKeyDown(e: KeyboardEvent) {
  if (!props.open) return
  if (e.key === 'Escape' && !busy.value) emit('close')
}

watch(
  () => props.open,
  async (o) => {
    if (!o) return
    reset()
    await nextTick()
    titleInput.value?.focus()
  }
)

window.addEventListener('keydown', onKeyDown)
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  revokeCoverPreview()
})
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

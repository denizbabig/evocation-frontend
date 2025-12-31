<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1600] flex items-center justify-center px-6 py-10"
        @click="busy ? null : emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/65 backdrop-blur-md"></div>
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.18),_rgba(14,22,44,0.92)_65%,_rgba(0,0,0,0.95))]"
        />

        <!-- Modal -->
        <div
          class="relative z-20 w-full max-w-[800px] pointer-events-auto"
          @click.stop
          role="dialog"
          aria-modal="true"
        >
          <!-- CardShell -->
          <div class="relative isolate rounded-[28px] p-[1px]">
            <!-- Glow shell -->
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
                     backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-900/30"
            >
              <!-- ✅ SavingOverlay -->
              <SavingOverlay
                :open="busy"
                title="Erstelle Trip…"
                :message="coverFile ? 'Cover wird hochgeladen und Trip wird erstellt.' : 'Trip wird erstellt.'"
                hint="Bitte Fenster nicht schließen."
                :progress="progress"
                progress-label="Fortschritt"
                :block-close="true"
              />

              <div class="p-7">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div class="min-w-0">
                    <div class="text-lg font-bold">
                      <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                        Trip erstellen
                      </span>
                      <span class="text-white/40 font-semibold text-sm ml-2">(Titel + optional Cover)</span>
                    </div>

                    <div class="mt-1 text-sm text-white/55 max-w-2xl">
                      Titel ist Pflicht. Cover ist optional und wird erst beim Klick auf
                      <span class="text-white/75 font-semibold">„Erstellen“</span> hochgeladen.
                    </div>
                  </div>

                  <div class="flex items-center gap-3 shrink-0">
                    <!-- Hidden file input -->
                    <input
                      ref="coverInputEl"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="onPickCover"
                    />

                    <!-- Close icon -->
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
                </div>

                <!-- Error -->
                <div
                  v-if="localError"
                  class="mt-5 rounded-2xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200"
                >
                  {{ localError }}
                </div>

                <!-- Content -->
                <div class="mt-7 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:items-stretch">
                  <!-- Preview -->
                  <div class="relative group isolate h-[400px] rounded-3xl">
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

                    <!-- CASE A: Preview -->
                    <div
                      v-if="coverPreview"
                      class="relative z-10 h-[400px] overflow-hidden rounded-3xl bg-[#141c34]/60 backdrop-blur-md border border-white/10"
                    >
                      <img
                        v-if="!coverIsVideo"
                        :src="coverPreview"
                        alt=""
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        loading="lazy"
                        draggable="false"
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

                      <div class="absolute right-4 top-4 z-20">
                        <span
                          class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white/95 bg-white/10 border border-white/15 backdrop-blur-md"
                        >
                          Vorschau
                        </span>
                      </div>

                      <!-- ✅ IMMER Trip-Titel unten -->
                      <div class="absolute left-0 bottom-0 z-20 w-full p-5">
                        <div
                          class="text-lg font-semibold leading-tight line-clamp-1 drop-shadow-sm text-center
                                 text-white
                                 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-fuchsia-300 group-hover:to-indigo-400
                                 group-hover:bg-clip-text group-hover:text-transparent transition"
                        >
                          {{ displayTitle }}
                        </div>
                      </div>
                    </div>

                    <!-- CASE B: kein Cover -> Add-Tile -->
                    <button
                      v-else
                      type="button"
                      class="relative z-10 h-[400px] w-full rounded-3xl border border-dashed border-white/15 bg-white/[0.03]
                             hover:bg-white/[0.05] transition flex flex-col items-center justify-center gap-4"
                      :disabled="busy"
                      @click="pickCover"
                    >
                      <div class="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 grid place-items-center text-white/80">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                      <div class="text-white/70 text-sm">Cover auswählen</div>
                    </button>
                  </div>

                  <!-- Right side -->
                  <div class="min-w-0 flex flex-col gap-5 h-full">
                    <!-- Title input (required) -->
                    <div class="space-y-2">
                      <div class="relative group isolate">
                        <div
                          class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0
                                 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"
                        >
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                          <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                        </div>

                        <div class="relative z-10 flex items-center rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                          <input
                            ref="titleInput"
                            v-model="title"
                            type="text"
                            placeholder="Titel"
                            class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0"
                            :disabled="busy"
                            @keydown.enter.prevent="submit"
                            @blur="titleTouched = true"
                          />
                        </div>
                      </div>

                      <div v-if="titleTouched && !titleOk" class="text-xs text-red-300">
                        Bitte gib einen Titel ein.
                      </div>
                    </div>

                    <!-- Cover actions -->
                    <template v-if="coverPreview || coverFile">
                      <AppButton
                        type="button"
                        variant="secondary"
                        size="md"
                        class="w-full h-12"
                        :disabled="busy"
                        @click="pickCover"
                      >
                        <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                          Neues Cover auswählen
                        </span>
                      </AppButton>

                      <AppButton
                        type="button"
                        variant="secondary"
                        size="md"
                        class="w-full h-12"
                        :disabled="busy"
                        @click="clearCover"
                      >
                        <span class="text-red-300 font-semibold">Entfernen</span>
                      </AppButton>

                      <div v-if="coverError" class="text-sm text-red-300">
                        {{ coverError }}
                      </div>

                      <div v-if="coverFile && !coverUploaded" class="text-xs text-white/45">
                        Hinweis: Cover wird beim Klick auf <b>Erstellen</b> automatisch hochgeladen.
                      </div>
                    </template>

                    <div v-else class="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white/60">
                      Klick links auf <span class="text-white/80 font-semibold">„Cover auswählen“</span>, um ein Bild/Video auszuwählen.
                    </div>

                    <!-- ✅ Visibility Button (unten zentriert) -->
                    <div class="mt-auto flex justify-center pt-2">
                      <AppButton
                        type="button"
                        variant="secondary"
                        size="md"
                        class="h-12 w-full"
                        :disabled="busy"
                        @click="toggleVisibility"
                        :title="visibility === 'PUBLIC' ? 'Klick: auf Privat stellen' : 'Klick: auf Öffentlich stellen'"
                      >
    <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent font-semibold">
      {{ visibility === 'PUBLIC' ? 'Öffentlich' : 'Privat' }}
    </span>
                      </AppButton>
                    </div>
                  </div>
                </div>
                <!-- /Content -->
              </div>
            </div>
          </div>
          <!-- /CardShell -->

          <!-- Bottom Actions (wie Picker) -->
          <div class="mt-8 flex items-center justify-between">
            <AppButton :disabled="busy" variant="secondary" size="md" @click="emit('close')">
              <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                Abbrechen
              </span>
            </AppButton>

            <AppButton :disabled="busy || !titleOk" variant="primary" size="md" @click="submit">
              <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent min-w-20">
                {{ busy ? 'Erstelle…' : 'Erstellen' }}
              </span>
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppButton from '@/components/AppButton.vue'
import SavingOverlay from '@/components/SavingOverlay.vue'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { useTripStore } from '@/stores/TripStore'
import type { Visibility } from '@/types/Marker'

/* Props */
const props = withDefaults(
  defineProps<{
    open: boolean
    externalBusy?: boolean
  }>(),
  { externalBusy: false }
)

/* Emits */
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

/* Stores */
const tripStore = useTripStore()

/* Refs/State */
const visibility = ref<Visibility>('PRIVATE')

const title = ref('')
const titleTouched = ref(false)
const titleInput = ref<HTMLInputElement | null>(null)

const working = ref(false)
const coverUploading = ref(false)

const progress = ref<number | null>(null)
const totalSteps = ref(0)
const doneSteps = ref(0)

const localError = ref<string | null>(null)
const coverError = ref<string | null>(null)

const coverInputEl = ref<HTMLInputElement | null>(null)
const coverFile = ref<File | null>(null)
const coverPreview = ref<string | null>(null)
const coverAsset = ref<any | null>(null)

/* Computeds */
const titleOk = computed(() => !!title.value.trim())
const displayTitle = computed(() => title.value.trim() || 'Dein Trip')
const busy = computed(() => working.value || coverUploading.value || !!props.externalBusy)

const coverUploaded = computed(() => {
  const a = coverAsset.value
  return !!a && !!(a.url || a.secureUrl || a.secure_url)
})

const coverIsVideo = computed(() => !!coverFile.value?.type?.startsWith('video/'))

/* Helpers */
function startProgressFlow() {
  progress.value = 0
  doneSteps.value = 0

  const mediaCount = coverFile.value ? 1 : 0
  totalSteps.value = Math.max(1, mediaCount * 2 + 2)
  tickStep(0)
}

function tickStep(n = 1) {
  doneSteps.value = Math.min(totalSteps.value, doneSteps.value + n)
  progress.value = Math.round((doneSteps.value / totalSteps.value) * 100)
}

function endProgressFlow() {
  progress.value = 100
}

function revokeCoverPreview() {
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
  coverPreview.value = null
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

  progress.value = null
  totalSteps.value = 0
  doneSteps.value = 0
  visibility.value = 'PRIVATE'
}

/* Watchers */
watch(
  () => props.open,
  async (o) => {
    if (!o) return
    reset()
    await nextTick()
    titleInput.value?.focus()
  }
)

/* UI Handlers */
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

function toggleVisibility() {
  visibility.value = visibility.value === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC'
}

/* Upload/Transform */
async function uploadCover() {
  if (!coverFile.value) return
  if (coverUploading.value) return

  coverError.value = null
  coverUploading.value = true
  try {
    tickStep(1)
    const asset = await uploadToCloudinary(coverFile.value, { log: true, order: 0 })
    coverAsset.value = asset
    tickStep(1)
  } catch (e: any) {
    coverError.value = e?.message ?? 'Cover-Upload fehlgeschlagen.'
    throw e
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

/* Final Actions */
async function submit() {
  titleTouched.value = true
  if (!titleOk.value) return
  if (busy.value) return

  localError.value = null
  working.value = true
  startProgressFlow()

  try {
    await ensureCoverUploadedIfNeeded()

    const payload: any = {
      title: title.value.trim(),
      coverMarkerId: null,
      visibility: visibility.value,
    }

    if (coverUploaded.value) {
      const a = coverAsset.value
      const url = a?.url ?? a?.secureUrl ?? a?.secure_url ?? null
      const publicId = a?.publicId ?? a?.public_id ?? null
      if (url) payload.coverUrl = url
      if (publicId) payload.coverPublicId = publicId
    }

    tickStep(1)
    await tripStore.createTrip(payload)
    tickStep(1)

    endProgressFlow()

    emit('created')
    emit('close')
  } catch (e: any) {
    localError.value = e?.message ?? 'Konnte Trip nicht erstellen.'
    progress.value = null
  } finally {
    working.value = false
  }
}

/* Escape */
function onKeyDown(e: KeyboardEvent) {
  if (!props.open) return
  if (e.key === 'Escape' && !busy.value) emit('close')
}

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

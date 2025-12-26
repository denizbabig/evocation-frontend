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
              <div class="p-7">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div class="min-w-0">
                    <div class="text-lg font-bold">
                      <span
                        class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
                      >
                        Trip Cover
                      </span>
                      <span class="text-white/40 font-semibold text-sm ml-2">(optional)</span>
                    </div>

                    <div class="mt-1 text-sm text-white/55 max-w-2xl">
                      Wähle ein Bild aus. Es wird erst beim Klick auf <span class="text-white/75 font-semibold">„Fertig“</span> hochgeladen.
                    </div>
                  </div>

                  <div class="flex items-center gap-3 shrink-0">
                    <!-- Hidden file input -->
                    <input ref="fileEl" type="file" accept="image/*" class="hidden" @change="onPick" />

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
                  v-if="error"
                  class="mt-5 rounded-2xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200"
                >
                  {{ error }}
                </div>

                <!-- Content -->
                <div class="mt-7 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
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

                    <!-- CASE A: Preview oder gespeichertes Cover -->
                    <div
                      v-if="hasVisual"
                      class="relative z-10 h-[400px] overflow-hidden rounded-3xl bg-[#141c34]/60 backdrop-blur-md border border-white/10"
                    >
                      <img
                        :src="previewUrl ?? coverUrl!"
                        alt=""
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        loading="lazy"
                        draggable="false"
                      />

                      <div class="absolute inset-0 bg-black/15" />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                      <div class="absolute right-4 top-4 z-20">
                        <span
                          class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white/95 bg-white/10 border border-white/15 backdrop-blur-md"
                        >
                          {{ previewUrl ? 'Vorschau' : 'Aktuell' }}
                        </span>
                      </div>

                      <div class="absolute left-0 bottom-0 z-20 w-full p-5">
                        <div class="text-lg font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm">
                          {{ previewUrl ? 'Neues Cover ausgewählt' : 'Cover gesetzt' }}
                        </div>
                        <div class="mt-2 text-sm text-white/80">
                          {{ previewUrl ? 'Wird beim Klick auf „Fertig“ hochgeladen' : 'Bereits gespeichert' }}
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
                      @click="fileEl?.click()"
                    >
                      <div
                        class="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 grid place-items-center text-white/80"
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
                      <div class="text-white/70 text-sm">Cover auswählen</div>
                    </button>
                  </div>

                  <!-- Actions -->
                  <div class="space-y-5 min-w-0">
                    <template v-if="hasVisual || pendingFile">
                      <AppButton
                        type="button"
                        variant="secondary"
                        size="md"
                        class="w-full h-12"
                        :disabled="busy"
                        @click="fileEl?.click()"
                      >
                        <span
                          class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
                        >
                          {{ pickLabel }}
                        </span>
                      </AppButton>

                      <AppButton
                        v-if="coverUrl || previewUrl"
                        type="button"
                        variant="secondary"
                        size="md"
                        class="w-full h-12"
                        :disabled="busy"
                        @click="clear"
                      >
                        <span class="text-red-300 font-semibold">Entfernen</span>
                      </AppButton>
                    </template>

                    <div v-else class="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white/60">
                      Klick links auf <span class="text-white/80 font-semibold">„Cover auswählen“</span>, um ein Bild auszuwählen.
                    </div>
                  </div>
                </div>
                <!-- /Content -->
              </div>
            </div>
          </div>
          <!-- /CardShell -->

          <!-- Bottom Actions -->
          <div class="mt-8 flex items-center justify-between">
            <AppButton :disabled="busy" variant="secondary" size="md" @click="emit('close')">
              <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                Abbrechen
              </span>
            </AppButton>

            <AppButton
              :disabled="busy"
              variant="primary"
              size="md"
              @click="commit"
            >
              <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent min-w-20">
                {{ uploading ? 'Speichern…' : 'Fertig' }}
              </span>
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { uploadToCloudinary } from '@/lib/cloudinary'
import AppButton from '@/components/AppButton.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    initialCoverUrl?: string | null
    initialCoverPublicId?: string | null
    externalBusy?: boolean
  }>(),
  {
    initialCoverUrl: null,
    initialCoverPublicId: null,
    externalBusy: false,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'change', payload: { coverUrl: string | null; coverPublicId: string | null }): void
}>()

const fileEl = ref<HTMLInputElement | null>(null)
const pendingFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const uploading = ref(false)
const error = ref<string | null>(null)

const coverUrl = ref<string | null>(null)
const coverPublicId = ref<string | null>(null)

const busy = computed(() => uploading.value || !!props.externalBusy)

function revokePreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}
onBeforeUnmount(revokePreview)

/** Props -> local state */
watch(
  () => [props.initialCoverUrl, props.initialCoverPublicId] as const,
  ([u, pid]) => {
    coverUrl.value = u ?? null
    coverPublicId.value = pid ?? null
  },
  { immediate: true }
)

/** Reset on open */
watch(
  () => props.open,
  (o) => {
    if (!o) return
    error.value = null
    pendingFile.value = null
    revokePreview()
  }
)

function onPick(e: Event) {
  error.value = null
  const input = e.target as HTMLInputElement
  const f = input.files?.[0] ?? null
  input.value = ''
  if (!f) return

  pendingFile.value = f
  revokePreview()
  previewUrl.value = URL.createObjectURL(f)
}

async function commit() {
  if (busy.value) return
  error.value = null

  // Wenn kein neues File gewählt: einfach schließen
  if (!pendingFile.value) {
    emit('close')
    return
  }

  uploading.value = true
  try {
    const asset = await uploadToCloudinary(pendingFile.value, { log: true, order: 0 })
    coverUrl.value = asset.secureUrl
    coverPublicId.value = asset.publicId

    emit('change', { coverUrl: coverUrl.value, coverPublicId: coverPublicId.value })

    pendingFile.value = null
    revokePreview()
    emit('close')
  } catch (e: any) {
    error.value = e?.message ?? 'Upload fehlgeschlagen'
  } finally {
    uploading.value = false
  }
}

function clear() {
  if (busy.value) return
  error.value = null
  pendingFile.value = null
  revokePreview()
  coverUrl.value = null
  coverPublicId.value = null
  emit('change', { coverUrl: null, coverPublicId: null })
}

const hasVisual = computed(() => !!(previewUrl.value || coverUrl.value))
const pickLabel = computed(() => (hasVisual.value ? 'Neues Bild auswählen' : 'Bild auswählen'))
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

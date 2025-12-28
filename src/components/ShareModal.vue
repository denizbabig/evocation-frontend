<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1200] bg-black/55 backdrop-blur-sm"
        @click="onBackdrop"
      />
    </Transition>

    <!-- Modal -->
    <Transition name="evoc-modal" appear>
      <div
        v-if="open"
        ref="shellRef"
        class="fixed inset-0 z-[1201] flex items-center justify-center p-4"
        tabindex="0"
        @keydown.esc.prevent="close"
        @click.self="onBackdrop"
      >
        <div class="relative w-full max-w-xl will-change-transform will-change-opacity">
          <div class="relative isolate">

            <!-- Always-on Glow um das Modal -->
            <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-40">
              <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
              <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
              <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
            </div>

            <!-- Panel -->
            <div
              class="relative rounded-2xl bg-[#0b1228]/95 border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-purple-900/50 overflow-hidden"
            >
              <!-- Header -->
              <div class="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                <h3
                  class="text-xl font-semibold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
                >
                  Share-Link
                </h3>

                <AppButton variant="secondary" size="md" type="button" @click="close">
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Schließen
                  </span>
                </AppButton>
              </div>

              <!-- Body -->
              <div class="p-6 space-y-5">
                <p class="text-sm text-gray-300">
                  Dieser Link zeigt <span class="font-semibold">nur öffentliche Marker</span>.
                </p>

                <!-- Error -->
                <div v-if="error" class="rounded-xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200">
                  {{ error }}
                </div>

                <!-- Loading -->
                <div v-if="loading" class="rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-gray-300">
                  <span class="opacity-80">⚙️</span> Erstelle Link…
                </div>

                <!-- Link Box -->
                <div v-else-if="shareLink" class="space-y-3">
                  <!-- “Input-like” Glow Frame -->
                  <div class="relative group isolate">
                    <div
                      class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-60"
                    >
                      <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                      <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                      <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                    </div>

                    <div class="relative rounded-2xl bg-white/5 border border-white/10 p-4">
                      <div class="text-[11px] uppercase tracking-wider text-gray-400 mb-2">
                        Dein Link
                      </div>

                      <div
                        class="break-all text-base md:text-lg font-semibold leading-snug
                               bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400
                               bg-clip-text text-transparent"
                      >
                        {{ shareLink }}
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="mt-8 space-y-3">
                    <p v-if="copied" class="text-xs text-gray-400 text-center">
                      Du kannst den Link jetzt an Freunde schicken.
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <!-- Row 1 -->
                      <AppButton
                        variant="secondary"
                        type="button"
                        @click="copyLink"
                        class="w-full"
                      >
      <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
        {{ copied ? 'Kopiert' : 'Kopieren' }}
      </span>
                      </AppButton>

                      <AppButton
                        variant="primary"
                        type="button"
                        @click="openLink"
                        class="w-full"
                      >
      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-400 to-indigo-600 bg-clip-text text-transparent">
        Öffnen
      </span>
                      </AppButton>

                      <!-- Row 2 -->
                      <AppButton
                        variant="secondary"
                        type="button"
                        @click="revokeLink"
                        :disabled="revoking || !shareLink"
                        class="w-full"
                      >
      <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
        {{ revoking ? 'Ziehe zurück…' : 'Link zurückziehen' }}
      </span>
                      </AppButton>

                      <AppButton
                        variant="primary"
                        type="button"
                        @click="rotateLink"
                        :disabled="rotating"
                        class="w-full"
                      >
      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-400 to-indigo-600 bg-clip-text text-transparent">
        {{ rotating ? 'Erzeuge neu…' : 'Neuen Link erzeugen' }}
      </span>
                      </AppButton>
                    </div>
                  </div>
                  </div>
                <!-- No link -->
                <!-- No link -->
                <div v-else class="space-y-3">
                  <div class="rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-gray-300">
                    <span v-if="revoked">Link wurde zurückgezogen.</span>
                    <span v-else>Noch kein Link erstellt.</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-1 gap-3">
                    <AppButton variant="primary" type="button" class="w-full" @click="generate" :disabled="loading">
      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-400 to-indigo-600 bg-clip-text text-transparent">
        Neuen Link erzeugen
      </span>
                    </AppButton>


                  </div>
                </div>
              </div>

              <!-- Footer hint -->
              <div class="px-6 pb-6">
                <p class="text-[11px] text-gray-500">
                  Tipp: Setze Marker im Create/Detail-Modal auf <span class="text-gray-300 font-medium">Öffentlich</span>, damit sie im Share-Link erscheinen.
                </p>
              </div>
            </div>
            <!-- /Panel -->
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import AppButton from '@/components/AppButton.vue'
import { apiFetch } from '@/lib/api'

/* Props */
const props = withDefaults(defineProps<{
  modelValue: boolean
  endpoint?: string
  sharedPathPrefix?: string
  closeOnBackdrop?: boolean
  autoGenerate?: boolean
}>(), {
  endpoint: '/share',
  sharedPathPrefix: '/shared/',
  closeOnBackdrop: true,
  autoGenerate: true,
})

/* Emits */
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'generated', link: string): void
}>()

/* State */
const shareLink = ref<string | null>(null)
const shareCode = ref<string | null>(null)

const loading = ref(false)
const revoking = ref(false)
const rotating = ref(false)

const error = ref<string | null>(null)
const copied = ref(false)
const revoked = ref(false)

const shellRef = ref<HTMLElement | null>(null)

/* Computeds */
const open = computed(() => props.modelValue)

/* UI Actions */
function close() {
  emit('update:modelValue', false)
}

function onBackdrop() {
  if (props.closeOnBackdrop) close()
}

function openLink() {
  if (!shareLink.value) return
  window.open(shareLink.value, '_blank', 'noopener,noreferrer')
}

async function copyLink() {
  if (!shareLink.value) return
  try {
    await navigator.clipboard.writeText(shareLink.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch (e) {}
}

/* API Actions */
async function generate() {
  loading.value = true
  error.value = null
  copied.value = false
  revoked.value = false

  try {
    const data = await apiFetch(props.endpoint, { method: 'POST' })
    const code = data?.code
    if (!code) throw new Error('Backend hat keinen code zurückgegeben')

    shareCode.value = code
    shareLink.value = `${window.location.origin}${props.sharedPathPrefix}${encodeURIComponent(code)}`
    emit('generated', shareLink.value)
  } catch (e: any) {
    error.value = e?.message ?? 'Konnte Share-Link nicht erstellen.'
    shareLink.value = null
  } finally {
    loading.value = false
  }
}

async function revokeLink() {
  if (!shareCode.value) return
  revoking.value = true
  error.value = null

  try {
    await apiFetch(`${props.endpoint}/${encodeURIComponent(shareCode.value)}`, { method: 'DELETE' })
    shareLink.value = null
    shareCode.value = null
    revoked.value = true
  } catch (e: any) {
    error.value = e?.message ?? 'Konnte Share-Link nicht zurückziehen.'
  } finally {
    revoking.value = false
  }
}

async function rotateLink() {
  if (!shareCode.value) {
    await generate()
    return
  }

  rotating.value = true
  try {
    await revokeLink()
    await generate()
  } finally {
    rotating.value = false
  }
}

/* Watchers */
watch(
  () => open.value,
  (isOpen) => {
    if (!isOpen) return
    if (props.autoGenerate && !shareLink.value && !loading.value) generate()
  }
)

watch(
  () => open.value,
  async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    shellRef.value?.focus()
    if (props.autoGenerate && !shareLink.value && !loading.value) generate()
  }
)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* dein “weich” modal feel */
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

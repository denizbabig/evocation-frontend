<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm"
        @click="saving ? null : emit('close')"
      />
    </Transition>

    <Transition name="fade-slide">
      <div
        v-if="open"
        class="fixed inset-0 z-[1201] flex items-center justify-center p-4 pointer-events-none"
      >
        <div class="pointer-events-auto w-full max-w-lg" @click.stop>
          <!-- Glow ring -->
          <div class="relative isolate rounded-3xl p-[1px]">
            <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-50">
              <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[14px]" />
              <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]/80" />
            </div>

            <!-- Card -->
            <div class="relative rounded-3xl border border-white/12 bg-[#141c34]/80 backdrop-blur-md p-7 shadow-2xl shadow-fuchsia-900/25">
              <div class="flex items-start justify-between gap-4">
                <h3 class="text-2xl font-bold tracking-tight">
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Trip erstellen
                  </span>
                </h3>

                <button
                  class="text-gray-300 hover:text-white transition"
                  :disabled="saving"
                  @click="emit('close')"
                  aria-label="Schließen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <p class="mt-2 text-sm text-gray-300/90">
                Gib deinem Trip einen Namen (z.B. <span class="text-white/80">China 2025</span>).
              </p>

              <div class="mt-5 relative group isolate">
                <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-focus-within:opacity-100 transition duration-300">
                  <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                  <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                </div>

                <input
                  ref="inputEl"
                  v-model="title"
                  type="text"
                  placeholder="Trip Titel…"
                  class="relative z-10 w-full rounded-2xl bg-[#0b1228]/55 border border-white/10 px-5 py-3 text-white placeholder:text-white/35
                         outline-none focus:border-fuchsia-500/50 transition"
                  :disabled="saving"
                  @keydown.enter.prevent="submit"
                />
              </div>

              <div class="mt-6 flex justify-end gap-3">
                <button
                  class="h-11 px-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition text-sm"
                  :disabled="saving"
                  @click="emit('close')"
                >
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Abbrechen
                  </span>
                </button>

                <button
                  class="h-11 px-5 rounded-2xl bg-[#111a33]/85 border border-white/15 hover:border-fuchsia-500/40 transition text-sm"
                  :disabled="saving || !title.trim()"
                  @click="submit"
                >
                  <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent font-semibold">
                    Erstellen
                  </span>
                </button>
              </div>

              <div v-if="saving" class="mt-4 text-xs text-white/50">
                Speichere…
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/* Imports */
import { nextTick, ref, watch } from 'vue'

/* Props / Emits */
const props = withDefaults(
  defineProps<{
    open: boolean
    saving?: boolean
  }>(),
  { saving: false }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', title: string): void
}>()

/* State */
const title = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

/* Watchers */
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    title.value = ''
    await nextTick()
    inputEl.value?.focus()
  }
)

/* Actions */
function submit() {
  const t = title.value.trim()
  if (!t) return
  emit('submit', t)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all .22s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(8px); }
</style>

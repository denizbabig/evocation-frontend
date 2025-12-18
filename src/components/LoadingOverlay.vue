<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1400] flex items-center justify-center p-6"
        aria-live="polite"
        aria-busy="true"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="onBackdrop" />

        <!-- Card -->
        <div class="relative w-full max-w-md pointer-events-auto">
          <!-- Glow -->
          <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-40">
            <div
              class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]"
            ></div>
            <div
              class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"
            ></div>
            <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]"></div>
          </div>

          <div
            class="relative rounded-2xl bg-[#0b1228]/90 border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-purple-900/40 overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <div class="flex items-center gap-3">
                <!-- Spinner -->
                <div class="h-9 w-9 rounded-xl border border-white/10 bg-white/5 grid place-items-center" aria-hidden="true">
                  <svg class="h-5 w-5 animate-spin text-white/80" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-20" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <div
                    class="text-lg font-semibold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent"
                  >
                    {{ title }}
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ subtitle }}
                  </div>
                </div>
              </div>

              <!-- animated dots -->
              <div class="hidden sm:flex items-center gap-1 text-gray-400 text-xs" aria-hidden="true">
                <span class="animate-pulse">•</span>
                <span class="animate-pulse [animation-delay:120ms]">•</span>
                <span class="animate-pulse [animation-delay:240ms]">•</span>
              </div>
            </div>

            <!-- Body -->
            <div class="p-5">
              <div class="text-sm text-gray-300 leading-relaxed">
                {{ message }}
              </div>

              <!-- Shimmer progress -->
              <div class="mt-4 h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                <div
                  class="h-full w-1/2 bg-gradient-to-r from-purple-400/60 via-fuchsia-300/50 to-indigo-400/60 animate-[evoc-loading_1.2s_ease-in-out_infinite]"
                ></div>
              </div>

              <div v-if="hint" class="mt-3 text-[11px] text-gray-500">
                {{ hint }}
              </div>
            </div>

            <!-- Optional footer slot -->
            <div v-if="$slots.footer" class="px-5 pb-5">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  subtitle?: string
  message?: string
  hint?: string | null
  closeOnBackdrop?: boolean
}>(), {
  title: 'Shared Map',
  subtitle: 'Öffentliche Marker werden geladen…',
  message: 'Wir synchronisieren gerade die Karte. Das dauert normalerweise nur einen Moment.',
  hint: 'Tipp: Wenn der Link ungültig ist, bekommst du gleich eine Fehlermeldung.',
  closeOnBackdrop: false,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function onBackdrop() {
  if (props.closeOnBackdrop) emit('close')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes evoc-loading {
  0%   { transform: translateX(-30%); opacity: 0.6; }
  50%  { transform: translateX(60%);  opacity: 1; }
  100% { transform: translateX(140%); opacity: 0.6; }
}
</style>

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
              <!-- Progress -->
              <div class="mt-4">
                <!-- Determinate -->
                <div v-if="typeof resolvedProgress === 'number'">
                  <div class="flex items-center justify-between text-[11px] text-white/50 mb-2">
                    <span>{{ progressLabel }}</span>
                    <span class="tabular-nums">
        {{ resolvedProgress }}%
        <span v-if="etaText" class="text-white/35 ml-2">• {{ etaText }}</span>
      </span>
                  </div>

                  <div class="h-2.5 rounded-full bg-white/10 overflow-hidden border border-white/10">
                    <div
                      class="relative h-full rounded-full transition-[width] duration-300"
                      :style="{ width: `${resolvedProgress}%` }"
                    >
                      <div
                        class="absolute inset-0"
                        style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
                      />
                      <div
                        class="absolute inset-0 opacity-45 animate-evoc-shimmer"
                        style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);"
                      />
                    </div>
                  </div>
                </div>

                <!-- Indeterminate fallback -->
                <div v-else class="h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                  <div class="h-full w-1/2 bg-gradient-to-r from-purple-400/60 via-fuchsia-300/50 to-indigo-400/60 animate-[evoc-loading_1.2s_ease-in-out_infinite]" />
                </div>
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
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  subtitle?: string
  message?: string
  hint?: string | null
  closeOnBackdrop?: boolean

  // ✅ neu
  progress?: number | null              // 0..100 => determinate, null => shimmer
  progressLabel?: string               // z.B. "Upload"
  autoProgress?: boolean               // dummy loading for testing
  autoProgressSpeed?: number           // ms step interval
  autoProgressStep?: [number, number]  // random min/max step
  eta?: boolean                        // ETA anzeigen (nur bei determinate)
}>(), {
  title: 'Shared Map',
  subtitle: 'Öffentliche Marker werden geladen…',
  message: 'Wir synchronisieren gerade die Karte. Das dauert normalerweise nur einen Moment.',
  hint: 'Tipp: Wenn der Link ungültig ist, bekommst du gleich eine Fehlermeldung.',
  closeOnBackdrop: false,

  progress: null,
  progressLabel: 'Lädt',
  autoProgress: false,
  autoProgressSpeed: 220,
  autoProgressStep: () => [2, 7],
  eta: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function onBackdrop() {
  if (props.closeOnBackdrop) emit('close')
}

// --- progress handling ---
const internalProgress = ref<number | null>(null)
let timer: number | null = null

function clampProgress(p: number) {
  return Math.max(0, Math.min(100, Math.round(p)))
}

function stopTimer() {
  if (timer != null) window.clearInterval(timer)
  timer = null
}

function startAutoProgress() {
  stopTimer()
  internalProgress.value = 0

  const startedAt = Date.now()
  timer = window.setInterval(() => {
    if (!props.open) return
    const cur = internalProgress.value ?? 0

    // langsam gegen 95% "asymptotisch" laufen, damit es realistischer wirkt
    const maxTarget = 95
    if (cur >= maxTarget) return

    const [minStep, maxStep] = props.autoProgressStep
    const step = Math.floor(minStep + Math.random() * (maxStep - minStep + 1))

    // je näher an maxTarget, desto kleiner werden steps
    const slowFactor = Math.max(0.25, 1 - cur / maxTarget)
    const next = cur + step * slowFactor

    internalProgress.value = clampProgress(next)

    // (optional) nach langer Zeit minimal weiter
    if (Date.now() - startedAt > 15000 && internalProgress.value < 92) {
      internalProgress.value = clampProgress(internalProgress.value + 1)
    }
  }, props.autoProgressSpeed)
}

watch(
  () => props.open,
  (o) => {
    if (!o) {
      stopTimer()
      internalProgress.value = null
      return
    }

    // when opened
    if (props.autoProgress && props.progress == null) startAutoProgress()
    else internalProgress.value = null
  },
  { immediate: true }
)

watch(
  () => props.autoProgress,
  (v) => {
    if (!props.open) return
    if (v && props.progress == null) startAutoProgress()
    else {
      stopTimer()
      internalProgress.value = null
    }
  }
)

watch(
  () => props.progress,
  (p) => {
    // wenn echter progress kommt, dummy stoppen
    if (p != null) {
      stopTimer()
      internalProgress.value = null
    }
  }
)

onBeforeUnmount(stopTimer)

const resolvedProgress = computed<number | null>(() => {
  if (typeof props.progress === 'number') return clampProgress(props.progress)
  if (props.autoProgress && typeof internalProgress.value === 'number') return clampProgress(internalProgress.value)
  return null
})

// --- ETA (simple) ---
const startedAtRef = ref<number | null>(null)

watch(
  () => props.open,
  (o) => {
    if (o) startedAtRef.value = Date.now()
    else startedAtRef.value = null
  },
  { immediate: true }
)

const etaText = computed(() => {
  if (!props.eta) return ''
  const p = resolvedProgress.value
  if (typeof p !== 'number' || p <= 2 || p >= 100) return ''
  const startedAt = startedAtRef.value
  if (!startedAt) return ''

  const elapsed = (Date.now() - startedAt) / 1000
  const rate = p / Math.max(1, elapsed) // % pro sek
  if (rate <= 0.01) return ''

  const remaining = (100 - p) / rate // sek
  if (!isFinite(remaining) || remaining <= 0) return ''

  if (remaining < 60) return `~${Math.round(remaining)}s`
  const m = Math.floor(remaining / 60)
  const s = Math.round(remaining % 60).toString().padStart(2, '0')
  return `~${m}:${s}`
})

const progressLabel = computed(() => props.progressLabel)
</script>

<style scoped>
@keyframes evocShimmer {
  0%   { transform: translateX(-35%); }
  100% { transform: translateX(35%); }
}
.animate-evoc-shimmer {
  animation: evocShimmer 1.6s ease-in-out infinite;
  transform-origin: center;
}
</style>

<template>
  <div
    v-if="open"
    class="absolute inset-0 z-[2000] grid place-items-center px-6"
    @click.stop
    aria-busy="true"
  >
    <!-- Backdrop: Evocation Nebula (NO heavy blur) -->
    <div class="absolute inset-0">
      <!-- dark wash -->
      <div class="absolute inset-0 bg-black/55" />

      <!-- subtle nebula -->
      <div
        class="absolute inset-0 opacity-90"
        style="background: radial-gradient(circle at 50% 35%, rgba(168,85,247,0.22), rgba(14,22,44,0.92) 62%, rgba(0,0,0,0.95));"
      />

      <!-- grid whisper -->
      <div
        class="absolute inset-0 opacity-[0.14] mix-blend-screen pointer-events-none"
        style="background-image: linear-gradient(to right, rgba(255,255,255,0.22) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(255,255,255,0.22) 1px, transparent 1px);
               background-size: 96px 96px;"
      />

      <!-- vignette -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.82)_100%)]" />
    </div>

    <!-- Card -->
    <div class="relative w-full max-w-[520px]">
      <!-- Outer glow ring -->
      <div class="pointer-events-none absolute -inset-[1px] rounded-[28px] opacity-55">
        <div class="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[18px]" />
        <div class="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
        <div class="absolute inset-[1px] rounded-[26px] bg-[#0e162c]" />
      </div>

      <!-- Surface -->
      <div
        class="relative rounded-[28px] border border-white/10 ring-1 ring-white/5
               bg-[#0b1228]/78 backdrop-blur-xl overflow-hidden"
      >
        <!-- Content -->
        <div class="p-7 md:p-8">
          <div class="flex items-start gap-5">
            <!-- Loader orb -->
            <div class="shrink-0">
              <div class="relative h-12 w-12 rounded-2xl border border-white/12 bg-white/5 grid place-items-center overflow-hidden">
                <!-- soft inner glow -->
                <div
                  class="absolute -inset-6 opacity-70"
                  style="background: radial-gradient(circle, rgba(168,85,247,0.28), transparent 60%);"
                />
                <!-- orbit spinner -->
                <div class="relative h-6 w-6">
                  <div class="absolute inset-0 rounded-full border-2 border-white/20" />
                  <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-white/85 animate-spin" />
                </div>
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <div class="text-white/95 font-semibold text-lg leading-tight">
                {{ title }}
              </div>

              <div class="mt-1.5 text-white/70 text-sm leading-relaxed">
                {{ message }}
              </div>

              <div v-if="hint" class="mt-3 text-white/45 text-xs">
                {{ hint }}
              </div>

              <!-- Progress -->
              <div class="mt-5">
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
                      <!-- gradient fill -->
                      <div
                        class="absolute inset-0"
                        style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
                      />
                      <!-- moving shine -->
                      <div
                        class="absolute inset-0 opacity-45 animate-evoc-shimmer"
                        style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);"
                      />
                    </div>
                  </div>

                  <div v-if="showSteps && totalSteps > 0" class="mt-2 text-[11px] text-white/40">
                    Schritt {{ Math.min(doneSteps, totalSteps) }}/{{ totalSteps }}
                  </div>
                </div>

                <!-- Indeterminate fallback -->
                <div v-else>
                  <div class="flex items-center justify-between text-[11px] text-white/50 mb-2">
                    <span>{{ progressLabel }}</span>
                    <span class="text-white/35">…</span>
                  </div>

                  <div class="h-2.5 rounded-full bg-white/10 overflow-hidden border border-white/10">
                    <div
                      class="h-full w-1/2 bg-gradient-to-r from-purple-400/60 via-fuchsia-300/50 to-indigo-400/60 animate-[evoc-loading_1.2s_ease-in-out_infinite]"
                    />
                  </div>
                </div>
              </div>

              <!-- blockClose note -->
              <div v-if="blockClose" class="mt-5 text-[11px] text-white/40">
                Bitte nicht schließen — wir sind gleich fertig.
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom ambience -->
        <div
          class="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[520px] h-[220px] opacity-40 pointer-events-none"
          style="background: radial-gradient(circle, rgba(96,165,250,0.22), transparent 60%);"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type UploadLike = {
  uploading?: boolean
  uploaded?: any
  error?: string | null
  isVideo?: boolean
}

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  message?: string
  hint?: string
  blockClose?: boolean
  progress?: number | null
  items?: UploadLike[] | null
  videoExtraStep?: boolean
  autoProgress?: boolean
  autoProgressSpeed?: number
  autoProgressStep?: [number, number]
  progressLabel?: string
  eta?: boolean
  showSteps?: boolean
}>(), {
  title: 'Speichere Änderungen…',
  message: 'Deine Bilder und Videos werden hochgeladen.',
  hint: '',
  blockClose: true,
  progress: null,
  items: null,
  videoExtraStep: true,
  autoProgress: false,
  autoProgressSpeed: 220,
  autoProgressStep: () => [2, 7],
  progressLabel: 'Upload',
  eta: true,
  showSteps: false,
})

function clampProgress(p: number) {
  return Math.max(0, Math.min(100, Math.round(p)))
}

const totalSteps = computed(() => {
  const items = props.items ?? []
  if (!items.length) return 0
  return items.reduce((sum, it) => sum + (it?.isVideo && props.videoExtraStep ? 3 : 2), 0)
})

const doneSteps = computed(() => {
  const items = props.items ?? []
  if (!items.length) return 0

  return items.reduce((sum, it) => {
    const isVideo = !!it?.isVideo
    const baseSteps = isVideo && props.videoExtraStep ? 3 : 2

    const s1 = it?.uploading ? 1 : 0
    const s2 = it?.uploaded ? 1 : 0
    const s3 = baseSteps === 3 ? (it?.uploaded ? 1 : 0) : 0

    return sum + s1 + s2 + s3
  }, 0)
})

const stepProgressPercent = computed<number | null>(() => {
  const total = totalSteps.value
  if (!total) return null
  const done = Math.max(0, Math.min(doneSteps.value, total))
  return clampProgress((done / total) * 100)
})

const internalProgress = ref<number | null>(null)

let timer: number | null = null

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
    const maxTarget = 95
    if (cur >= maxTarget) return

    const [minStep, maxStep] = props.autoProgressStep
    const step = Math.floor(minStep + Math.random() * (maxStep - minStep + 1))

    const slowFactor = Math.max(0.25, 1 - cur / maxTarget)
    internalProgress.value = clampProgress(cur + step * slowFactor)

    if (Date.now() - startedAt > 15000 && (internalProgress.value ?? 0) < 92) {
      internalProgress.value = clampProgress((internalProgress.value ?? 0) + 1)
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

    const noReal = props.progress == null
    const noItems = !props.items?.length
    if (props.autoProgress && noReal && noItems) startAutoProgress()
    else internalProgress.value = null
  },
  { immediate: true }
)

watch(
  () => props.autoProgress,
  (v) => {
    if (!props.open) return

    const noReal = props.progress == null
    const noItems = !props.items?.length
    if (v && noReal && noItems) startAutoProgress()
    else {
      stopTimer()
      internalProgress.value = null
    }
  }
)

watch(
  () => props.progress,
  (p) => {
    if (p != null) {
      stopTimer()
      internalProgress.value = null
    }
  }
)

watch(
  () => props.items,
  () => {
    if (props.items?.length) {
      stopTimer()
      internalProgress.value = null
    }
  },
  { deep: true }
)

onBeforeUnmount(stopTimer)

const resolvedProgress = computed<number | null>(() => {
  if (typeof props.progress === 'number') return clampProgress(props.progress)
  if (props.items?.length) return stepProgressPercent.value
  if (props.autoProgress && typeof internalProgress.value === 'number') return clampProgress(internalProgress.value)
  return null
})

const progressLabel = computed(() => props.progressLabel)
const showSteps = computed(() => props.showSteps)

const startedAtRef = ref<number | null>(null)

watch(
  () => props.open,
  (o) => {
    startedAtRef.value = o ? Date.now() : null
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
  const rate = p / Math.max(1, elapsed)
  if (rate <= 0.01) return ''

  const remaining = (100 - p) / rate
  if (!isFinite(remaining) || remaining <= 0) return ''

  if (remaining < 60) return `~${Math.round(remaining)}s`

  const m = Math.floor(remaining / 60)
  const s = Math.round(remaining % 60).toString().padStart(2, '0')
  return `~${m}:${s}`
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes evocShimmer {
  0% {
    transform: translateX(-35%);
  }
  100% {
    transform: translateX(35%);
  }
}

/* used for progress shine */
.animate-evoc-shimmer {
  animation: evocShimmer 1.6s ease-in-out infinite;
  transform-origin: center;
}

@keyframes evoc-loading {
  0% {
    transform: translateX(-30%);
    opacity: 0.6;
  }
  50% {
    transform: translateX(60%);
    opacity: 1;
  }
  100% {
    transform: translateX(140%);
    opacity: 0.6;
  }
}
</style>

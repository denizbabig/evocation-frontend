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
        <!-- Top shimmer strip -->
        <div class="absolute inset-x-0 top-0 h-[2px] opacity-90">
          <div class="h-full w-full bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 animate-evoc-shimmer" />
        </div>

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
              <div v-if="typeof progress === 'number'" class="mt-5">
                <div class="flex items-center justify-between text-[11px] text-white/50 mb-2">
                  <span>Upload</span>
                  <span class="tabular-nums">{{ clampedProgress }}%</span>
                </div>

                <div class="h-2.5 rounded-full bg-white/10 overflow-hidden border border-white/10">
                  <div
                    class="relative h-full rounded-full transition-[width] duration-300"
                    :style="{ width: `${clampedProgress}%` }"
                  >
                    <!-- gradient fill -->
                    <div
                      class="absolute inset-0"
                      style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
                    />
                    <!-- moving shine -->
                    <div class="absolute inset-0 opacity-45 animate-evoc-shimmer"
                         style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);" />
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
        <div class="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[520px] h-[220px] opacity-40 pointer-events-none"
             style="background: radial-gradient(circle, rgba(96,165,250,0.22), transparent 60%);" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  message?: string
  hint?: string
  progress?: number | null
  blockClose?: boolean
}>(), {
  title: 'Speichere Änderungen…',
  message: 'Deine Bilder und Videos werden hochgeladen.',
  hint: '',
  progress: null,
  blockClose: true,
})

const clampedProgress = computed(() => {
  const p = Number(props.progress ?? 0)
  return Math.max(0, Math.min(100, Math.round(p)))
})
</script>

<style scoped>
@keyframes evocShimmer {
  0%   { transform: translateX(-35%); }
  100% { transform: translateX(35%); }
}

/* used for top strip + progress shine */
.animate-evoc-shimmer {
  animation: evocShimmer 1.6s ease-in-out infinite;
  transform-origin: center;
}
</style>

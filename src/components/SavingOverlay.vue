<template>
  <div
    v-if="open"
    class="absolute inset-0 z-[2000] flex items-center justify-center"
    @click.stop
    aria-busy="true"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/55 backdrop-blur-md" />

    <!-- Center Card -->
    <div class="relative z-10 w-full max-w-[420px] px-6">
      <div class="relative rounded-3xl p-[1px]">
        <!-- Glow -->
        <div
          class="pointer-events-none absolute -inset-[2px] rounded-3xl opacity-70 blur-[14px]"
          style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
        />
        <!-- Border -->
        <div
          class="pointer-events-none absolute inset-0 rounded-3xl opacity-100"
          style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
        />

        <!-- Surface -->
        <div class="relative rounded-3xl bg-[#0b1228]/85 border border-white/10 backdrop-blur-xl p-6">
          <div class="flex items-start gap-4">
            <!-- Spinner -->
            <div class="mt-0.5 shrink-0">
              <div class="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 grid place-items-center">
                <div class="h-5 w-5 rounded-full border-2 border-white/25 border-t-white/90 animate-spin" />
              </div>
            </div>

            <div class="min-w-0">
              <div class="text-white/95 font-semibold text-lg leading-tight">
                {{ title }}
              </div>
              <div class="mt-1 text-white/70 text-sm leading-relaxed">
                {{ message }}
              </div>

              <div v-if="hint" class="mt-3 text-white/45 text-xs">
                {{ hint }}
              </div>

              <div v-if="typeof progress === 'number'" class="mt-4">
                <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-[width] duration-300"
                    style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
                    :style="{ width: `${clampedProgress}%` }"
                  />
                </div>
                <div class="mt-2 text-xs text-white/55">
                  {{ clampedProgress }}%
                </div>
              </div>
            </div>
          </div>

          <!-- Optional: block hint -->
          <div v-if="blockClose" class="mt-5 text-[11px] text-white/40">
            Bitte warte kurz – Vorgang läuft…
          </div>
        </div>
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
  title: 'Speichern…',
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

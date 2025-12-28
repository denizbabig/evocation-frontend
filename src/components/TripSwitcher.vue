<template>
  <div class="relative">
    <!-- click-outside overlay -->
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />

    <div class="relative z-50">
      <!-- Plain square button (NO glow here – glow comes from parent .evoc-ring in MapView) -->
      <button
        @click.stop="open = !open"
        class="trip-btn"
        :title="`Trip wählen (aktuell: ${label})`"
        aria-label="Trip wählen"
      >
        <!-- Map/Trip icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5 2V6l5-2 6 2 5-2v16l-5 2-6-2Z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 4v16"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 6v16"/>
        </svg>
      </button>

      <!-- Dropdown -->
      <div
        v-if="open"
        class="absolute right-0 mt-3 w-[320px] rounded-3xl border border-white/15
               bg-[#141c34]/70 backdrop-blur-xl shadow-2xl shadow-fuchsia-900/20 overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="relative px-4 pt-4 pb-3">
          <div class="pointer-events-none absolute -inset-[1px] opacity-40">
            <div class="absolute -inset-[1px] bg-gradient-to-r from-purple-400/40 via-fuchsia-300/30 to-indigo-400/40 blur-[14px]" />
          </div>

          <div class="relative flex items-center justify-between gap-3">
            <div>
              <div class="text-[10px] text-white/45">Trip Switcher</div>
              <div class="text-base font-bold">
                <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                  Wähle deinen Trip
                </span>
              </div>
              <div class="mt-1 text-[11px] text-white/45 truncate max-w-[240px]">
                Aktiv: <span class="text-white/70">{{ label }}</span>
              </div>
            </div>

            <button
              v-if="allowCreate"
              class="h-9 px-3 rounded-2xl bg-white/5 border border-white/10 hover:border-fuchsia-500/40 hover:bg-white/10 transition text-sm"
              @click="create()"
              title="Neuen Trip erstellen"
            >
  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent font-semibold">
    + Neu
  </span>
            </button>
          </div>

          <div class="mt-3 flex items-center justify-between text-xs text-white/55">
            <span>{{ trips.length }} Trips</span>
            <span v-if="selectedId" class="text-white/40">ID: {{ selectedId }}</span>
          </div>
        </div>

        <div class="h-px bg-white/10" />

        <!-- "All markers" option -->
        <button
          class="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center justify-between gap-3"
          :class="selectedId == null ? 'bg-white/5' : ''"
          @click="select(null)"
        >
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              🌍
            </div>
            <div class="leading-tight">
              <div class="text-sm font-semibold text-white/90">Alle Marker</div>
              <div class="text-[11px] text-white/45">Kein Filter aktiv</div>
            </div>
          </div>

          <span v-if="selectedId == null" class="text-[11px] text-white/60">aktiv</span>
        </button>

        <div class="h-px bg-white/10" />

        <!-- Trips list -->
        <div class="max-h-[360px] overflow-auto">
          <button
            v-for="t in trips"
            :key="Number((t as any).id)"
            class="group w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center justify-between gap-3"
            :class="Number((t as any).id) === Number(selectedId) ? 'bg-white/5' : ''"
            @click="select(Number((t as any).id))"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="h-9 w-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center
                       group-hover:border-fuchsia-500/30 transition"
              >
                🗺️
              </div>

              <div class="min-w-0">
                <div
                  class="text-sm font-semibold truncate
                         group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-fuchsia-300 group-hover:to-indigo-400
                         group-hover:bg-clip-text group-hover:text-transparent transition"
                >
                  {{ (t as any).title?.trim?.() ? (t as any).title : `Trip #${(t as any).id}` }}
                </div>

                <div class="text-[11px] text-white/45">
                  {{ (t as any).stopCount ?? 0 }} Marker
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span
                v-if="Number((t as any).id) === Number(selectedId)"
                class="text-[11px] px-2 py-1 rounded-full bg-white/10 border border-white/15 text-white/75"
              >
                aktiv
              </span>
              <span class="text-white/25">›</span>
            </div>
          </button>
        </div>

        <div class="h-px bg-white/10" />

        <div class="px-4 py-3 text-[11px] text-white/40">
          Tipp: Trip auswählen filtert deine Marker + Route automatisch.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* Imports */
import { computed, ref } from 'vue'

/* Types */
type TripLike = { id: number | string; title?: string; stopCount?: number }

/* Props */
const props = defineProps<{
  trips: TripLike[]
  selectedId: number | null
  allowCreate?: boolean
}>()

/* Emits */
const emit = defineEmits<{
  (e: 'select', id: number | null): void
  (e: 'create'): void
}>()

/* Refs */
const open = ref(false)

/* Computeds */
const allowCreate = computed(() => props.allowCreate !== false)

const label = computed(() => {
  if (!props.selectedId) return 'Alle Marker'
  const t = props.trips.find((x) => Number(x.id) === Number(props.selectedId))
  return t?.title?.trim?.() ? t.title! : `Trip #${props.selectedId}`
})

/* UI Handlers */
function select(id: number | null) {
  open.value = false
  emit('select', id)
}

function create() {
  open.value = false
  emit('create')
}
</script>

<style scoped>
.trip-btn {
  height: 44px;
  width: 44px;
  border-radius: 16px;
  background: rgba(17, 26, 51, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 200ms;
  box-shadow: 0 10px 30px rgba(0,0,0,0.30);
}

.trip-btn:hover {
  border-color: rgba(217, 70, 239, 0.40);
  background: rgba(17, 26, 51, 0.95);
}

.trip-btn:active {
  transform: translateY(1px);
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.26); }
</style>

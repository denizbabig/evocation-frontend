<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col bg-[#0e162c] text-white font-sans overflow-x-hidden">
    <!-- Background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
        :style="{ backgroundImage: `url(${gemini2})` }"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
    </div>

    <!-- Grid overlay -->
    <div
      class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
      style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
    />

    <!-- NAV -->
    <nav class="absolute top-0 left-0 w-full z-40 flex items-center justify-start p-6 md:px-12">
      <div class="flex items-center gap-6">
        <button
          @click="isSidebarOpen = true"
          class="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition duration-200"
          aria-label="Menü öffnen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
        </button>

        <div class="flex items-center gap-2 select-none cursor-pointer" @click="$router.push('/dashboard')">
          <span class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Evocation
          </span>
        </div>
      </div>
    </nav>

    <main class="relative z-20 flex w-full max-w-7xl mx-auto flex-col items-center p-8 pt-32 pb-20">
      <!-- HERO / Suche (wie MarkersView) -->
      <header class="w-full text-center mb-16 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-lg mb-6">
          Gespeicherte
          <br />
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Shared Links
          </span>
        </h1>

        <p class="text-xl font-light leading-relaxed text-gray-300 mb-10 max-w-2xl mx-auto">
          Speichere Links von Freunden, ordne sie Personen zu und öffne ihre öffentliche Map mit einem Klick.
        </p>

        <!-- Search -->
        <div class="relative w-full max-w-2xl mx-auto">
          <div class="relative group isolate">
            <div
              class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"
            >
              <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
              <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
              <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
            </div>

            <div class="relative z-10 flex items-center gap-3 rounded-2xl bg-[#111a33]/85 backdrop-blur-xl border border-white/15 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="q"
                type="text"
                placeholder="Suchen nach Person/Label oder Code…"
                class="w-full bg-transparent border-none outline-none text-white placeholder-white/35 h-10 text-base focus:ring-0"
              />
            </div>
          </div>
        </div>
      </header>

      <!-- Sammlung -->
      <div class="w-full">
        <div class="flex items-center justify-between mb-6 px-2">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-2 h-8 rounded-full bg-gradient-to-b from-purple-400 via-fuchsia-300 to-indigo-400"></span>
            Deine Sammlung
          </h2>
          <div class="text-sm text-gray-400">
            {{ filtered.length }} Links gefunden
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="mb-6 rounded-3xl border border-red-400/20 bg-red-500/10 backdrop-blur-md p-6 text-red-200"
        >
          {{ error }}
        </div>

        <!-- Loading -->
        <div v-else-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="i in 8"
            :key="i"
            class="h-[300px] rounded-3xl bg-white/5 border border-white/10 animate-pulse"
          />
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Cards -->
          <div
            v-for="item in filtered"
            :key="item.id"
            class="group relative h-full rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1"
          >
            <!-- Gradient Border + Glow -->
            <div
              class="absolute inset-0 rounded-3xl opacity-0 blur-[12px] transition-opacity duration-300 group-hover:opacity-70"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
            />
            <div
              class="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
            />

            <!-- Card Surface -->
            <div
              class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141c34]/60 backdrop-blur-md
                     h-[330px] min-h-[300px] transition-all duration-300
                     group-hover:shadow-2xl group-hover:shadow-fuchsia-900/30 flex flex-col"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
              <div class="absolute inset-0 bg-black/15" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

              <!-- Badge -->
              <div class="absolute right-4 top-4 z-20">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white/95
                         bg-white/10 border border-white/15 backdrop-blur-md
                         group-hover:bg-white/12 group-hover:border-white/25 transition"
                  :class="item.active ? 'text-emerald-200' : 'text-red-200'"
                >
                  {{ item.active ? 'Aktiv' : 'Revoked' }}
                </span>
              </div>

              <!-- Body -->
              <div class="relative z-20 p-5 flex-1 flex flex-col">
                <div class="text-xs text-white/45 mb-2">Zugeordnet</div>

                <!-- Edit mode -->
                <div v-if="editId === item.id" class="space-y-3">
                  <input
                    v-model="editName"
                    class="w-full bg-[#0b1228]/55 border border-white/10 rounded-2xl px-4 py-2 text-white outline-none"
                    placeholder="Name / Person"
                  />
                  <div class="flex items-center justify-end gap-2">
                    <AppButton variant="secondary" size="md" @click="cancelEdit">
                      <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                        Abbrechen
                      </span>
                    </AppButton>

                    <AppButton variant="primary" size="md" @click="saveEdit(item)">
                      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                        Speichern
                      </span>
                    </AppButton>
                  </div>
                </div>

                <!-- View mode -->
                <div v-else class="flex items-center gap-3 pr-16">
                  <div
                    class="text-lg font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm transition-all duration-300
                           group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-fuchsia-300 group-hover:to-indigo-400
                           group-hover:bg-clip-text group-hover:text-transparent"
                  >
                    {{ item.label || 'Ohne Name' }}
                  </div>

                  <button
                    class="text-xs text-white/55 hover:text-white/85 transition"
                    @click="startEdit(item)"
                    title="Name bearbeiten"
                  >
                    ✎
                  </button>
                </div>

                <div class="mt-4 text-xs text-white/45">Code</div>
                <div class="mt-1 text-white/85 font-mono text-sm break-all">
                  {{ item.code }}
                </div>

                <!-- ✅ Actions (neu angeordnet) -->
                <div class="mt-auto pt-5">
                  <div class="space-y-3">
                    <!-- Primary: Open (full width) -->
                    <AppButton variant="primary" type="button" class="w-full" @click="openShared(item)">
                      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                        Öffnen
                      </span>
                    </AppButton>

                    <!-- Secondary row: Copy + Remove -->
                    <div class="grid grid-cols-2 gap-3">
                      <AppButton variant="secondary" type="button" class="w-full" @click="copy(item)">
        <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
          {{ copiedId === item.id ? 'Kopiert' : 'Kopieren' }}
        </span>
                      </AppButton>

                      <AppButton
                        variant="secondary"
                        type="button"
                        class="w-full"
                        @click="remove(item)"
                        title="Aus Liste entfernen"
                      >
        <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
          Löschen
        </span>
                      </AppButton>
                    </div>
                  </div>

                  <div class="text-[11px] text-white/40 pt-4 text-center">
                    Gespeichert: {{ formatDate(item.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Tile (wie MarkersView) -->
          <button
            @click="addOpen = true"
            class="group relative flex flex-col items-center justify-center h-full min-h-[300px] rounded-3xl border-2 border-dashed border-white/20 hover:border-transparent bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            <svg
              class="absolute inset-0 w-full h-full rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="savedlink-grad-dashed" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#a78bfa"/><stop offset="50%" stop-color="#f0abfc"/><stop offset="100%" stop-color="#60a5fa"/>
                </linearGradient>
              </defs>
              <rect
                x="1" y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="24" ry="24"
                fill="none"
                stroke="url(#savedlink-grad-dashed)"
                stroke-width="2"
                stroke-dasharray="6 6"
                stroke-linecap="round"
                vector-effect="non-scaling-stroke"
              />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg"
                 class="w-14 h-14 text-white opacity-90 group-hover:opacity-100 transition-opacity"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>

            <span class="mt-4 text-gray-400 group-hover:text-white font-semibold">
              Neuen Link hinzufügen
            </span>
          </button>
        </div>

        <!-- Empty state (wenn wirklich gar nichts da ist) -->
        <div
          v-if="!loading && !error && items.length === 0"
          class="mt-10 rounded-3xl border border-white/10 bg-[#141c34]/50 backdrop-blur-md p-8 text-white/60 text-center"
        >
          Noch keine gespeicherten Links — füge deinen ersten hinzu.
        </div>

        <!-- Empty state (Search) -->
        <div
          v-else-if="!loading && !error && items.length > 0 && filtered.length === 0 && q.trim().length"
          class="mt-10 rounded-3xl border border-white/10 bg-[#141c34]/50 backdrop-blur-md p-8 text-white/60 text-center"
        >
          Keine Treffer für <span class="text-white/85 font-semibold">“{{ q }}”</span>.
        </div>
      </div>
    </main>

    <span class="relative z-20 w-full mt-auto py-6 text-center text-xs text-gray-500">
      &copy; 2025 Evocation Systems. All rights reserved.
    </span>

    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <AddSavedLinkModal
      v-model="addOpen"
      @created="onCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AddSavedLinkModal from '@/components/AddSavedLinkModal.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import gemini2 from '@/assets/gemini2.png'
import { listSavedShareLinks, updateSavedShareLinkLabel, deleteSavedShareLink, type SavedShareLinkDTO } from '@/lib/api'

const isSidebarOpen = ref(false)

type SavedLink = SavedShareLinkDTO

const loading = ref(false)
const error = ref<string | null>(null)
const items = ref<SavedLink[]>([])
const q = ref('')

const copiedId = ref<number | null>(null)

const editId = ref<number | null>(null)
const editName = ref('')

const addOpen = ref(false)

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return items.value
  return items.value.filter(i =>
    (i.label ?? '').toLowerCase().includes(s) ||
    (i.code ?? '').toLowerCase().includes(s)
  )
})

async function reload() {
  loading.value = true
  error.value = null
  try {
    const data = await listSavedShareLinks()
    items.value = Array.isArray(data) ? data : []
  } catch (e: any) {
    console.error(e)
    error.value = e?.message ?? 'Konnte gespeicherte Links nicht laden.'
  } finally {
    loading.value = false
  }
}

function formatDate(s?: string | null) {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleString()
  } catch {
    return String(s)
  }
}

function buildSharedUrl(code: string) {
  return `${window.location.origin}/shared/${encodeURIComponent(code)}`
}

async function copy(item: SavedLink) {
  try {
    await navigator.clipboard.writeText(buildSharedUrl(item.code))
    copiedId.value = item.id
    setTimeout(() => (copiedId.value = null), 1200)
  } catch (e) {
    console.error(e)
  }
}

function openShared(item: SavedLink) {
  window.open(buildSharedUrl(item.code), '_blank', 'noopener,noreferrer')
}

function startEdit(item: SavedLink) {
  editId.value = item.id
  editName.value = item.label ?? ''
}

function cancelEdit() {
  editId.value = null
  editName.value = ''
}

async function saveEdit(item: SavedLink) {
  try {
    const updated = await updateSavedShareLinkLabel(item.id, editName.value.trim())
    item.label = updated.label ?? editName.value.trim()
    cancelEdit()
  } catch (e: any) {
    console.error(e)
    error.value = e?.message ?? 'Konnte Name nicht speichern.'
  }
}

async function remove(item: SavedLink) {
  try {
    await deleteSavedShareLink(item.id)
    items.value = items.value.filter(x => x.id !== item.id)
  } catch (e: any) {
    console.error(e)
    error.value = e?.message ?? 'Konnte Link nicht löschen.'
  }
}

function onCreated(created: SavedLink) {
  items.value = [created, ...items.value]
}

onMounted(reload)
</script>

<style scoped>
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0e162c; }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #4b5563; }
</style>

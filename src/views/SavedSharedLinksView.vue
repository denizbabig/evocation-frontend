<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col bg-[#0e162c] text-white font-sans overflow-x-hidden">

    <!-- Background wie Dashboard -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
        :style="{ backgroundImage: `url(${gemini2})` }"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
    </div>

    <!-- leises Grid -->
    <div
      class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
      style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
    />

    <!-- NAV (wie Dashboard) -->
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

    <main class="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">

      <!-- HERO -->
      <header class="w-full max-w-5xl mx-auto mb-10">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Gespeicherte
              <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                Shared Links
              </span>
            </h1>
            <p class="text-white/60 mt-3 text-base md:text-lg max-w-2xl">
              Speichere Links von Freunden & ordne sie Personen zu. Öffne ihre öffentliche Map mit einem Klick.
            </p>

            <!-- kleine Stats -->
            <div class="mt-5 flex flex-wrap gap-3">
              <div class="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-sm text-white/80">
                <span class="text-white/50 mr-2">Gesamt</span>
                <span class="font-semibold text-white">{{ items.length }}</span>
              </div>
              <div class="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-sm text-white/80">
                <span class="text-white/50 mr-2">Aktiv</span>
                <span class="font-semibold text-white">{{ activeCount }}</span>
              </div>
              <div class="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-sm text-white/80">
                <span class="text-white/50 mr-2">Revoked</span>
                <span class="font-semibold text-white">{{ revokedCount }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-3 md:justify-end">
            <AppButton variant="secondary" size="md" @click="reload" class="w-full sm:w-auto">
  <span class="whitespace-nowrap bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
    Aktualisieren
  </span>
            </AppButton>

            <AppButton variant="primary" size="md" @click="addOpen = true" class="w-full sm:w-auto">
  <span class="whitespace-nowrap bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
    + Link hinzufügen
  </span>
            </AppButton>
          </div>
        </div>

        <!-- SEARCH -->
        <div class="mt-8 relative group isolate">
          <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-40">
            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
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
      </header>

      <!-- STATES -->
      <div class="max-w-5xl mx-auto">

        <div v-if="error" class="rounded-2xl bg-red-500/10 border border-red-400/20 px-5 py-4 text-sm text-red-200">
          {{ error }}
        </div>

        <!-- Loading Skeleton (wie Dashboard) -->
        <div v-else-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="i in 6"
            :key="i"
            class="h-[220px] rounded-3xl bg-white/5 border border-white/10 animate-pulse"
          />
        </div>

        <!-- Empty State -->
        <!-- Empty: Search has no results -->
        <div v-else-if="filtered.length === 0 && q.trim().length" class="relative isolate rounded-3xl p-[1px]">
          <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-50">
            <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[14px]" />
            <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]/70" />
          </div>

          <div class="relative rounded-3xl border border-white/15 bg-[#111a33]/85 backdrop-blur-xl p-8">
            <h3 class="text-2xl font-bold mb-2">
              Keine Treffer
            </h3>
            <p class="text-white/60 mb-6">
              Für <span class="text-white/85 font-semibold">“{{ q }}”</span> wurde nichts gefunden.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">

            </div>
          </div>
        </div>

        <!-- Empty: No items at all -->
        <div v-else-if="filtered.length === 0" class="relative isolate rounded-3xl p-[1px]">
          <!-- dein bisheriger “Noch keine Links gespeichert” Block (kann bleiben) -->
        </div>

        <!-- Cards (Dashboard-Card Vibe) -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="item in filtered"
            :key="item.id"
            class="relative group isolate w-full max-w-sm"
          >
            <!-- HOVER GLOW (nur Hintergrund, kein “Border Shiny”) -->
            <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300">
              <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]" />
              <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
              <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]" />
            </div>

            <!-- SURFACE (bleibt immer gleich, kein hover transform) -->
            <div class="relative rounded-3xl border border-white/10 bg-[#141c34]/60 backdrop-blur-md p-5 overflow-hidden">
              <!-- badge active/revoked -->
              <div class="absolute right-5 top-5">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide
                         bg-white/10 border border-white/15 backdrop-blur-md"
                  :class="item.active ? 'text-emerald-200' : 'text-red-200'"
                >
                  {{ item.active ? 'Aktiv' : 'Revoked' }}
                </span>
              </div>

              <!-- content -->
              <!-- content (centered) -->
              <div class="w-full flex flex-col items-center text-center pt-2">
                <div class="text-xs text-white/45 mb-2">Zugeordnet</div>

                <!-- Inline edit -->
                <div v-if="editId === item.id" class="w-full max-w-md flex flex-col sm:flex-row gap-2 justify-center">
                  <input
                    v-model="editName"
                    class="w-full bg-[#0b1228]/55 border border-white/10 rounded-2xl px-4 py-2 text-white outline-none text-center"
                    placeholder="Name / Person"
                  />
                  <div class="flex gap-2 justify-center">

                    <AppButton variant="primary" size="md" @click="saveEdit(item)">
                      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">Speichern</span>
                    </AppButton>
                  </div>
                </div>

                <div v-else class="flex items-center justify-center gap-2 min-w-0">
                  <div
                    class="text-xl font-semibold leading-tight line-clamp-1 text-white transition-all duration-300
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

                <div class="mt-5 text-xs text-white/45">Code</div>
                <div class="mt-1 text-white/85 font-mono text-sm break-all max-w-md">
                  {{ item.code }}
                </div>
              </div>

              <!-- actions row -->
              <!-- actions row -->
              <div class="mt-6 flex justify-center">
                <div class="inline-flex flex-wrap items-center justify-center gap-3">
                  <AppButton variant="secondary" type="button" @click="copy(item)">
      <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
        {{ copiedId === item.id ? 'Kopiert' : 'Kopieren' }}
      </span>
                  </AppButton>

                  <AppButton variant="primary" type="button" @click="openShared(item)">
      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
        Öffnen
      </span>
                  </AppButton>

                  <button
                    class="h-11 w-11 rounded-2xl bg-black/30 border border-white/15 backdrop-blur
             grid place-items-center hover:bg-black/45 hover:border-white/25 transition
             leading-none text-lg"
                    @click="remove(item)"
                    title="Aus Liste entfernen"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div class="text-[11px] text-white/40 pt-4 text-center">
                Gespeichert: {{ formatDate(item.createdAt) }}
              </div>
            </div>
          </div>
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
import { apiFetch } from '@/lib/api'
import AddSavedLinkModal from "@/components/AddSavedLinkModal.vue";
import { listSavedShareLinks, updateSavedShareLinkLabel, deleteSavedShareLink, type SavedShareLinkDTO } from '@/lib/api'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import gemini2 from '@/assets/gemini2.png'

const isSidebarOpen = ref(false)

const activeCount = computed(() => items.value.filter(x => x.active).length)
const revokedCount = computed(() => items.value.filter(x => !x.active).length)
/**
 * 🔧 EINMAL anpassen, falls dein Backend anders heißt:
 * z.B. '/share/saved' oder '/share-links/saved'
 */
const API_BASE = '/share/saved'

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
    const d = new Date(s)
    return d.toLocaleString()
  } catch {
    return s
  }
}

function buildSharedUrl(code: string) {
  // ihr nutzt bereits /shared/:code
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

function cancelEdit() {
  editId.value = null
  editName.value = ''
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
  // oben einsortieren
  items.value = [created, ...items.value]
}

onMounted(reload)
</script>

<!-- src/components/GeoSearchBox.vue -->
<template>
  <div
    class="relative w-full"
    @keydown.down.prevent="moveSel(1)"
    @keydown.up.prevent="moveSel(-1)"
    @keydown.enter.prevent="onEnter"
  >
    <!-- WRAPPER nur für die Suchleiste -->
    <div class="relative isolate">
      <!-- Evocation-Glow (optional) -->
      <div
        v-if="glow"
        aria-hidden="true"
        class="pointer-events-none absolute -inset-[1px] rounded-2xl transition-opacity duration-300"
        :class="(open || activeIndex >= 0) ? 'opacity-90' : 'opacity-70'"
      >
        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]"></div>
        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"></div>
        <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]"></div>
      </div>

      <!-- Suchleiste -->
      <div
        :class="[
          'relative z-10 flex items-center gap-2 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2',
          shadow ? 'shadow-xl shadow-fuchsia-900/20' : ''
        ]"
      >
        <div class="pl-1 pr-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
          </svg>
        </div>

        <input
          ref="inputEl"
          :value="modelValue"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          type="text"
          :placeholder="placeholder"
          class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0"
          autocomplete="off"
        />

        <AppButton
          v-if="props.showSearchButton"
          variant="primary"
          class="shrink-0"
          :disabled="isSearching"
          @click="searchNow"
        >
          <span v-if="!isSearching" class="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">Suchen</span>
          <span v-else class="opacity-80 bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">Suche…</span>
        </AppButton>
      </div>
    </div>

    <!-- Vorschläge -->
    <transition name="fade">
      <ul
        v-if="open && suggestions.length"
        class="absolute left-0 right-0 top-[calc(100%+10px)] bg-[#0b1228]/95 border border-white/12 rounded-2xl shadow-2xl shadow-black/40 overflow-auto max-h-80 z-50 p-1"
        role="listbox"
      >
        <li
          v-for="(s, i) in suggestions"
          :key="i"
          @mousedown.prevent="pick(i)"
          :class="[
            'relative isolate flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
            i === activeIndex ? 'z-10 text-white' : 'hover:bg-white/5'
          ]"
          role="option"
          :aria-selected="i === activeIndex"
        >
          <!-- Aktiver Zeilen-Glow -->
          <div
            :class="[
              'pointer-events-none absolute -inset-[1px] rounded-xl transition duration-300',
              i === activeIndex ? 'opacity-100' : 'opacity-0'
            ]"
          >
            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]"></div>
            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20"></div>
            <div class="absolute inset-[1px] rounded-[10px] bg-[#0b1228]"></div>
          </div>

          <div class="mt-0.5 relative z-20">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" viewBox="0 0 24 24">
              <defs>
                <linearGradient :id="`evoc-grad-${i}`" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#a78bfa"/>
                  <stop offset="0.5" stop-color="#f0abfc"/>
                  <stop offset="1" stop-color="#60a5fa"/>
                </linearGradient>
              </defs>
              <path :fill="`url(#evoc-grad-${i})`" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7.5 7.5 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
            </svg>
          </div>

          <div class="min-w-0 relative z-20">
            <div class="text-sm md:text-[15px] text-white font-medium truncate" v-html="highlightTitle(s.display_name)"></div>
            <div class="text-[11px] md:text-xs text-gray-400 truncate" v-if="subtitle(s.display_name)">
              {{ subtitle(s.display_name) }}
            </div>
          </div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
/* Imports */
import { computed, ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import { geocodeSearch, geocodeSuggest } from '@/lib/geocode'

/* Types */
type SuggestItem = { lat: number; lon: number; display_name: string }
type SearchItem = { lat: string; lon: string; display_name: string }

/* Props / Emits */
const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    minChars?: number
    debounceMs?: number
    suggestLimit?: number
    suggestLang?: string
    searchLimit?: number
    glow?: boolean
    shadow?: boolean
    showSearchButton?: boolean
  }>(),
  {
    placeholder: 'Ort suchen',
    minChars: 3,
    debounceMs: 280,
    suggestLimit: 7,
    suggestLang: 'de',
    searchLimit: 5,
    glow: true,
    shadow: true,
    showSearchButton: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'select', payload: SuggestItem): void
  (e: 'search', payload: { query: string; results: SearchItem[]; best?: SearchItem }): void
}>()

/* State */
const inputEl = ref<HTMLInputElement | null>(null)
const open = ref(false)
const suggestions = ref<SuggestItem[]>([])
const activeIndex = ref(-1)
const isSearching = ref(false)

let debounceHandle: number | undefined
let suggestSeq = 0

const query = computed(() => (props.modelValue ?? '').trim())
const BLUR_CLOSE_MS = 110

/* Helpers */
function splitParts(s: string) {
  return s.split(',').map(x => x.trim()).filter(Boolean)
}

function subtitle(s: string) {
  const p = splitParts(s)
  return p.length > 1 ? p[p.length - 1] : ''
}

function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightTitle(displayName: string) {
  const title = splitParts(displayName)[0] || displayName
  const q = query.value
  if (!q) return escapeHtml(title)

  const re = new RegExp(escapeRegExp(q), 'ig')
  let last = 0
  let out = ''

  for (const m of title.matchAll(re)) {
    const start = m.index ?? 0
    const end = start + m[0].length
    out += escapeHtml(title.slice(last, start))
    out += `<span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">${escapeHtml(
      title.slice(start, end)
    )}</span>`
    last = end
  }

  out += escapeHtml(title.slice(last))
  return out
}

function resetSuggestions() {
  suggestions.value = []
  open.value = false
  activeIndex.value = -1
}

function setSuggestions(list: SuggestItem[]) {
  suggestions.value = list
  open.value = list.length > 0
  activeIndex.value = list.length ? 0 : -1
}

/* Suggest (debounced) */
async function fetchSuggestions(q: string) {
  const seq = ++suggestSeq
  try {
    const list = await geocodeSuggest(q, props.suggestLimit, props.suggestLang)
    if (seq !== suggestSeq) return // stale response
    setSuggestions(list)
  } catch (err) {
    if (seq !== suggestSeq) return
    console.warn('suggest failed:', err)
    resetSuggestions()
  }
}

/* Events */
function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)

  window.clearTimeout(debounceHandle)

  if (v.trim().length < props.minChars) {
    resetSuggestions()
    return
  }

  debounceHandle = window.setTimeout(() => fetchSuggestions(v.trim()), props.debounceMs)
}

function onFocus() {
  if (suggestions.value.length) open.value = true
}

function onBlur() {
  window.setTimeout(() => {
    open.value = false
  }, BLUR_CLOSE_MS)
}

function moveSel(delta: number) {
  if (!open.value || !suggestions.value.length) return
  const n = suggestions.value.length
  activeIndex.value = (activeIndex.value + delta + n) % n
}

function pick(i: number) {
  const s = suggestions.value[i]
  if (!s) return
  emit('update:modelValue', s.display_name)
  open.value = false
  emit('select', s)
}

/* Search */
async function searchNow() {
  const q = query.value
  if (!q) return

  isSearching.value = true
  try {
    const results = await geocodeSearch(q, props.searchLimit)
    emit('search', { query: q, results, best: results[0] || undefined })
  } catch (e) {
    console.error('search failed:', e)
    emit('search', { query: q, results: [] })
  } finally {
    isSearching.value = false
    open.value = false
  }
}

function onEnter() {
  if (open.value && activeIndex.value >= 0) pick(activeIndex.value)
  else searchNow()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1400] flex flex-col items-center justify-center px-6 py-10"
        @click="busy ? null : emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/65 backdrop-blur-md"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.18),_rgba(14,22,44,0.92)_65%,_rgba(0,0,0,0.95))]" />

        <!-- Stepper -->
        <div class="relative z-20 w-full max-w-[420px] flex items-center justify-center mb-8 pointer-events-auto" @click.stop>
          <div class="w-full relative">
            <div class="absolute left-[6px] right-[6px] top-[6px] h-[2px] rounded-full bg-white/10 z-0" />
            <div
              class="absolute left-[6px] right-[6px] top-[6px] h-[2px] rounded-full z-0 origin-left transition-transform duration-300"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
              :style="{ transform: `scaleX(${stepProgress})` }"
            />
            <div class="relative z-10 grid grid-cols-3">
              <div class="flex flex-col items-start gap-3 select-none">
                <div class="relative">
                  <div v-if="step === 0" class="pointer-events-none absolute -inset-2 rounded-full opacity-60"
                       style="background: radial-gradient(circle, rgba(168,85,247,.35), transparent 70%);" />
                  <div class="h-3 w-3 rounded-full border border-white/15"
                       :class="step >= 0 ? 'bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400' : 'bg-[#0e162c]'" />
                </div>
                <div class="text-[11px] tracking-wide" :class="step >= 0 ? 'text-white/90' : 'text-white/35'">{{ steps[0] }}</div>
              </div>

              <div class="flex flex-col items-center gap-3 select-none">
                <div class="relative">
                  <div v-if="step === 1" class="pointer-events-none absolute -inset-2 rounded-full opacity-60"
                       style="background: radial-gradient(circle, rgba(168,85,247,.35), transparent 70%);" />
                  <div class="h-3 w-3 rounded-full border border-white/15"
                       :class="step >= 1 ? 'bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400' : 'bg-[#0e162c]'" />
                </div>
                <div class="text-[11px] tracking-wide" :class="step >= 1 ? 'text-white/90' : 'text-white/35'">{{ steps[1] }}</div>
              </div>

              <div class="flex flex-col items-end gap-3 select-none">
                <div class="relative">
                  <div v-if="step === 2" class="pointer-events-none absolute -inset-2 rounded-full opacity-60"
                       style="background: radial-gradient(circle, rgba(168,85,247,.35), transparent 70%);" />
                  <div class="h-3 w-3 rounded-full border border-white/15"
                       :class="step >= 2 ? 'bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400' : 'bg-[#0e162c]'" />
                </div>
                <div class="text-[11px] tracking-wide" :class="step >= 2 ? 'text-white/90' : 'text-white/35'">{{ steps[2] }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Card -->
        <div class="relative z-20 w-full max-w-[1200px] pointer-events-auto" @click.stop>
          <div class="relative">
            <!-- Glow -->
            <div class="pointer-events-none absolute -inset-[1px] rounded-[28px] opacity-45">
              <div class="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]" />
              <div class="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
              <div class="absolute inset-[1px] rounded-[26px] bg-[#0e162c]" />
            </div>

            <div class="relative rounded-[28px] bg-[#0b1228]/75 border border-white/10 ring-1 ring-white/5
                        backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-900/30
                        h-[680px] max-h-[80dvh] flex flex-col">
              <!-- Step badge -->
              <div class="absolute top-6 right-6 z-20">
                <div class="rounded-2xl px-4 py-2 text-sm text-white/90 bg-white/5 border border-white/10">
                  {{ step + 1 }}/3
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 overflow-y-auto px-10 py-10">
                <!-- STEP 1: Medien -->
                <div v-if="step === 0">
                  <h2 class="text-3xl font-semibold text-white/90 text-center">Bildergalerie</h2>
                  <p class="text-center text-white/90 mt-2">
                    {{ pendingMedia.length }} Medium{{ pendingMedia.length === 1 ? '' : 's' }} ausgewählt
                  </p>

                  <div class="relative mt-12">
                    <div
                      ref="scrollEl"
                      class="flex gap-8 overflow-x-auto overflow-y-visible pl-4 pt-4 pb-10 pr-20 scroll-smooth evoc-scroll"
                      @scroll="onScroll"
                    >
                      <!-- Tiles -->
                      <div
                        v-for="p in pendingMedia"
                        :key="p.id"
                        class="relative shrink-0 w-[240px] h-[360px] rounded-[22px] overflow-hidden bg-white/5 border border-white/10"
                      >
                        <button
                          type="button"
                          class="absolute top-3 right-3 z-20 h-10 w-10 rounded-xl
                                 bg-black/45 border border-white/15 backdrop-blur
                                 grid place-items-center
                                 hover:bg-black/60 hover:border-white/25 transition"
                          :disabled="p.uploading"
                          @click.stop="removePending(p.id)"
                          aria-label="Medium entfernen"
                        >
                          🗑️
                        </button>

                        <img v-if="p.kind === 'image'" :src="p.previewUrl" class="h-full w-full object-cover" draggable="false" />
                        <video v-else :src="p.previewUrl" class="h-full w-full object-cover" muted playsinline preload="metadata" />

                        <!-- Status -->
                        <div class="absolute bottom-3 left-3 z-20 text-[11px] px-3 py-2 rounded-xl bg-black/45 border border-white/15 backdrop-blur">
                          <span v-if="p.uploading">⚙️ Upload…</span>
                          <span v-else-if="p.uploaded">✅ Uploaded</span>
                          <span v-else>⏸️ Pending</span>
                        </div>

                        <!-- Cover -->
                        <button
                          type="button"
                          class="absolute left-4 top-3 rounded-xl bg-black/45 backdrop-blur border border-white/15 px-4 py-2 text-sm text-white/90
                                 hover:bg-[#0b1228]/95 transition"
                          @click.stop="setCover(p.id)"
                        >
                          <span v-if="p.isCover">🌟Cover</span>
                          <span v-else>☆Als Cover</span>
                        </button>
                      </div>

                      <!-- Add tile -->
                      <button
                        type="button"
                        class="relative shrink-0 w-[240px] h-[360px] rounded-[22px] border border-dashed border-white/15 bg-white/[0.03]
                               hover:bg-white/[0.05] transition flex flex-col items-center justify-center gap-4"
                        @click="pickFiles"
                      >
                        <div class="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 grid place-items-center text-white/80">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                          </svg>
                        </div>
                        <div class="text-white/70 text-sm">Medium hinzufügen</div>
                      </button>
                    </div>

                    <!-- Arrow hints -->
                    <button
                      v-if="showScrollLeft"
                      type="button"
                      class="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full
                             bg-black/35 border border-white/20 backdrop-blur shadow-lg shadow-black/30
                             hover:bg-black/45 hover:border-white/30 transition grid place-items-center"
                      @click="scrollLeft"
                      aria-label="Nach links scrollen"
                    >
                      <span class="text-white/95 text-3xl leading-none translate-y-[-1px]">‹</span>
                    </button>

                    <button
                      v-if="showScrollRight"
                      type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full
                             bg-black/35 border border-white/20 backdrop-blur shadow-lg shadow-black/30
                             hover:bg-black/45 hover:border-white/30 transition grid place-items-center"
                      @click="scrollRight"
                      aria-label="Nach rechts scrollen"
                    >
                      <span class="text-white/95 text-3xl leading-none translate-y-[-1px]">›</span>
                    </button>

                    <input
                      ref="fileInputEl"
                      type="file"
                      class="hidden"
                      accept="image/*,video/*"
                      multiple
                      @change="onPickFiles"
                    />
                  </div>

                  <div class="mt-6 max-w-xl mx-auto">
                    <p v-if="uploadError" class="mt-2 text-sm text-red-300 text-center">{{ uploadError }}</p>

                    <AppButton
                      type="button"
                      variant="primary"
                      class="w-full h-12 flex items-center justify-center"
                      :disabled="!canUpload || busy"
                      @click="uploadAll"
                    >
                      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                        {{ uploading ? 'Hochladen…' : 'Medien hochladen' }}
                      </span>
                    </AppButton>

                    <p v-if="pendingMedia.length && !allUploaded" class="mt-2 text-xs text-white/50 text-center">
                      Hinweis: Wenn du Medien hinzugefügt hast, bitte erst hochladen, dann speichern.
                    </p>
                  </div>
                </div>

                <!-- STEP 2: Details -->
                <div v-else-if="step === 1">
                  <h2 class="text-3xl font-semibold text-white/90 text-center">Details hinzufügen</h2>
                  <p class="text-center text-white/90 mt-2">Erzähle deine Geschichte</p>

                  <div class="mt-10 max-w-3xl mx-auto space-y-6">
                    <!-- Titel -->
                    <div class="relative group isolate">
                      <GlowInputShell />
                      <div class="relative z-10 flex items-center rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                        <input
                          v-model="form.title"
                          type="text"
                          placeholder="Titel"
                          class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0"
                        />
                      </div>
                    </div>

                    <!-- Ort -->
                    <div v-if="props.showPlaceSearch" class="relative group isolate rounded-2xl z-20">
                      <GlowInputShell />
                      <div class="relative z-30">
                        <GeoSearchBox
                          v-model="placeQuery"
                          placeholder="Ort suchen und setzen…"
                          :glow="false"
                          :shadow="false"
                          @select="onSelectPlace"
                          @search="onPlaceSearch"
                        />
                      </div>
                    </div>

                    <!-- Optional: kleines Info-Row wenn ausgeblendet -->

                    <!-- Datum + Trip nebeneinander -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Datum -->
                      <div>
                        <div class="relative group isolate" @click="openDatePicker">
                          <GlowInputShell />
                          <div class="relative z-10 flex items-center gap-2 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                            <div class="pl-1 pr-2 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/>
                              </svg>
                            </div>
                            <input
                              :value="dateDisplay"
                              type="text"
                              readonly
                              placeholder="Datum auswählen"
                              class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0 cursor-pointer"
                            />
                          </div>

                          <input
                            ref="dateInput"
                            v-model="form.occurredAt"
                            type="date"
                            class="absolute inset-0 opacity-0 cursor-pointer [color-scheme:dark]"
                            @click.stop
                            aria-label="Datum auswählen"
                          />
                        </div>
                      </div>

                      <!-- Trip -->
                      <div>
                        <div class="relative group isolate">
                          <GlowInputShell />
                          <div class="relative z-10 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                            <select
                              v-model="selectedTripId"
                              class="w-full bg-transparent border-none outline-none text-white h-11 md:h-12 text-base md:text-lg focus:ring-0"
                            >
                              <option :value="null" class="bg-[#1a233e] text-gray-400">Keinem Trip zugeordnet</option>
                              <option v-for="t in tripOptions" :key="t.id" :value="t.id" class="bg-[#1a233e]">
                                {{ t.title }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Kategorie + Visibility + Trip -->
                    <!-- Kategorie + Visibility + Trip -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Kategorie -->
                      <div>
                        <div class="relative group isolate">
                          <GlowInputShell />
                          <div class="relative z-10 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                            <select
                              v-model.number="form.categoryId"
                              class="w-full bg-transparent border-none outline-none text-white h-11 md:h-12 text-base md:text-lg focus:ring-0"
                            >
                              <option :value="null" class="bg-[#1a233e] text-gray-400">– keine –</option>
                              <option v-for="c in categories" :key="c.id" :value="c.id" class="bg-[#1a233e]">
                                {{ c.label }}
                              </option>
                            </select>
                          </div>
                        </div>


                      </div>

                      <!-- Visibility -->
                      <div>
                        <div class="relative group isolate">
                          <GlowInputShell />
                          <div
                            class="relative z-10 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2 flex items-center justify-between"
                          >
                            <div class="text-white/85 pl-2">
                              Sichtbarkeit:
                              <span class="font-semibold">{{ form.visibility === 'PUBLIC' ? 'Öffentlich' : 'Privat' }}</span>
                            </div>

                            <AppButton type="button" variant="secondary" size="md" class="h-11" :disabled="busy" @click="toggleVisibility">
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Toggle
          </span>
                            </AppButton>
                          </div>
                        </div>


                      </div>

                      <!-- Trip (optional) -->

                    </div>
                    <!-- Beschreibung -->
                    <div class="relative group isolate">
                      <GlowInputShell />
                      <div class="relative z-10 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                        <textarea
                          v-model="form.description"
                          rows="7"
                          placeholder="Beschreibung"
                          class="block w-full bg-transparent border-none outline-none text-white placeholder-gray-500 text-base md:text-lg focus:ring-0 resize-none"
                        />
                      </div>
                    </div>

                    <div v-if="pendingMedia.length && !allUploaded" class="text-sm text-red-200/90 text-center">
                      Du hast Medien hinzugefügt, aber noch nicht hochgeladen. Bitte erst hochladen (Step 1).
                    </div>
                  </div>
                </div>

                <!-- STEP 3: Review -->
                <div v-else>
                  <h2 class="text-3xl font-semibold text-white/90 text-center">Bereit zum Speichern</h2>
                  <p class="text-center text-white/90 mt-2">Alles sieht perfekt aus!</p>

                  <div class="mt-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
                    <!-- Preview -->
                    <div class="relative group isolate h-[400px] rounded-3xl">
                      <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300">
                        <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                        <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                        <div class="absolute inset-[1px] rounded-[calc(1.5rem-1px)] bg-[#0e162c]" />
                      </div>

                      <div class="relative z-10 h-[400px] overflow-hidden rounded-3xl bg-[#141c34]/60 backdrop-blur-md border border-white/10">
                        <img
                          v-if="coverPreview"
                          :src="coverPreview"
                          class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <div v-else class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

                        <div class="absolute inset-0 bg-black/15" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                        <div class="absolute left-0 bottom-0 z-20 w-full p-5">
                          <div class="text-lg font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm">
                            {{ form.title?.trim() || 'Ohne Titel' }}
                          </div>

                          <div class="mt-2 flex items-center gap-2 text-sm text-white/80">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7.5-3.358 7.5-10.5a7.5 7.5 0 1 0-15 0C4.5 17.642 12 21 12 21z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5a2.25 2.25 0 1 0 0 .001z"/>
                            </svg>
                            <span class="truncate">{{ form.placeName || 'Ort unbekannt' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Summary -->
                    <div class="space-y-5 min-w-0">
                      <SummaryBox label="Titel" :value="form.title?.trim() || '—'" />
                      <SummaryBox label="Ort" :value="form.placeName || '—'" />
                      <!-- Datum + Trip nebeneinander -->
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <SummaryBox label="Datum" :value="form.occurredAt || '—'" />
                        <SummaryBox label="Trip (optional)" :value="selectedTripLabel || '—'" />
                      </div>

                      <SummaryBox label="Sichtbarkeit" :value="form.visibility === 'PUBLIC' ? 'Öffentlich' : 'Privat'" />
                      <SummaryBox label="Beschreibung" :value="form.description || '—'" multiline />

                      <div v-if="pendingMedia.length && !allUploaded" class="rounded-2xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200">
                        Medien sind noch nicht hochgeladen. Bitte zurück zu Schritt 1 und „Medien hochladen“.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-8 flex items-center justify-between">
            <AppButton :disabled="busy" variant="secondary" size="md" @click="emit('close')">
              <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                Abbrechen
              </span>
            </AppButton>

            <div class="flex items-center gap-4">
              <AppButton v-if="step > 0" :disabled="busy" variant="secondary" size="md" @click="step = step - 1">
                <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                  Zurück
                </span>
              </AppButton>

              <AppButton v-if="step < 2" :disabled="busy" variant="primary" size="md" @click="nextStep">
                <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent min-w-20">
                  Weiter
                </span>
              </AppButton>

              <AppButton v-else :disabled="busy || !isValid || (pendingMedia.length > 0 && !allUploaded)" variant="primary" size="md" @click="onSubmit">
                <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                  Speichern
                </span>
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import GeoSearchBox from '@/components/GeoSearchBox.vue'
import { primaryLabel } from '@/lib/reverseGeocode'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { ImageAsset } from '@/types/ImageAsset'
import type { NewMarker } from '@/types/Marker'
import type { Visibility } from '@/types/Marker'
import { useTripStore } from '@/stores/TripStore'
import { storeToRefs } from 'pinia'
import { computed, defineComponent, h, onBeforeUnmount, reactive, ref, watch } from 'vue'

type CategoryOption = { id: number; label: string }

type PendingMedia = {
  id: string
  file: File
  previewUrl: string
  kind: 'image' | 'video'
  uploading: boolean
  uploaded?: ImageAsset
  error?: string | null
  isCover: boolean
}

const props = withDefaults(defineProps<{
  open: boolean
  categories?: CategoryOption[]
  saving?: boolean
  defaultLat?: number
  defaultLng?: number
  useGeolocation?: boolean
  showPlaceSearch?: boolean
}>(), {
  categories: () => [
    { id: 1, label: 'Reise' },
    { id: 2, label: 'Essen' },
    { id: 3, label: 'Sightseeing' },
    { id: 4, label: 'Shopping' },
  ],
  saving: false,
  defaultLat: 52.520008,
  defaultLng: 13.404954,
  useGeolocation: true,
  showPlaceSearch: true,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { marker: NewMarker; tripId: number | null }): void
}>()

const categories = computed(() => props.categories ?? [])

const steps = ['Bilder', 'Details', 'Überprüfen']
const step = ref(0)
const stepProgress = computed(() => step.value / (steps.length - 1))

/** Trip Dropdown */
const tripStore = useTripStore()
const { trips } = storeToRefs(tripStore)
const selectedTripId = ref<number | null>(null)

const tripOptions = computed(() =>
  (trips.value ?? []).map(t => ({ id: Number(t.id), title: (t.title ?? 'Ohne Titel') }))
)

const selectedTripLabel = computed(() => {
  if (!selectedTripId.value) return null
  return tripOptions.value.find(t => t.id === selectedTripId.value)?.title ?? null
})

/** Form */
function ymd(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const placeQuery = ref('')

const form = reactive<NewMarker>({
  title: '',
  description: '',
  categoryId: null,
  occurredAt: ymd(),
  lat: props.defaultLat,
  lng: props.defaultLng,
  images: [],
  visibility: 'PRIVATE',
  placeName: null,
})

const isValid = computed(() => !!form.title?.trim() && !!form.occurredAt)

/** Media state (wie vorher) */
const pendingMedia = ref<PendingMedia[]>([])
const uploadError = ref<string | null>(null)
const uploading = ref(false)

const fileInputEl = ref<HTMLInputElement | null>(null)
const scrollEl = ref<HTMLDivElement | null>(null)

function uid() {
  return crypto.randomUUID?.() ?? String(Math.random()).slice(2)
}

function clearPending() {
  for (const p of pendingMedia.value) URL.revokeObjectURL(p.previewUrl)
  pendingMedia.value = []
  uploadError.value = null
}
onBeforeUnmount(clearPending)

const canUpload = computed(() =>
  pendingMedia.value.length > 0 &&
  pendingMedia.value.some(p => !p.uploaded) &&
  !pendingMedia.value.some(p => p.uploading)
)

const allUploaded = computed(() =>
  pendingMedia.value.length > 0 && pendingMedia.value.every(p => !!p.uploaded)
)

const coverPreview = computed(() => {
  const cover = pendingMedia.value.find(p => p.isCover) ?? pendingMedia.value[0]
  if (!cover) return null
  return cover.previewUrl
})

function pickFiles() {
  fileInputEl.value?.click()
}

function addFiles(files: File[]) {
  const accepted = files.filter(f => f.type?.startsWith('image/') || f.type?.startsWith('video/'))
  if (!accepted.length) return

  const VIDEO_LIMIT = 2
  const existingVideoCount = pendingMedia.value.filter(p => p.kind === 'video').length
  const incomingVideos = accepted.filter(f => f.type?.startsWith('video/'))
  const maxVideosWeCanAdd = Math.max(0, VIDEO_LIMIT - existingVideoCount)

  if (incomingVideos.length > maxVideosWeCanAdd) {
    uploadError.value = `Du kannst aktuell maximal ${VIDEO_LIMIT} Videos pro Marker hinzufügen.`
  }

  let videosAdded = 0

  for (const file of accepted) {
    const kind: 'image' | 'video' = file.type?.startsWith('video/') ? 'video' : 'image'

    if (kind === 'video') {
      if (existingVideoCount + videosAdded >= VIDEO_LIMIT) continue
      videosAdded++
    }

    const previewUrl = URL.createObjectURL(file)
    pendingMedia.value.push({
      id: uid(),
      file,
      previewUrl,
      kind,
      uploading: false,
      uploaded: undefined,
      error: null,
      isCover: pendingMedia.value.length === 0,
    })
  }
}

function onPickFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (!files.length) return
  addFiles(files)
  input.value = ''
}

function removePending(id: string) {
  const idx = pendingMedia.value.findIndex(p => p.id === id)
  if (idx === -1) return
  URL.revokeObjectURL(pendingMedia.value[idx].previewUrl)
  pendingMedia.value.splice(idx, 1)
  if (!pendingMedia.value.some(p => p.isCover) && pendingMedia.value.length) {
    pendingMedia.value[0].isCover = true
  }
}

function setCover(id: string) {
  for (const p of pendingMedia.value) p.isCover = p.id === id
}

/** Upload -> form.images setzen */
async function uploadAll() {
  uploadError.value = null
  uploading.value = true

  const cover = pendingMedia.value.find(p => p.isCover)
  const ordered = [...(cover ? [cover] : []), ...pendingMedia.value.filter(p => p !== cover)]

  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i].uploaded) ordered[i].uploaded!.order = i
  }

  try {
    for (let i = 0; i < ordered.length; i++) {
      const p = ordered[i]
      if (p.uploaded) continue

      p.uploading = true
      p.error = null

      try {
        const asset = await uploadToCloudinary(p.file, { log: true, order: i })
        p.uploaded = { ...asset, order: i }
      } catch (err: any) {
        p.error = err?.message ?? 'Upload fehlgeschlagen'
        uploadError.value = p.error
        break
      } finally {
        p.uploading = false
      }
    }

    form.images = ordered.map(p => p.uploaded).filter(Boolean) as ImageAsset[]
  } finally {
    uploading.value = false
  }
}

/** Busy state */
const busy = computed(() => !!props.saving || uploading.value)

/** Open/Reset */
watch(
  () => props.open,
  async (o) => {
    if (!o) {
      clearPending()
      return
    }

    step.value = 0
    selectedTripId.value = null
    placeQuery.value = ''

    clearPending()

    form.title = ''
    form.description = ''
    form.categoryId = null
    form.occurredAt = ymd()
    form.lat = props.defaultLat
    form.lng = props.defaultLng
    form.images = []
    form.visibility = 'PRIVATE'
    form.placeName = null

    // trips fürs dropdown laden
    if (!trips.value.length) await tripStore.loadTrips()

    // geolocation
    if (props.useGeolocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          form.lat = coords.latitude
          form.lng = coords.longitude
        },
        () => {},
        { enableHighAccuracy: true, timeout: 4000 }
      )
    }
  },
  { immediate: true }
)

/** Geo events */
function onSelectPlace(s: { lat: number; lon: number; display_name: string }) {
  if (!props.showPlaceSearch) return
  form.lat = Number(s.lat)
  form.lng = Number(s.lon)
  form.placeName = primaryLabel(s.display_name)
  placeQuery.value = form.placeName ?? ''
  if (!form.title?.trim()) form.title = primaryLabel(s.display_name)
}

function onPlaceSearch(payload: { query: string; best?: { lat: string; lon: string; display_name?: string } }) {
  if (!props.showPlaceSearch) return
  if (!payload.best) return
  form.lat = Number(payload.best.lat)
  form.lng = Number(payload.best.lon)
  const dn = payload.best.display_name ?? payload.query
  const label = primaryLabel(dn)
  form.placeName = label
  placeQuery.value = label
  if (!form.title?.trim()) form.title = label
}

/** Date display */
const dateDisplay = computed(() => {
  const v = String(form.occurredAt || '').trim()
  if (!v || !v.includes('-')) return v
  const [y, m, d] = v.split('-')
  if (!y || !m || !d) return v
  return `${d}.${m}.${y}`
})
const dateInput = ref<HTMLInputElement | null>(null)
function openDatePicker() {
  const el = dateInput.value
  if (!el) return
  el.focus()
  // @ts-ignore
  if (typeof el.showPicker === 'function') el.showPicker()
  else el.click()
}

/** Visibility */
function toggleVisibility() {
  form.visibility = (form.visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE') as Visibility
}

/** Step navigation */
function nextStep() {
  // kleine Guardrails
  if (step.value === 1 && pendingMedia.value.length > 0 && !allUploaded.value) {
    // nicht blocken, aber warnen wäre ok – hier blocken wir nicht.
  }
  step.value = Math.min(2, step.value + 1)
}

/** Submit */
function onSubmit() {
  if (!isValid.value) return

  if (pendingMedia.value.length && !allUploaded.value) {
    uploadError.value = 'Bitte erst Medien hochladen (Schritt 1) oder entfernen.'
    step.value = 0
    return
  }

  emit('submit', {
    marker: {
      ...form,
      title: form.title.trim(),
      categoryId: form.categoryId ?? null,
      images: form.images ?? [],
      placeName: form.placeName?.trim() || null,
    },
    tripId: selectedTripId.value ?? null,
  })
}

/** Scroll hints */
const showScrollLeft = ref(false)
const showScrollRight = ref(false)
let raf = 0
function onScroll() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(updateScrollHints)
}
function updateScrollHints() {
  const el = scrollEl.value
  if (!el) {
    showScrollLeft.value = false
    showScrollRight.value = false
    return
  }
  const EPS = 6
  showScrollLeft.value = el.scrollLeft > EPS
  showScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - EPS
}
function scrollLeft() {
  const el = scrollEl.value
  if (!el) return
  el.scrollBy({ left: -320, behavior: 'smooth' })
  requestAnimationFrame(updateScrollHints)
}
function scrollRight() {
  const el = scrollEl.value
  if (!el) return
  el.scrollBy({ left: 320, behavior: 'smooth' })
  requestAnimationFrame(updateScrollHints)
}
const GlowInputShell = defineComponent({
  name: 'GlowInputShell',
  setup() {
    return () =>
      h(
        'div',
        {
          class:
            'pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300',
        },
        [
          h('div', {
            class:
              'absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]',
          }),
          h('div', {
            class:
              'absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20',
          }),
          h('div', { class: 'absolute inset-[1px] rounded-[14px] bg-[#0e162c]' }),
        ]
      )
  },
})

const SummaryBox = defineComponent({
  name: 'SummaryBox',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], default: '—' },
    multiline: { type: Boolean, default: false },
  },
  setup(props) {
    return () =>
      h('div', { class: 'relative group isolate' }, [
        // glow
        h('div', { class: 'pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300' }, [
          h('div', {
            class:
              'absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]',
          }),
          h('div', {
            class:
              'absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20',
          }),
          h('div', { class: 'absolute inset-[1px] rounded-[14px] bg-[#0e162c]' }),
        ]),

        // content
        h('div', { class: 'relative z-10 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-6 py-5' }, [
          h('div', { class: 'text-xs text-white/45 mb-1' }, props.label),
          props.multiline
            ? h(
              'div',
              { class: 'text-white/90 whitespace-pre-wrap break-words max-h-48 overflow-auto evoc-scroll pr-1' },
              String(props.value ?? '—')
            )
            : h('div', { class: 'text-white/90' }, String(props.value ?? '—')),
        ]),
      ])
  },
})

/** Small helper components (inline) */

</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.evoc-scroll::-webkit-scrollbar { height: 10px; }
.evoc-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 999px; }
.evoc-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
.evoc-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
</style>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1400] flex flex-col items-center justify-center px-6 py-10"
        @click="saving ? null : emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/65 backdrop-blur-md"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.18),_rgba(14,22,44,0.92)_65%,_rgba(0,0,0,0.95))]" />

        <!-- Stepper (oben, außerhalb der Card) -->
        <div
          class="relative z-20 w-full max-w-[420px] flex items-center justify-center mb-8 pointer-events-auto"
          @click.stop
        >
          <div class="w-full relative">
            <!-- Base line (Dot-Center -> Dot-Center) -->
            <div class="absolute left-[6px] right-[6px] top-[6px] h-[2px] rounded-full bg-white/10 z-0" />

            <!-- Active line -->
            <div
              class="absolute left-[6px] right-[6px] top-[6px] h-[2px] rounded-full z-0 origin-left transition-transform duration-300"
              style="background: linear-gradient(90deg, rgba(167,139,250,.95), rgba(240,171,252,.95), rgba(96,165,250,.95));"
              :style="{ transform: `scaleX(${stepProgress})` }"
            />

            <!-- Dots + Labels (Grid => Label-Breite beeinflusst Position NICHT) -->
            <div class="relative z-10 grid grid-cols-3">
              <div class="flex flex-col items-start gap-3 select-none">
                <div class="relative">
                  <div
                    v-if="step === 0"
                    class="pointer-events-none absolute -inset-2 rounded-full opacity-60"
                    style="background: radial-gradient(circle, rgba(168,85,247,.35), transparent 70%);"
                  />
                  <div
                    class="h-3 w-3 rounded-full border border-white/15"
                    :class="step >= 0
              ? 'bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400'
              : 'bg-[#0e162c]'"
                  />
                </div>
                <div class="text-[11px] tracking-wide" :class="step >= 0 ? 'text-white/90' : 'text-white/35'">
                  {{ steps[0] }}
                </div>
              </div>

              <div class="flex flex-col items-center gap-3 select-none">
                <div class="relative">
                  <div
                    v-if="step === 1"
                    class="pointer-events-none absolute -inset-2 rounded-full opacity-60"
                    style="background: radial-gradient(circle, rgba(168,85,247,.35), transparent 70%);"
                  />
                  <div
                    class="h-3 w-3 rounded-full border border-white/15"
                    :class="step >= 1
              ? 'bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400'
              : 'bg-[#0e162c]'"
                  />
                </div>
                <div class="text-[11px] tracking-wide" :class="step >= 1 ? 'text-white/90' : 'text-white/35'">
                  {{ steps[1] }}
                </div>
              </div>

              <div class="flex flex-col items-end gap-3 select-none">
                <div class="relative">
                  <div
                    v-if="step === 2"
                    class="pointer-events-none absolute -inset-2 rounded-full opacity-60"
                    style="background: radial-gradient(circle, rgba(168,85,247,.35), transparent 70%);"
                  />
                  <div
                    class="h-3 w-3 rounded-full border border-white/15"
                    :class="step >= 2
              ? 'bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400'
              : 'bg-[#0e162c]'"
                  />
                </div>
                <div class="text-[11px] tracking-wide" :class="step >= 2 ? 'text-white/90' : 'text-white/35'">
                  {{ steps[2] }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Wrap -->
        <div class="relative z-20 w-full max-w-[1200px] pointer-events-auto" @click.stop>
          <!-- CardShell (Glow NUR für die Card, nicht für die Buttons) -->
          <div class="relative">
            <!-- Glow -->
            <div class="pointer-events-none absolute -inset-[1px] rounded-[28px] opacity-45">
              <div class="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]" />
              <div class="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
              <div class="absolute inset-[1px] rounded-[26px] bg-[#0e162c]" />
            </div>

            <!-- Card (fixe Größe -> Steps springen nicht) -->
            <div
              class="relative rounded-[28px] bg-[#0b1228]/75 border border-white/10 ring-1 ring-white/5
                     backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-900/30
                     h-[680px] max-h-[80dvh] flex flex-col"
            >
              <SavingOverlay
                :open="busy"
                :items="overlayItems"
                :videoExtraStep="true"
                title="Speichere Änderungen…"
                message="Deine Bilder und Videos laden gerade."
                hint="Bitte Fenster nicht schließen."
                :showSteps="false"
              />

              <!-- Step badge rechts oben -->
              <div class="absolute top-6 right-6 z-20">
                <div class="rounded-2xl px-4 py-2 text-sm text-white/90 bg-white/5 border border-white/10">
                  {{ step + 1 }}/3
                </div>
              </div>

              <!-- Content scrollt innen -->
              <div class="flex-1 overflow-y-auto px-10 py-10">
                <!-- STEP 1: Bilder -->
                <div v-if="step === 0">
                  <h2 class="text-3xl font-semibold text-center">Bildergalerie</h2>
                  <p class="text-center text-white/60 mt-2">
                    {{ draftImages.length }} Medium{{ draftImages.length === 1 ? '' : 's' }} ausgewählt
                  </p>

                  <div class="relative mt-12">
                    <div
                      ref="scrollEl"
                      class="flex gap-8 overflow-x-auto overflow-y-visible pl-4 pt-4 pb-10 pr-20 scroll-smooth evoc-scroll"
                      @scroll="onScroll"
                    >
                      <!-- Media tiles -->
                      <!-- Media tiles --><div
                      v-for="(img, i) in draftImages"
                      :key="img.key"
                      class="relative shrink-0 w-[240px] h-[360px] rounded-[22px] overflow-hidden bg-white/5 border border-white/10
         cursor-grab active:cursor-grabbing
         transition-transform duration-200 will-change-transform origin-center"
                      :class="[
    draggingIndex === i ? 'opacity-80' : '',
    isDragging && draggingIndex !== i ? 'border-white/15' : '',
    isDragging && dragOverIndex === i && draggingIndex !== i ? 'scale-[1.04]' : ''
  ]"
                      draggable="true"
                      @dragstart="onDragStart(i)"
                      @dragenter.prevent="onDragEnter(i)"
                      @dragover.prevent
                      @drop.prevent="onDrop(i)"
                      @dragend="onDragEnd"
                    >

                      <!-- (A) Drag-Mode: dashed Gradient-Border auf ALLEN Tiles (außer dem gezogenen) -->
                      <svg
                        v-if="isDragging && draggingIndex !== i"
                        class="pointer-events-none absolute inset-0 z-[5] opacity-80"
                        width="240"
                        height="360"
                        viewBox="0 0 240 360"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient :id="dashGradId(img.key)" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="rgba(167,139,250,.95)" />
                            <stop offset="50%" stop-color="rgba(240,171,252,.95)" />
                            <stop offset="100%" stop-color="rgba(96,165,250,.95)" />
                          </linearGradient>
                        </defs>

                        <!-- Pixel-genau: gleiche Rundung wie Tile -->
                        <rect
                          x="1" y="1" width="236" height="356"
                          rx="20" ry="20"
                          fill="none"
                          :stroke="`url(#${dashGradId(img.key)})`"
                          stroke-width="2"
                          stroke-dasharray="10 8"
                          stroke-linecap="round"
                        />
                      </svg>

                      <!-- (B) Drop-Target: KEIN Glow, nur etwas kräftigere dashed Border -->
                      <svg
                        v-if="isDragging && dragOverIndex === i && draggingIndex !== i"
                        class="pointer-events-none absolute inset-0 z-[6] opacity-95"
                        width="240"
                        height="360"
                        viewBox="0 0 240 360"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <rect
                          x="1" y="1" width="236" height="356"
                          rx="20" ry="20"
                          fill="none"
                          :stroke="`url(#${dashGradId(img.key)})`"
                          stroke-width="2.5"
                          stroke-dasharray="10 8"
                          stroke-linecap="round"
                        />
                      </svg>

                      <!-- Remove -->
                      <button
                        type="button"
                        class="absolute top-3 right-3 z-20 h-10 w-10 rounded-xl
         bg-black/45 border border-white/15 backdrop-blur
         grid place-items-center
         hover:bg-black/60 hover:border-white/25 transition"
                        @click.stop="removeMedia(img.key)"
                        aria-label="Medium entfernen"
                      >
                        🗑️
                      </button>

                      <!-- Media -->
                      <img
                        v-if="!img.isVideo"
                        :src="img.preview"
                        alt=""
                        class="h-full w-full object-cover"
                        draggable="false"
                      />
                      <video
                        v-else
                        :src="img.preview"
                        class="h-full w-full object-cover"
                        muted
                        playsinline
                        preload="metadata"
                      />

                      <!-- Cover wählen -->
                      <button
                        type="button"
                        class="absolute left-4 top-3 rounded-xl bg-black/45 backdrop-blur border border-white/15 px-4 py-2 text-sm text-white/90
           hover:bg-[#0b1228]/95 transition"
                        @click.stop="setCover(img.key)"
                      >
                        <span v-if="coverKey === img.key" class="text-white/95">🌟Cover</span>
                        <span v-else class="text-white/85">☆Als Cover</span>
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
                        <div class="text-white/70 text-sm">Bild hinzufügen</div>
                      </button>
                    </div>

                    <!-- Arrow nur wenn sinnvoll ( >3 UND wirklich scrollbar) -->
                    <!-- Scroll hint buttons -->
                    <button
                      v-if="showScrollLeft"
                      type="button"
                      class="absolute left-3 top-1/2 -translate-y-1/2 z-20
         h-12 w-12 rounded-full
         bg-black/35 border border-white/20 backdrop-blur
         shadow-lg shadow-black/30
         hover:bg-black/45 hover:border-white/30
         transition grid place-items-center"
                      @click="scrollLeft"
                      aria-label="Nach links scrollen"
                    >
                      <span class="text-white/95 text-3xl leading-none translate-y-[-1px]">‹</span>
                    </button>

                    <!-- RIGHT -->
                    <button
                      v-if="showScrollRight"
                      type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 z-20
         h-12 w-12 rounded-full
         bg-black/35 border border-white/20 backdrop-blur
         shadow-lg shadow-black/30
         hover:bg-black/45 hover:border-white/30
         transition grid place-items-center"
                      @click="scrollRight"
                      aria-label="Nach rechts scrollen"
                    >
                      <span class="text-white/95 text-3xl leading-none translate-y-[-1px]">›</span>
                    </button>

                    <input
                      ref="fileInput"
                      type="file"
                      class="hidden"
                      accept="image/*,video/*"
                      multiple
                      @change="onFiles"
                    />
                  </div>
                </div>

                <!-- STEP 2: Details -->

                <div v-else-if="step === 1">
                  <h2 class="text-3xl font-semibold text-center">Details hinzufügen</h2>
                  <p class="text-center text-white/60 mt-2">Erzähle deine Geschichte</p>
                  <div class="mt-10 max-w-3xl mx-auto space-y-6">

                    <!-- Titel -->
                    <div class="relative group isolate">
                      <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300">
                        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                        <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                      </div>

                      <div class="relative z-10 flex items-center rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                        <input
                          v-model="draft.title"
                          type="text"
                          placeholder="Titel"
                          class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0"
                        />
                      </div>
                    </div>

                    <!-- Ort -->
                    <!-- Ort (GeoSearchBox) -->
                    <div class="relative group isolate rounded-2xl z-100">
                      <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300">
                        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                        <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                      </div>

                      <div class="relative z-30">
                        <GeoSearchBox
                          v-model="placeQuery"
                          placeholder="Ort suchen und setzen…"
                          :glow="false"
                          @select="onSelectPlace"
                          @search="onPlaceSearch"
                          :shadow="false"
                        />
                      </div>
                    </div>

                    <!-- Datum -->
                    <!-- Datum + Trip nebeneinander -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Datum -->
                      <div class="relative group isolate" @click="openDatePicker">
                        <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300">
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                          <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                        </div>

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
                          v-model="draft.occurredAt"
                          type="date"
                          class="absolute inset-0 opacity-0 cursor-pointer [color-scheme:dark]"
                          @click.stop
                          aria-label="Datum auswählen"
                        />
                      </div>

                      <!-- Trip -->
                      <div class="relative group isolate">
                        <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300">
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                          <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                        </div>

                        <div class="relative z-10 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                          <select
                            v-model="selectedTripId"
                            class="w-full bg-transparent border-none outline-none text-white h-11 md:h-12 text-base md:text-lg focus:ring-0"
                            :disabled="tripResolving"
                          >
                            <option :value="null" class="bg-[#1a233e] text-gray-400">
                              {{ tripNullLabel }}
                            </option>
                            <option v-for="t in tripOptions" :key="t.id" :value="t.id" class="bg-[#1a233e]">
                              {{ t.title }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>


                    <div class="relative group isolate">
                      <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300">
                        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                        <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                        <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                      </div>

                      <div class="relative z-10 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
    <textarea
      v-model="draft.description"
      rows="7"
      placeholder="Beschreibung"
      class="block w-full bg-transparent border-none outline-none text-white placeholder-gray-500 text-base md:text-lg focus:ring-0 resize-none"
    />
                      </div>
                    </div>
                  </div>
                </div>


                <!-- STEP 3: Review -->
                <div v-else>
                  <h2 class="text-3xl font-semibold text-center">Bereit zum Speichern</h2>
                  <p class="text-center text-white/60 mt-2">Alles sieht perfekt aus!</p>

                  <div class="mt-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
                    <!-- LEFT COLUMN: Preview + Visibility Toggle -->
                    <div class="space-y-4">
                      <!-- Preview card -->
                      <div class="relative group isolate h-[400px] rounded-3xl">
                        <!-- Glow (wie Inputs) -->
                        <div
                          class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
                        >
                          <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                          <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                          <div class="absolute inset-[1px] rounded-[calc(1.5rem-1px)] bg-[#0e162c]" />
                        </div>

                        <div class="relative z-10 h-[400px] overflow-hidden rounded-3xl bg-[#141c34]/60 backdrop-blur-md border border-white/10">
                          <video
                            v-if="coverMedia && coverMedia.isVideo"
                            :src="coverMedia.preview"
                            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            muted
                            playsinline
                            preload="metadata"
                            loop
                          />
                          <img
                            v-else-if="coverMedia"
                            :src="coverMedia.preview"
                            alt=""
                            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            loading="lazy"
                          />
                          <div v-else class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

                          <div class="absolute inset-0 bg-black/15" />
                          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                          <div class="absolute left-0 bottom-0 z-20 w-full p-5">
                            <div class="text-lg font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm">
                              {{ draft.title || 'Ohne Titel' }}
                            </div>

                            <div class="mt-2 flex items-center gap-2 text-sm text-white/80">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7.5-3.358 7.5-10.5a7.5 7.5 0 1 0-15 0C4.5 17.642 12 21 12 21z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5a2.25 2.25 0 1 0 0 .001z"/>
                              </svg>
                              <span class="truncate">{{ draft.placeName || 'Ort unbekannt' }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- ✅ Visibility Toggle (direkt unter dem Cover, nur linke Spalte) -->
                      <div class="w-full">
                        <AppButton
                          type="button"
                          variant="secondary"
                          size="md"
                          class="w-full h-12"
                          :disabled="busy"
                          @click="toggleVisibility"
                          :title="draft.visibility === 'PUBLIC' ? 'Klick: auf Privat stellen' : 'Klick: auf Öffentlich stellen'"
                        >
                          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent font-semibold">
                            {{ draft.visibility === 'PUBLIC' ? 'Öffentlich' : 'Privat' }}
                          </span>
                        </AppButton>

                        <div class="mt-2 text-xs text-white/45 text-center">
                          {{ draft.visibility === 'PUBLIC'
                          ? 'Dieser Marker ist öffentlich sichtbar.'
                          : 'Dieser Marker ist nur für dich sichtbar.' }}
                        </div>
                      </div>
                    </div>

                    <!-- Right: looks like CreateMarker (read-only inputs) -->
                    <div class="space-y-6 min-w-0">
                      <!-- Titel (read-only) -->
                      <div class="relative group isolate">
                        <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300">
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                          <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                        </div>

                        <div class="relative z-10 flex items-center rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                          <input
                            :value="draft.title || ''"
                            type="text"
                            readonly
                            placeholder="Titel"
                            class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0"
                          />
                        </div>
                      </div>

                      <!-- Ort (read-only) -->
                      <div class="relative group isolate">
                        <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300">
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                          <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                        </div>

                        <div class="relative z-10 flex items-center gap-2 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                          <div class="pl-1 pr-2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7.5-3.358 7.5-10.5a7.5 7.5 0 1 0-15 0C4.5 17.642 12 21 12 21z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5a2.25 2.25 0 1 0 0 .001z"/>
                            </svg>
                          </div>

                          <input
                            :value="draft.placeName || ''"
                            type="text"
                            readonly
                            placeholder="Ort"
                            class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0"
                          />
                        </div>
                      </div>

                      <!-- Datum + Trip (read-only) -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Datum -->
                        <div class="relative group isolate">
                          <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300">
                            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                            <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                          </div>

                          <div class="relative z-10 flex items-center gap-2 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                            <div class="pl-1 pr-2 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/>
                              </svg>
                            </div>

                            <input
                              :value="draft.occurredAt ? dateDisplay : ''"
                              type="text"
                              readonly
                              placeholder="Datum"
                              class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0"
                            />
                          </div>
                        </div>

                        <!-- Trip -->
                        <div class="relative group isolate">
                          <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300">
                            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                            <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                            <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                          </div>

                          <div class="relative z-10 flex items-center rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
                            <input
                              :value="selectedTripLabelOrHint || ''"
                              type="text"
                              readonly
                              placeholder="Keinem Trip zugeordnet"
                              class="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 h-11 md:h-12 text-base md:text-lg focus:ring-0"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Beschreibung (read-only) -->
                      <div class="relative group isolate">
                        <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300">
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
                          <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/20 via-fuchsia-300/16 to-indigo-400/20" />
                          <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
                        </div>

                        <div class="relative z-10 rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-3 py-2">
          <textarea
            :value="draft.description"
            readonly
            rows="7"
            placeholder="Beschreibung"
            class="block w-full bg-transparent border-none outline-none text-white placeholder-gray-500 text-base md:text-lg focus:ring-0 resize-none whitespace-pre-wrap"
          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions (außerhalb der Card) -->
          <!-- Bottom Actions (außerhalb der Card) -->
          <div class="mt-8 flex items-center justify-between">
            <AppButton :disabled="saving" variant="secondary" size="md" @click="emit('close')">
    <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
      Abbrechen
    </span>
            </AppButton>

            <div class="flex items-center gap-4">
              <AppButton :disabled="saving"
                         v-if="step > 0"
                         variant="secondary"
                         size="md"
                         @click="step = step - 1"
              >
      <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
        Zurück
      </span>
              </AppButton>

              <AppButton :disabled="saving"
                         v-if="step < 2"
                         variant="primary"
                         size="md"
                         @click="step = step + 1"
              >
      <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent min-w-20">
        Weiter
      </span>
              </AppButton>

              <AppButton :disabled="saving"
                         v-else
                         variant="primary"
                         size="md"
                         @click="onSave"
              >
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
import { computed, nextTick, reactive, ref, watch } from 'vue'
import AppButton from '@/components/AppButton.vue'
import GeoSearchBox from '@/components/GeoSearchBox.vue'
import SavingOverlay from '@/components/SavingOverlay.vue'
import { normalizeMarkerImages } from '@/lib/markerImages'
import { primaryLabel } from '@/lib/reverseGeocode'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { useTripStore } from '@/stores/TripStore'
import { storeToRefs } from 'pinia'
import type { ImageAsset } from '@/types/ImageAsset'

type ImageLike =
  | { id?: string | number; url?: string; secureUrl?: string; secure_url?: string; path?: string; order?: number | null }
  | string

type Visibility = 'PRIVATE' | 'PUBLIC'

type MarkerLike = {
  id: number
  title?: string | null
  description?: string | null
  occurredAt?: string | null
  placeName?: string | null
  images?: ImageLike[]
  visibility?: Visibility | string | null
  tripId?: number | string | null
  trip_id?: number | string | null
  trip?: { id?: number | string | null; title?: string | null } | null
} | null

type UpdateMarkerPayloadCloudinary = {
  title: string
  placeName: string | null
  occurredAt: string
  description: string
  lat: number
  lng: number
  images: ImageAsset[]
  removedImageIds: Array<string | number>
  visibility: Visibility
}

type DraftMedia = {
  key: string
  preview: string
  isVideo: boolean
  kind: 'existing' | 'new'
  imageId?: string | number
  publicId?: string
  secureUrl?: string
  file?: File
  uploading?: boolean
  uploaded?: ImageAsset
  error?: string | null
  isObjectUrl?: boolean
}

const props = withDefaults(defineProps<{
  open: boolean
  marker: MarkerLike
  saving?: boolean
}>(), {
  saving: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: { payload: any; files: File[]; tripId: number | null }): void
}>()

const steps = ['Bilder', 'Details', 'Überprüfen']
const step = ref(0)

const removedExistingIds = ref<Set<string | number>>(new Set())
const fileInput = ref<HTMLInputElement | null>(null)
const scrollEl = ref<HTMLDivElement | null>(null)

const placeQuery = ref('')

const draft = reactive({
  title: '',
  placeName: '',
  occurredAt: '',
  description: '',
  lat: 0,
  lng: 0,
  visibility: 'PRIVATE' as Visibility,
})

const uploading = ref(false)
const uploadError = ref<string | null>(null)
const busy = computed(() => !!props.saving || uploading.value)

const draftImages = ref<DraftMedia[]>([])

const coverKey = ref<string | null>(null)
const coverMedia = computed(() => {
  if (!draftImages.value.length) return null
  return draftImages.value.find(x => x.key === coverKey.value) ?? draftImages.value[0]
})

function setCover(key: string) {
  coverKey.value = key
  const idx = draftImages.value.findIndex(m => m.key === key)
  if (idx <= 0) return
  const [moved] = draftImages.value.splice(idx, 1)
  draftImages.value.unshift(moved)
}

function isVideoUrl(u?: string) {
  if (!u) return false
  const s = u.toLowerCase()
  return s.includes('/video/upload/') || s.endsWith('.mp4') || s.endsWith('.mov') || s.endsWith('.webm') || s.endsWith('.m4v') || s.endsWith('.mkv')
}

const tripStore = useTripStore()
const { trips, activeStopsSorted } = storeToRefs(tripStore)

const selectedTripId = ref<string | null>(null)
const tripResolving = ref(false)
const tripTitleHint = ref<string | null>(null)

const tripOptions = computed(() => {
  const opts = (trips.value ?? []).map(t => ({
    id: String((t as any).id),
    title: ((t as any).title ?? 'Ohne Titel'),
  }))
  return opts
})

const selectedTripLabel = computed(() => {
  if (selectedTripId.value == null) return null
  return tripOptions.value.find(t => t.id === selectedTripId.value)?.title ?? null
})

const selectedTripLabelOrHint = computed(() => {
  if (tripResolving.value) return 'Lade Trip…'
  return selectedTripLabel.value ?? tripTitleHint.value ?? null
})

const tripNullLabel = computed(() => {
  if (tripResolving.value) return 'Lade Trip…'
  return tripTitleHint.value ? `Trip: ${tripTitleHint.value}` : 'Keinem Trip zugeordnet'
})

async function resolveTripIdForMarker(markerId: number): Promise<number | null> {
  if (!markerId) return null
  if (!trips.value?.length) await tripStore.loadTrips()

  for (const t of (trips.value ?? []) as any[]) {
    const id = Number(t?.id)
    if (!id) continue

    await tripStore.selectTrip(id)
    if ((tripStore as any).loadStops) await (tripStore as any).loadStops(id)

    const found = (activeStopsSorted.value ?? []).some(
      (s: any) => Number(s.markerId) === Number(markerId)
    )

    if (found) return id
  }

  return null
}

function initFromMarker() {
  draft.title = props.marker?.title ?? ''
  draft.placeName = props.marker?.placeName ?? ''
  draft.occurredAt = props.marker?.occurredAt ?? ''
  draft.description = props.marker?.description ?? ''
  draft.lat = (props.marker as any)?.lat ?? draft.lat ?? 0
  draft.lng = (props.marker as any)?.lng ?? draft.lng ?? 0

  const m: any = props.marker ?? {}

  tripTitleHint.value = (m.trip?.title ?? '').trim() || null
  draft.title = m?.title ?? ''
  draft.placeName = m?.placeName ?? ''

  const rawVis = String(m?.visibility ?? '').toUpperCase()
  draft.visibility = rawVis === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE'

  const rawTripId =
    m.tripId ??
    m.trip_id ??
    m.trip?.id ??
    m.trip?.tripId ??
    m.tripID ??
    m.tripID_id ??
    m.attributes?.tripId ??
    m.attributes?.trip_id ??
    null

  selectedTripId.value = rawTripId == null ? null : String(rawTripId)
  placeQuery.value = draft.placeName || ''

  for (const it of draftImages.value) {
    if (it.isObjectUrl) URL.revokeObjectURL(it.preview)
  }

  removedExistingIds.value = new Set()

  const normalized = normalizeMarkerImages(props.marker)

  draftImages.value = normalized.map((x: any, idx: number): DraftMedia => {
    const src = x?.full || x?.thumb || ''
    return {
      key: String(x?.id ?? `${idx}-${src}`),
      preview: src,
      isVideo: isVideoUrl(src),
      kind: 'existing',
      imageId: x?.id ?? idx,
      publicId: x?.publicId,
      secureUrl: x?.secureUrl,
      isObjectUrl: false,
    }
  })

  coverKey.value = draftImages.value[0]?.key ?? null
}

watch(() => props.open, async (o) => {
  if (o) {
    step.value = 0
    if (!trips.value.length) await tripStore.loadTrips()

    initFromMarker()

    if (selectedTripId.value == null && props.marker?.id) {
      tripResolving.value = true
      try {
        const resolved = await resolveTripIdForMarker(Number(props.marker.id))
        if (resolved != null) selectedTripId.value = String(resolved)
      } finally {
        tripResolving.value = false
      }
    }

    await nextTick()
    updateScrollHints()
  } else {
    for (const it of draftImages.value) {
      if (it.isObjectUrl) URL.revokeObjectURL(it.preview)
    }
  }
})

watch(
  () => props.marker?.id,
  async (id, oldId) => {
    if (!props.open || !id) return
    if (oldId != null && id === oldId) return

    initFromMarker()
    if (!trips.value.length) await tripStore.loadTrips()

    if (selectedTripId.value == null) {
      tripResolving.value = true
      try {
        const resolved = await resolveTripIdForMarker(Number(id))
        if (resolved != null) selectedTripId.value = String(resolved)
      } finally {
        tripResolving.value = false
      }
    }
  },
  { immediate: true }
)

function pickFiles() {
  fileInput.value?.click()
}

async function onFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (!files.length) return

  const VIDEO_LIMIT = 2
  const existingVideoCount = draftImages.value.filter(m => m.isVideo).length

  let videosAdded = 0

  for (const f of files) {
    const isVid = f.type.startsWith('video/')
    if (isVid) {
      if (existingVideoCount + videosAdded >= VIDEO_LIMIT) {
        uploadError.value = `Du kannst aktuell maximal ${VIDEO_LIMIT} Videos pro Marker hinzufügen.`
        continue
      }
      videosAdded++
    }

    const url = URL.createObjectURL(f)
    draftImages.value.push({
      key: `file-${crypto.randomUUID?.() ?? Math.random()}`,
      preview: url,
      isVideo: isVid,
      kind: 'new',
      file: f,
      isObjectUrl: true,
      uploading: false,
      uploaded: undefined,
      error: null,
    })
  }

  if (!coverKey.value && draftImages.value[0]) coverKey.value = draftImages.value[0].key

  input.value = ''
  await nextTick()
  updateScrollHints()
}

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

const dateDisplay = computed(() => {
  const v = String(draft.occurredAt || '').trim()
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

function onSelectPlace(s: { lat: number; lon: number; display_name: string }) {
  draft.lat = Number(s.lat)
  draft.lng = Number(s.lon)

  const label = primaryLabel(s.display_name)
  draft.placeName = label
  placeQuery.value = label

  if (!draft.title?.trim()) {
    draft.title = label
  }
}

function onPlaceSearch(payload: {
  query: string
  results: Array<{ lat: string; lon: string; display_name?: string }>
  best?: { lat: string; lon: string; display_name?: string }
}) {
  if (!payload.best) return

  draft.lat = Number(payload.best.lat)
  draft.lng = Number(payload.best.lon)

  const dn = payload.best.display_name ?? payload.query
  const label = primaryLabel(dn)

  draft.placeName = label
  placeQuery.value = label

  if (!draft.title?.trim()) {
    draft.title = label
  }
}

const stepProgress = computed(() => step.value / (steps.length - 1))

const draggingIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function onDragStart(i: number) {
  draggingIndex.value = i
  dragOverIndex.value = i
}

function onDragEnter(i: number) {
  if (draggingIndex.value == null) return
  dragOverIndex.value = i
}

function onDrop(targetIndex: number) {
  const from = draggingIndex.value
  if (from == null) return

  if (from === targetIndex) {
    onDragEnd()
    return
  }

  const arr = draftImages.value
  const [moved] = arr.splice(from, 1)
  arr.splice(targetIndex, 0, moved)

  onDragEnd()
  nextTick(() => updateScrollHints())
}

function onDragEnd() {
  draggingIndex.value = null
  dragOverIndex.value = null
}

const isDragging = computed(() => draggingIndex.value !== null)

function safeId(s: string) {
  return String(s).replace(/[^a-zA-Z0-9_-]/g, '_')
}

function dashGradId(key: string) {
  return `dash-grad-${safeId(key)}`
}

function removeMedia(key: string) {
  const idx = draftImages.value.findIndex(m => m.key === key)
  if (idx === -1) return

  const m = draftImages.value[idx]

  if (m.kind === 'existing' && m.imageId != null) {
    removedExistingIds.value.add(m.imageId)
  }

  if (m.isObjectUrl) URL.revokeObjectURL(m.preview)

  draftImages.value.splice(idx, 1)

  if (coverKey.value === key) {
    coverKey.value = draftImages.value[0]?.key ?? null
  } else if (!draftImages.value.length) {
    coverKey.value = null
  }
}

function orderedMedia(): DraftMedia[] {
  return [...draftImages.value]
}

function toImageAsset(m: DraftMedia, order: number): ImageAsset | null {
  if (m.kind === 'existing') {
    const url = m.secureUrl || m.preview
    if (!url) return null
    return {
      // @ts-ignore
      id: m.imageId,
      url,
      secureUrl: url,
      publicId: m.publicId,
      order,
    } as any
  }

  if (m.uploaded) {
    return { ...m.uploaded, order } as any
  }

  return null
}

async function uploadAllIfNeeded() {
  uploadError.value = null

  const ordered = orderedMedia()

  const anyMissing = ordered.some(m => m.kind === 'new' && !m.uploaded)
  if (!anyMissing) {
    const images = ordered
      .map((m, i) => toImageAsset(m, i))
      .filter(Boolean) as ImageAsset[]
    return images
  }

  uploading.value = true

  try {
    for (let i = 0; i < ordered.length; i++) {
      const m = ordered[i]

      if (m.kind !== 'new') continue
      if (m.uploaded) {
        m.uploaded.order = i
        continue
      }
      if (!m.file) continue

      m.uploading = true
      m.error = null

      try {
        const asset = await uploadToCloudinary(m.file, { log: true, order: i })
        m.uploaded = { ...asset, order: i } as any
      } catch (err: any) {
        m.error = err?.message ?? 'Upload fehlgeschlagen'
        uploadError.value = m.error
        throw new Error(uploadError.value)
      } finally {
        m.uploading = false
      }
    }

    const images = ordered
      .map((m, i) => toImageAsset(m, i))
      .filter(Boolean) as ImageAsset[]

    return images
  } finally {
    uploading.value = false
  }
}

const overlayItems = computed(() =>
  draftImages.value
    .filter(m => m.kind === 'new')
    .map(m => ({
      uploading: !!m.uploading,
      uploaded: m.uploaded,
      error: m.error ?? null,
      isVideo: !!m.isVideo,
    }))
)

function toggleVisibility() {
  draft.visibility = draft.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC'
}

async function onSave() {
  if (busy.value) return
  uploadError.value = null

  try {
    const raw = (await uploadAllIfNeeded()) ?? []

    const images = raw.map((img: any, idx: number) => {
      const url = img?.url ?? img?.secureUrl ?? img?.secure_url ?? null
      const secureUrl = img?.secureUrl ?? img?.secure_url ?? img?.url ?? null

      return {
        ...img,
        order: idx,
        url,
        secureUrl,
      }
    })

    const payload: UpdateMarkerPayloadCloudinary = {
      title: String(draft.title ?? '').trim(),
      placeName: String(draft.placeName ?? '').trim() || null,
      occurredAt: draft.occurredAt,
      description: String(draft.description ?? ''),
      lat: Number(draft.lat),
      lng: Number(draft.lng),
      images,
      removedImageIds: Array.from(removedExistingIds.value),
      visibility: draft.visibility,
    }

    emit('submit', {
      payload,
      files: [],
      tripId: selectedTripId.value == null ? null : Number(selectedTripId.value),
    })
  } catch (e: any) {
    uploadError.value = e?.message ?? uploadError.value ?? 'Upload fehlgeschlagen'
    step.value = 0
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* nicer horizontal scroll */
.evoc-scroll::-webkit-scrollbar { height: 10px; }
.evoc-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 999px; }
.evoc-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
.evoc-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
</style>

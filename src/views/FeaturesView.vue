<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col items-center justify-start
              bg-[#0e162c] text-white font-sans overflow-hidden">

    <div class="absolute inset-0 z-0">

        <nav class="absolute top-0 left-0 w-full z-40 flex items-center justify-start p-6 md:px-12">
      <div class="flex items-center gap-6">
        <button
          @click="isSidebarOpen = true"
          class="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition duration-200"
          aria-label="Menü öffnen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
        </button>

        <div class="flex items-center gap-2 select-none cursor-pointer" @click="goHome">
          <span class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Evocation
          </span>
        </div>
      </div>
    </nav>

    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
      :style="{ backgroundImage: `url(${gemini2})` }"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
  </div>

    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div
        class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
        style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
      />

    <main class="relative z-20 flex w-full max-w-6xl flex-col items-center p-8 pt-24">

      <header class="w-full text-center mb-12">
        <h1 class="text-6xl font-black leading-tight tracking-tight drop-shadow-lg sm:text-7xl">
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                Kernfunktionen
            </span>
        </h1>
        <p class="mt-4 text-xl font-light leading-relaxed text-gray-300">
            Entdecke, wie Evocation deine Erinnerungen digitalisiert und globalisiert.
        </p>
      </header>

      <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <BaseCard class="text-left p-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-fuchsia-400 mb-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <h3 class="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-400 **via-fuchsia-300** to-indigo-400 bg-clip-text text-transparent">
            Geotagging & Markierungen
          </h3>
          <p class="text-gray-300">
            Speichere deine Erlebnisse auf einer <strong>hochdetaillierten 3D-Weltkarte</strong>. Jede Markierung kann Fotos, Videos und detaillierte Geschichten enthalten.
          </p>
        </BaseCard>

        <BaseCard class="text-left p-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-fuchsia-400 mb-4">
                <path fill-rule="evenodd" d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8"/>
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
            </svg>
            <h3 class="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-400 **via-fuchsia-300** to-indigo-400 bg-clip-text text-transparent">
                Multimedia Tagebuch
            </h3>
            <p class="text-gray-300">
                Lade Fotos und Videos direkt zu deinen Markierungen hoch. Erzähle deine Geschichte, wie sie erlebt wurde.
            </p>
        </BaseCard>

        <BaseCard class="text-left p-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-fuchsia-400 mb-4">
                <path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3" />
            </svg>
            <h3 class="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-400 **via-fuchsia-300** to-indigo-400 bg-clip-text text-transparent">
                Volle Privatsphäre
            </h3>
            <p class="text-gray-300">
                Du entscheidest, wer deine Erinnerungen sieht: <strong>Privat</strong>, <strong>Freunde</strong> oder <strong>Öffentlich</strong>. Deine Daten bleiben sicher und geschützt.
            </p>
        </BaseCard>

        <div class="col-span-full flex justify-center gap-8 pt-8">

            <BaseCard class="text-left p-6 w-full lg:w-1/3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-fuchsia-400 mb-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                </svg>
                <h3 class="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-400 **via-fuchsia-300** to-indigo-400 bg-clip-text text-transparent">
                    Teilen & Community
                </h3>
                <p class="text-gray-300">
                    Folge anderen Reisenden, entdecke inspirierende Orte und teile deine besten Routen und Sammlungen mit der Evocation Community.
                </p>
            </BaseCard>

            <BaseCard class="text-left p-6 w-full lg:w-1/3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-fuchsia-400 mb-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <h3 class="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-400 **via-fuchsia-300** to-indigo-400 bg-clip-text text-transparent">
                    Persönliches Dashboard
                </h3>
                <p class="text-gray-300">
                    Verfolge deine Reisemeilensteine, besuchte Länder und Statistiken über deine Erinnerungssammlungen auf einen Blick.
                </p>
            </BaseCard>

        </div>

      </div>

      <div class="mt-16 w-full max-w-lg text-center">
        <AppButton to="/" variant="primary" size="lg">
          <span class="mr-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">Zurück zur Homepage</span>
        </AppButton>
      </div>

    </main>

    <footer class="relative z-20 w-full mt-16 pb-4 text-center text-sm text-gray-500">
        &copy; 2025 Evocation. Alle Rechte vorbehalten.
    </footer>

  </div>
</template>

<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import MapView from '@/components/MapLoad.vue'
import BaseCard from '@/components/BaseCard.vue'
import globeBg from '@/assets/globe-bg.png'
import gemini1 from '@/assets/gemini1.png'
import gemini2 from '@/assets/gemini2.png'
import Sidebar from '@/components/DashboardSidebar.vue'
import { ref } from 'vue'

const isSidebarOpen = ref(false)

defineOptions({ name: 'FeaturesView' })
</script>

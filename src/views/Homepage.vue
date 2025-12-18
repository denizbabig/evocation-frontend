<template>
<!-- Sidebar -->
<Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
  <!-- Main Container: 100dvh sorgt dafür, dass es auf Handys und Desktops immer genau den Bildschirm füllt -->
  <div class="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[#0e162c] text-white font-sans selection:bg-purple-500 selection:text-white">
 <div
        class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
        style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
      />
    <!-- BACKGROUND LAYER -->
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
    <div class="absolute inset-0 z-0">
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
      :style="{ backgroundImage: `url(${gemini2})` }"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
  </div>

    <!-- MAIN CONTENT (HERO) - Flexbox zentriert dies absolut perfekt in der Mitte -->
    <main class="relative z-10 flex flex-grow flex-col items-center justify-center px-6 text-center">

      <div class="hidden md:flex justify-center w-full mb-12 relative z-20">
          <span class="ml-[0.2em]
                       text-5xl md:text-6xl lg:text-7xl
                       font-black tracking-[0.2em]
                       text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] uppercase text-center">
            Evocation
          </span>
      </div>
      <div class="flex w-full max-w-5xl flex-col items-center gap-4 text-center">

        <!-- Badge -->
        <div class="inline-flex items-center gap-3 rounded-full border border-purple-400/30 bg-purple-900/30 px-5 py-2 backdrop-blur-md">
          <span class="relative flex h-3 w-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
            <span class="relative inline-flex h-3 w-3 rounded-full bg-purple-400"></span>
          </span>
          <span class="text-sm font-bold uppercase tracking-widest text-purple-100">Webtechnologien Projekt</span>
        </div>

        <!-- Main Title: Groß und fett -->
        <h1 class="text-6xl font-black leading-tight tracking-tight text-white drop-shadow-2xl sm:text-7xl md:text-8xl">
          Jeder Ort hat eine <br class="hidden sm:block" />
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">Geschichte.</span>
        </h1>

        <!-- Subtitle -->
        <p class="mx-auto max-w-3xl text-xl font-light leading-relaxed text-gray-200 sm:text-2xl">
          Evocation ist deine digitale Bühne für Erinnerungen. <br class="hidden md:block" />
          Markiere Orte, speichere Momente und erstelle deine persönliche Weltkarte.
        </p>

        <!-- Buttons Area -->
        <div class="flex flex-col items-center justify-center gap-8 sm:flex-row">


          <!-- Primary Button (Sign Up) -->
          <AppButton to="/login" variant="primary" size="lg">
            <!-- Anwendung des Farbverlaufs auf den Text -->
            <span class="mr-3 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              Jetzt starten!
            </span>
            <!-- Das Icon behält eine feste Farbe, die zum Gradienten passt -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-6 w-6 text-indigo-700 transition-transform group-hover:translate-x-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </AppButton>

          <!-- Secondary Button (Demo) -->
          <AppButton to="/demo" variant="secondary" size="lg">
            <!-- Anwendung des Farbverlaufs auf den Text -->
            <span class="mr-3 bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">Live Demo testen</span>
            <!-- Das Icon behält eine feste Farbe, die zum Gradienten passt -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-6 w-6 text-fuchsia-300 transition-colors group-hover:text-fuchsia-200">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </AppButton>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import MapView from '@/components/MapLoad.vue'
import AppButton from '@/components/AppButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import globeBg from '@/assets/globe-bg.png'
import gemini1 from '@/assets/gemini1.png'
import gemini2 from '@/assets/gemini2.png'
import { ref } from 'vue'
import Sidebar from '@/components/DashboardSidebar.vue' // <- ggf. Pfad/Name anpassen

const isSidebarOpen = ref(false)


defineOptions({ name: 'HomePageView' })
</script>


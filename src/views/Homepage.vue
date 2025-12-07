<template>
  <!-- Main Container: 100dvh sorgt dafür, dass es auf Handys und Desktops immer genau den Bildschirm füllt -->
  <div class="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[#0e162c] text-white font-sans selection:bg-purple-500 selection:text-white">

    <!-- BACKGROUND LAYER -->
    <div class="absolute inset-0 z-0">
      <!-- MapView im Hintergrund -->
      <MapView class="h-full w-full scale-110 opacity-50 blur-sm brightness-75 transition-all duration-1000 hover:blur-none hover:scale-105" />

      <!-- Gradient Overlay: Stärkerer Verlauf für bessere Lesbarkeit -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
      <div
        class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
        style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
      />
</div>

    <div
  class="pointer-events-none absolute left-1/2 -translate-x-1/2 z-30
         top-20 sm:top-16 md:top-12"
  aria-hidden="true"
>
  <span
    class="
      block text-center uppercase text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]
      text-[12vw] xs:text-[10vw] sm:text-5xl md:text-7xl
      tracking-[0.08em] sm:tracking-[0.14em] md:tracking-[0.2em]
      md:ml-[0.2em]
      whitespace-nowrap
    "
  >
    Evocation
  </span>
</div>

    <nav class="absolute top-8 right-8 z-30 hidden items-center gap-5 text-base font-medium md:flex">
      <AppButton to="/features" variant="nav" size="sm" class="min-w-[80px]">
        <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">Features</span>
      </AppButton>
      <AppButton to="/about" variant="nav" size="sm" class="min-w-[70px]">
        <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">Über uns</span>
      </AppButton>
      <AppButton to="/login" variant="nav" size="sm" class="min-w-[60px]">
        <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">Login</span>
      </AppButton>
    </nav>

    <!-- MAIN CONTENT (HERO) - Flexbox zentriert dies absolut perfekt in der Mitte -->
    <main class="relative z-10 flex flex-grow flex-col items-center justify-center px-6 text-center pt-16 sm:pt-0">

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
          <AppButton to="/map" variant="primary" size="lg">
            <!-- Anwendung des Farbverlaufs auf den Text -->
            <span class="mr-3 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">Account erstellen</span>
            <!-- Das Icon behält eine feste Farbe, die zum Gradienten passt -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-6 w-6 text-indigo-700 transition-transform group-hover:translate-x-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </AppButton>

          <!-- Secondary Button (Demo) -->
          <AppButton to="/map?demo=true" variant="secondary" size="lg">
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
import MapView from '@/components/MapView.vue'
import AppButton from '@/components/AppButton.vue'
</script>

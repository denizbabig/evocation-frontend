<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col items-center justify-center
              bg-[#0e162c] text-white font-sans overflow-hidden">

    <div
        class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
        style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
      />

    <div class="absolute inset-0 z-0">
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
      :style="{ backgroundImage: `url(${gemini2})` }"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
  </div>

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

    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <main class="relative z-20 flex w-full max-w-5xl flex-col items-center justify-center p-8">

      <div class="w-full text-center space-y-8">

        <h1 class="text-6xl font-black leading-tight tracking-tight drop-shadow-lg sm:text-7xl md:text-8xl">
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                Unsere Geschichte
            </span>
        </h1>

        <p class="mx-auto max-w-3xl text-xl font-light leading-relaxed text-gray-200 sm:text-2xl">
          Evocation entstand aus der einfachen Idee, dass jeder Ort, den wir besuchen, eine Geschichte trägt.
          Inspiriert von persönlichen Erlebnissen und dem Wunsch, diese mit Freunden und der Welt zu teilen, habe ich eine Plattform geschaffen, die es ermöglicht.
        </p>

        <div class="p-8 mt-12 space-y-4
                    bg-white/5 border-3 border-purple-400/30 rounded-2xl
                    backdrop-blur-md shadow-2xl shadow-purple-900/40">

          <h2 class="text-4xl font-bold tracking-tight">
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Unser Versprechen
            </span>
          </h2>

          <p class="text-lg text-gray-300 mx-auto max-w-2xl">
            Evocation speichert deine Markierungen sicher und präsentiert sie auf einer intuitiven, interaktiven Weltkarte.
            Unser Kernziel ist es, eine Brücke zwischen Geodaten und <br> persönlichen Erlebnissen zu schlagen.
          </p>
        </div>

        <div class="pt-8">
          <AppButton to="/" variant="primary" size="lg"> <span class="mr-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">Zur Evocation Homepage</span>
          </AppButton>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/* Imports */
import { ref } from 'vue'

import AppButton from '@/components/AppButton.vue'
import Sidebar from '@/components/DashboardSidebar.vue'
import gemini2 from '@/assets/gemini2.png'

/* Refs */
const isSidebarOpen = ref(false)

/* Options */
defineOptions({ name: 'AboutView' })
</script>

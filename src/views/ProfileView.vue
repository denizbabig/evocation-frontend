<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col items-center justify-start
              bg-[#0e162c] text-white font-sans overflow-hidden">

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

    <div
        class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
        style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
    />

    <main class="relative z-20 flex flex-grow flex-col w-full items-center justify-start p-8 pt-24">

      <BaseCard
        class="w-full max-w-lg p-8 text-left
               bg-[#1a233e]
               border border-purple-700/50
               shadow-2xl shadow-purple-900/60
               transition-all duration-300"
      >
        <h1 class="text-3xl font-bold tracking-tight mb-8 text-center">
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                Mein Profil
            </span>
        </h1>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-fuchsia-400 mx-auto mb-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>

        <form @submit.prevent="saveProfile" class="space-y-6">

            <div class="space-y-3 p-4 rounded-lg bg-gray-900/30 border border-gray-700/50">
                <h2 class="text-xl font-bold">
                    <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                        Basisinformationen
                    </span>
                </h2>
                <p class="text-gray-300"><strong>E-Mail:</strong> {{ oktaProfile.email ?? '—' }}</p>
<p class="text-gray-300"><strong>Name:</strong> {{ oktaProfile.name ?? '—' }}</p>
<p class="text-gray-300"><strong>User ID:</strong> {{ oktaProfile.sub ?? '—' }}</p>
            </div>


            <h2 class="text-xl font-bold pt-4">
                <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Profil bearbeiten
                </span>
            </h2>

            <div>
                <label for="username" class="block text-sm font-medium text-gray-400 mb-1">Benutzername</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value="MaxMuster"
                  required
                  class="w-full rounded-md border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
            </div>

            <div>
                <label for="city" class="block text-sm font-medium text-gray-400 mb-1">Wohnort</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value="Berlin"
                  required
                  class="w-full rounded-md border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
            </div>

            <div class="pt-4">
                <AppButton type="submit" variant="primary" size="lg" class="w-full">
                    <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent font-semibold">
                        Änderungen speichern
                    </span>
                </AppButton>
            </div>
        </form>

      </BaseCard>

      <div class="mt-8 w-full max-w-lg text-center">
        <AppButton to="/" variant="secondary" size="md">
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">Zurück zur Übersicht</span>
        </AppButton>
      </div>

    </main>

    <footer class="relative z-20 w-full mt-auto pb-4 text-center text-sm text-gray-500">
        &copy; 2025 Evocation. Alle Rechte vorbehalten.
    </footer>

  </div>
</template>

<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import MapView from '@/components/MapLoad.vue'
import BaseCard from '@/components/BaseCard.vue'
import { ref, onMounted } from 'vue'
import { oktaAuth } from '@/lib/oktaAuth'
import gemini2 from '@/assets/gemini2.png'
import GlobeBg from '@/assets/globe-bg.png'
import Sidebar from '@/components/DashboardSidebar.vue'
const isSidebarOpen = ref(false)

const oktaProfile = ref<Record<string, any>>({})

onMounted(async () => {

  const id = await oktaAuth.tokenManager.get('idToken')
  oktaProfile.value = id?.claims ?? {}

})


defineOptions({ name: 'MyProfileView' })


const saveProfile = () => {
  console.log("Profildaten gespeichert!");

}
</script>

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

        <div class="flex items-center gap-2 select-none cursor-pointer" @click="goHome">
          <span class="text-2xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Evocation
          </span>
        </div>
      </div>
    </nav>

    <DashboardSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <main class="relative z-20 flex w-full max-w-7xl mx-auto flex-col items-center p-8 pt-32 pb-20">
      <!-- HERO -->
      <header class="w-full text-center mb-16 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-lg mb-6">
          Dein
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Profil
          </span>
        </h1>
        <p class="text-xl font-light leading-relaxed text-gray-300 mb-10 max-w-2xl mx-auto">
          Hier findest du Informationen zu deinem Profil
        </p>
      </header>

      <!-- CONTENT -->
      <div class="w-full max-w-3xl">
        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-stretch">
          <!-- LEFT CARD -->
          <div class="relative group rounded-3xl p-[1px] h-full">
            <!-- hover shadow glow (like dashboard stats) -->
            <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-70 transition duration-300">
              <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]" />
              <!-- this blocks “in-card glow” -->
              <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]" />
            </div>

            <!-- surface -->
            <div class="relative h-full rounded-3xl border border-white/10 bg-[#141c34]/60 backdrop-blur-md p-6">
              <div class="flex h-full flex-col items-center justify-center text-center">
                <div class="h-24 w-24 rounded-3xl bg-white/5 border border-white/10 grid place-items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>

                <div class="text-sm text-white/55">Angemeldet als</div>
                <div class="mt-1 text-lg font-bold leading-tight text-white/95 break-words">
                  {{ oktaProfile.name ?? '—' }}
                </div>

                <div class="mt-3 text-xs text-white/45 break-all">
                  {{ oktaProfile.email ?? '—' }}
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT CARD -->
          <div class="relative group rounded-3xl p-[1px] h-full">
            <!-- hover shadow glow (like dashboard stats) -->
            <div class="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-70 transition duration-300">
              <div class="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[12px]" />
              <!-- blocks inner glow -->
              <div class="absolute inset-[1px] rounded-[22px] bg-[#0e162c]" />
            </div>

            <!-- surface -->
            <div class="relative h-full rounded-3xl border border-white/10 bg-[#141c34]/60 backdrop-blur-md p-6 md:p-8">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-8 rounded-full bg-gradient-to-b from-purple-400 via-fuchsia-300 to-indigo-400"></span>
                  Basisinformationen
                </h2>
                <div class="text-sm text-gray-400">Okta</div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div class="text-xs text-white/45">E-Mail</div>
                  <div class="mt-1 text-sm font-semibold text-white/90 break-all">
                    {{ oktaProfile.email ?? '—' }}
                  </div>
                </div>

                <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div class="text-xs text-white/45">Name</div>
                  <div class="mt-1 text-sm font-semibold text-white/90 break-all">
                    {{ oktaProfile.name ?? '—' }}
                  </div>
                </div>

                <div class="rounded-2xl bg-white/5 border border-white/10 p-4 sm:col-span-2">
                  <div class="text-xs text-white/45">User ID</div>
                  <div class="mt-1 text-sm font-mono text-white/85 break-all">
                    {{ oktaProfile.sub ?? '—' }}
                  </div>
                </div>
              </div>

              <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <AppButton
                  type="button"
                  variant="secondary"
                  size="md"
                  class="w-full sm:w-auto"
                  @click="goDashboard"
                >
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Zum Dashboard
                  </span>
                </AppButton>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <span class="relative z-20 w-full mt-auto py-6 text-center text-xs text-gray-500">
      &copy; 2025 Evocation Systems. All rights reserved.
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/AppButton.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import gemini2 from '@/assets/gemini2.png'
import { oktaAuth } from '@/lib/oktaAuth'

defineOptions({ name: 'MyProfileView' })

const router = useRouter()
const isSidebarOpen = ref(false)

const oktaProfile = ref<Record<string, any>>({})

async function reloadProfile() {
  const id = await oktaAuth.tokenManager.get('idToken')
  oktaProfile.value = id?.claims ?? {}
}

function goHome() {
  router.push('/')
}

function goDashboard() {
  router.push('/dashboard')
}

onMounted(async () => {
  await reloadProfile()
})
</script>

<style scoped>
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0e162c; }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #4b5563; }
</style>

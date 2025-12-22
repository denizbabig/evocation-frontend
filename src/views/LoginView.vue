<template>
  <div
    class="relative flex min-h-[100dvh] w-full flex-col items-center justify-start
           bg-[#0e162c] text-white font-sans overflow-hidden"
  >

      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 blur-sm brightness-75"
          :style="{ backgroundImage: `url(${gemini2})` }"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/30 via-[#0e162c]/80 to-[#0e162c]" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0e162c]/60 to-[#0e162c]" />
    </div>

    <div
      class="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-screen"
      style="background-image: linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 80px 80px;"
    />

    <main class="relative z-20 flex flex-grow flex-col w-full items-center justify-center p-8">
      <BaseCard
        class="w-full max-w-sm p-8 text-center bg-[#1a233e] border border-purple-700/50 shadow-2xl shadow-purple-900/60"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12 text-fuchsia-400 mx-auto mb-4"
        >
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>

        <h1 class="text-3xl font-bold tracking-tight mb-6">
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Anmelden
          </span>
        </h1>

        <!-- ✅ 1) Erst Button, dann Widget -->
        <div v-if="!showWidget" class="pt-2">
          <AppButton
            variant="primary"
            size="lg"
            class="w-full"
            @click="showWidget = true"
          >
            <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              Anmelden über Okta
            </span>
          </AppButton>

          <p class="mt-3 text-xs text-gray-400">
            Du wirst nicht weitergeleitet – das Login erscheint direkt hier.
          </p>
        </div>

        <!-- ✅ OKTA WIDGET (embedded) -->
        <div v-else class="text-left -mt-20">
          <div class="min-h-[380px]">
    <OktaWidget />
  </div>

  <div class="mt-6">
    <AppButton
      variant="secondary"
      size="md"
      class="w-full"
      @click="showWidget = false"
    >
      <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
        Zurück
      </span>
    </AppButton>
          </div>
        </div>

        <div class="mt-6 text-sm">
          <p class="text-gray-400">
            Noch kein Konto?
            <router-link
              to="/register"
              class="inline-flex items-center rounded-full px-2 py-1 font-medium
                     text-purple-400 hover:text-purple-300
                     hover:bg-white/5 transition
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/60"
            >
              Jetzt registrieren
            </router-link>
          </p>
        </div>
      </BaseCard>

      <div class="mt-16 w-full max-w-lg text-center">
        <AppButton to="/" variant="primary" size="lg">
          <span class="mr-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
            Zurück zur Homepage
          </span>
        </AppButton>
      </div>
    </main>

    <footer class="relative z-20 w-full mt-auto pb-4 text-center text-sm text-gray-500">
      &copy; 2025 Evocation. Alle Rechte vorbehalten.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import MapView from '@/components/MapLoad.vue'
import BaseCard from '@/components/BaseCard.vue'
import OktaWidget from '@/components/OktaWidget.vue'
import { oktaAuth } from '@/lib/oktaAuth'
import gemini2 from "@/assets/gemini2.png";

defineOptions({ name: 'LoginView' })

const router = useRouter()
const route = useRoute()
const showWidget = ref(false)

let unsubscribe: null | (() => void) = null

function redirectAfterLogin() {
  // nutzt deine bestehende "from" Idee, falls vorhanden – sonst fallback
  const from = (route.query.from as string) || '/mapview'
  router.replace(from)
}

onMounted(async () => {
  // 1) falls beim Laden schon eingeloggt
  const state = oktaAuth.authStateManager.getAuthState()
  if (state?.isAuthenticated) {
    redirectAfterLogin()
    return
  }

  // 2) wichtig: reagiert auf Login aus dem Widget
  const handler = (authState: any) => {
    if (authState?.isAuthenticated) {
      showWidget.value = false // optional: verhindert “Zurück”-UI nach login
      redirectAfterLogin()
    }
  }

  oktaAuth.authStateManager.subscribe(handler)
  unsubscribe = () => oktaAuth.authStateManager.unsubscribe(handler)
})

onBeforeUnmount(() => {
  unsubscribe?.()
})
</script>

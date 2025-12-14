<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity duration-500"
    />
  </Transition>

  <aside
    ref="panelRef"
    class="fixed top-4 bottom-4 left-4 z-50 w-[340px] max-w-[92vw] overflow-hidden
           rounded-2xl border-2 border-white/15 bg-[#0f1428]/70 backdrop-blur-xl
           shadow-2xl shadow-purple-900/40
           transition-transform duration-500 ease-out outline-none"
    :class="{
      'translate-x-0': isOpen,
      '-translate-x-[380px]': !isOpen
    }"
    role="dialog"
    aria-modal="true"
    aria-label="Menü"
    tabindex="0"
    @keydown.esc="$emit('close')"
  >
    <!-- Background accents like homepage -->
    <div class="pointer-events-none absolute inset-0 rounded-2xl">
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/10 via-[#0e162c]/40 to-[#0e162c]/80" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(88,28,135,0.22),_rgba(14,22,44,0.55),_rgba(14,22,44,0.95))]" />
      <div
        class="absolute inset-0 opacity-35 mix-blend-screen"
        style="background-image: linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px); background-size: 80px 80px;"
      />
    </div>

    <div class="relative flex h-full flex-col px-6 py-6">
      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute left-5 top-5 z-50 rounded-lg p-2 text-gray-300/80
               hover:text-fuchsia-300 hover:bg-white/5 transition
               focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
        aria-label="Sidebar schließen"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Header -->
      <div class="pt-5 text-center">


        <h2 class="mt-5 text-3xl font-black tracking-tight">
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Optionen
          </span>
        </h2>

        <p class="mt-2 text-sm text-gray-300">Wähle deinen Weg.</p>
      </div>

      <!-- Nav -->
      <nav class="mt-8 flex-1 space-y-4 overflow-y-auto pb-2 pr-2 pl-2 pt-2 sidebar-scroll">
        <!-- Quick actions (public) -->
        <div class="space-y-3">
          <AppButton
            v-if="!isAuthenticated"
            :to="routes.demo"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/map')"
            @click="closeOnly"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="h-5 w-5 text-fuchsia-300 mr-3">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Live Demo testen
            </span>
          </AppButton>

          <AppButton
            :to="routes.home"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/')"
            @click="closeOnly"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="h-5 w-5 text-fuchsia-300 mr-3">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 10.5 12 3l9 7.5V21a.75.75 0 0 1-.75.75H3.75A.75.75 0 0 1 3 21V10.5z" />
            </svg>
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Homepage
            </span>
          </AppButton>
        </div>

        <div class="my-5 h-px bg-white/10" />

        <!-- App (protected) -->
        <div class="text-center text-[11px] tracking-[0.22em] uppercase text-gray-400/90">
          App
        </div>

        <div class="mt-3 space-y-3">
          <AppButton
            :to="routes.mapview"
            :disabled="!isAuthenticated"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/mapview')"
            @click="closeOnly"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="h-5 w-5 text-fuchsia-300 mr-3">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 20l-5 2V6l5-2 6 2 5-2v16l-5 2-6-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 4v16M15 6v16" />
            </svg>
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Karte
            </span>
            <span v-if="!isAuthenticated" class="ml-auto badge">Login nötig</span>
          </AppButton>

          <AppButton
            :to="routes.dashboard"
            :disabled="!isAuthenticated"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/dashboard')"
            @click="closeOnly"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="h-5 w-5 text-fuchsia-300 mr-3">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4 4h7v7H4V4zM13 4h7v4h-7V4zM13 10h7v10h-7V10zM4 13h7v7H4v-7z" />
            </svg>
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Dashboard
            </span>
            <span v-if="!isAuthenticated" class="ml-auto badge">Login nötig</span>
          </AppButton>

          <AppButton
            :to="routes.profile"
            :disabled="!isAuthenticated"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/profile')"
            @click="closeOnly"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="h-5 w-5 text-fuchsia-300 mr-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 21a8 8 0 0 0-16 0" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
            </svg>
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Mein Profil
            </span>
            <span v-if="!isAuthenticated" class="ml-auto badge">Login nötig</span>
          </AppButton>
        </div>

        <div class="my-5 h-px bg-white/10" />

        <!-- Public -->
        <div class="text-center text-[11px] tracking-[0.22em] uppercase text-gray-400/90">
          Info
        </div>

        <div class="mt-3 space-y-3">
          <AppButton
            :to="routes.features"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/features')"
            @click="closeOnly"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="h-5 w-5 text-fuchsia-300 mr-3">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Features
            </span>
          </AppButton>

          <AppButton
            :to="routes.about"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/about')"
            @click="closeOnly"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="h-5 w-5 text-fuchsia-300 mr-3">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 18h.01M11 10h1v5h-1z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z" />
            </svg>
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Über uns
            </span>
          </AppButton>
        </div>
      </nav>

      <!-- Auth actions -->
      <div class="mt-6 border-t border-white/10 pt-5 space-y-3">
        <!-- Show login/register if NOT authed -->
        <div v-if="!isAuthenticated" class="space-y-3">
          <AppButton
            :to="routes.login"
            variant="primary"
            size="md"
            class="w-full justify-center sidebar-btn"
            @click="closeOnly"
          >
            <span class="mr-3 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              Login
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="h-5 w-5 text-indigo-700 transition-transform group-hover:translate-x-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </AppButton>

          <AppButton
            :to="routes.register"
            variant="secondary"
            size="md"
            class="w-full justify-center sidebar-btn"
            @click="closeOnly"
          >
            <span class="mr-3 bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Account erstellen
            </span>
          </AppButton>
        </div>

        <!-- Logout if authed -->
        <button
          v-else
          type="button"
          class="group inline-flex w-full items-center justify-center overflow-hidden rounded-full
                 border-2 border-red-400/25 bg-red-900/10 px-8 py-3
                 text-base font-semibold text-red-200 backdrop-blur-md
                 transition-all duration-300 hover:border-red-300/60 hover:bg-red-900/20
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
          @click="onLogout"
        >
          <span class="mr-3">Logout</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
               class="h-5 w-5 text-red-200 transition-transform group-hover:translate-x-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 17l-1 0a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 7l5 5-5 5"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H10"/>
          </svg>
          <span class="ml-4 text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-red-200/80">
            Okta
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logoutRedirect, oktaAuth } from '@/lib/oktaAuth'
import AppButton from '@/components/AppButton.vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const route = useRoute()
const router = useRouter()

const routes = {
  home: '/',
  map: '/map',
  demo: '/map?demo=true',

  about: '/about',
  features: '/features',

  login: '/login',
  register: '/register',

  dashboard: '/dashboard',
  profile: '/profile',
  mapview: '/mapview'
}

function closeOnly() {
  emit('close')
}

function activeClass(pathPrefix: string) {
  return route.path.startsWith(pathPrefix)
    ? 'sidebar-link--active'
    : ''
}

const isAuthenticated = ref(false)
let unsubscribe: null | (() => void) = null

onMounted(() => {
  const s = oktaAuth.authStateManager.getAuthState()
  isAuthenticated.value = !!s?.isAuthenticated

  const handler = (authState: any) => {
    isAuthenticated.value = !!authState?.isAuthenticated
  }
  oktaAuth.authStateManager.subscribe(handler)
  unsubscribe = () => oktaAuth.authStateManager.unsubscribe(handler)
})

onBeforeUnmount(() => {
  unsubscribe?.()
})

const panelRef = ref<HTMLElement | null>(null)
watch(
  () => props.isOpen,
  async (open) => {
    if (!open) return
    await nextTick()
    panelRef.value?.focus()
  }
)

async function onLogout() {
  try {
    emit('close')
    try { oktaAuth.tokenManager.clear() } catch {}
    await logoutRedirect()
  } catch (e) {
    console.error('[logout] failed', e)
    router.replace('/')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* ✅ kill AppButton hover-scale ONLY inside sidebar (sonst overlap/komisch) */
.sidebar-btn { transform: none !important; }
.sidebar-btn:hover { transform: none !important; }

/* active = bisschen glow, hero-like */
.sidebar-link--active {
  border-color: rgba(255,255,255,0.40) !important;
  background: rgba(255,255,255,0.10) !important;
  box-shadow: 0 0 0 2px rgba(217,70,239,0.18), 0 0 28px rgba(217,70,239,0.10);
}

/* small badge */
.badge {
  font-size: 10px;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.75);
}
</style>

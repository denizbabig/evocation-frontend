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
    <!-- grid -->
    <div class="pointer-events-none absolute inset-0 rounded-2xl">
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e162c]/10 via-[#0e162c]/40 to-[#0e162c]/80" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(88,28,135,0.22),_rgba(14,22,44,0.55),_rgba(14,22,44,0.95))]" />
      <div
        class="absolute inset-0 opacity-35 mix-blend-screen"
        style="background-image: linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px); background-size: 80px 80px;"
      />
    </div>

    <div class="relative flex h-full flex-col px-6 py-6">
      <!-- schließen -->
      <button
        @click="$emit('close')"
        class="absolute left-5 top-5 z-50 rounded-lg p-2 text-gray-300/80
               hover:text-fuchsia-300 hover:bg-white/5 transition
               focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
        aria-label="Sidebar schließen"
      >
        <XMarkIcon class="h-6 w-6" />
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
        <!-- quick ones für ohne login -->
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
            <PlayIcon :class="iconClass" />
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
            <HomeIcon :class="iconClass" />
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Homepage
            </span>
          </AppButton>
        </div>

        <div class="my-5 h-px bg-white/10" />

        <!-- App (login nötig) -->
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
            <MapIcon :class="iconClass" />
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
            <Squares2X2Icon :class="iconClass" />
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Dashboard
            </span>
            <span v-if="!isAuthenticated" class="ml-auto badge">Login nötig</span>
          </AppButton>

          <AppButton
            :to="routes.marker"
            :disabled="!isAuthenticated"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/marker')"
            @click="closeOnly"
          >
            <MapPinIcon :class="iconClass" />
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Marker
            </span>
            <span v-if="!isAuthenticated" class="ml-auto badge">Login nötig</span>
          </AppButton>

          <AppButton
            :to="routes.trips"
            :disabled="!isAuthenticated"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/trips')"
            @click="closeOnly"
          >
            <FolderIcon :class="iconClass" />
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Trips
            </span>
            <span v-if="!isAuthenticated" class="ml-auto badge">Login nötig</span>
          </AppButton>

          <AppButton
            :to="routes.sharedLinks"
            :disabled="!isAuthenticated"
            variant="secondary"
            size="md"
            class="w-full justify-start sidebar-btn"
            :class="activeClass('/shared-links')"
            @click="closeOnly"
          >
            <LinkIcon :class="iconClass" />
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Geteilte Karten
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
            <UserCircleIcon :class="iconClass" />
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
            <SparklesIcon :class="iconClass" />
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
            <InformationCircleIcon :class="iconClass" />
            <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Über uns
            </span>
          </AppButton>
        </div>
      </nav>

      <!-- Auth Aktionen -->
      <div class="mt-6 border-t border-white/10 pt-5 space-y-3">
        <!-- login /register wenn nicht auth -->
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
            <ArrowRightIcon class="h-5 w-5 text-indigo-700 transition-transform group-hover:translate-x-1" />
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
          <ArrowRightOnRectangleIcon class="h-5 w-5 text-red-200 transition-transform group-hover:translate-x-1" />
          <span class="ml-4 text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-red-200/80">
            Okta
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
/* Imports */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  FolderIcon,
  HomeIcon,
  InformationCircleIcon,
  LinkIcon,
  MapIcon,
  MapPinIcon,
  PlayIcon,
  SparklesIcon,
  Squares2X2Icon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

import AppButton from '@/components/AppButton.vue'
import { logoutRedirect, oktaAuth } from '@/lib/oktaAuth'

/* Props / Emits */
const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

/* Router */
const route = useRoute()
const router = useRouter()

/* UI constants */
const iconClass = 'h-5 w-5 text-fuchsia-300 mr-3 shrink-0'

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
  mapview: '/mapview',
  sharedLinks: '/shared-links',
  trips: '/trips',
  marker: '/marker',
} as const

/* State */
const panelRef = ref<HTMLElement | null>(null)
const isAuthenticated = ref(false)

/* Helpers */
function closeOnly() {
  emit('close')
}

function activeClass(pathPrefix: string) {
  const p = route.path

  if (pathPrefix === '/') return p === '/' ? 'sidebar-link--active' : ''

  const isActive = p === pathPrefix || p.startsWith(pathPrefix + '/')
  return isActive ? 'sidebar-link--active' : ''
}

/* Effects */
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

watch(
  () => props.isOpen,
  async (open) => {
    if (!open) return
    await nextTick()
    panelRef.value?.focus()
  }
)

/* Actions */
async function onLogout() {
  try {
    emit('close')
    try {
      oktaAuth.tokenManager.clear()
    } catch {}
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

.sidebar-btn { transform: none !important; }
.sidebar-btn:hover { transform: none !important; }

.sidebar-link--active {
  border-color: rgba(255,255,255,0.40) !important;
  background: rgba(255,255,255,0.10) !important;
  box-shadow: 0 0 0 2px rgba(217,70,239,0.18), 0 0 28px rgba(217,70,239,0.10);
}

.badge {
  font-size: 10px;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.75);
}
</style>

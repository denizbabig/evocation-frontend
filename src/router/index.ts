// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

import Homepage from '@/views/Homepage.vue'
import MapLayout from '@/views/MapLayout.vue'
import AboutView from '@/views/AboutView.vue'
import FeaturesView from '@/views/FeaturesView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CloudinaryTestView from '@/views/cloudinaryTestView.vue'
import LoginCallbackView from '@/views/LoginCallbackView.vue'
import sharedView from '@/views/sharedView.vue'
import DemoUploader from '@/views/DemoUploader.vue'
import DemoMapView from '@/views/DemoMapView.vue'

import { oktaAuth, loginRedirect } from '@/lib/oktaAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Homepage },
    { path: '/map', name: 'map', component: MapLayout },

    { path: '/about', name: 'about', component: AboutView },
    { path: '/features', name: 'features', component: FeaturesView },

    // Auth views
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/login/callback', name: 'login-callback', component: LoginCallbackView },

    // App views
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },

    // MapView (protected)
    { path: '/mapview', name: 'mapview', component: () => import('@/views/MapView.vue'), meta: { requiresAuth: true } },

    // Dev/Test
    { path: '/testview', name: 'testview', component: CloudinaryTestView },
    { path: '/shared/:code', name: 'shared', component: sharedView },
    { path: '/demouploader', name: 'demouploader', component: DemoUploader },
    { path: '/demo', name: 'demomap', component: DemoMapView },

  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const authed = await oktaAuth.isAuthenticated()
  if (authed) return true

  // ✅ statt Hosted-Redirect: embedded Login-View öffnen
  return {
    name: 'login',
    query: { from: to.fullPath },
  }
})

export default router

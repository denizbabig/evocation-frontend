// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

import Homepage from '@/views/Homepage.vue'

import AboutView from '@/views/AboutView.vue'
import FeaturesView from '@/views/FeaturesView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import MarkersView from '@/views/MarkersView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LoginCallbackView from '@/views/LoginCallbackView.vue'
import sharedView from '@/views/sharedView.vue'
import SavedSharedLinksView from "@/views/SavedSharedLinksView.vue";
import DemoMapView from '@/views/DemoMapView.vue'
import TripsView from "@/views/TripsView.vue";
import TripDetailView from "@/views/TripDetailView.vue";
import DashboardView from "@/views/DashboardView.vue";

import { oktaAuth, loginRedirect } from '@/lib/oktaAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Homepage },

    { path: '/about', name: 'about', component: AboutView },
    { path: '/features', name: 'features', component: FeaturesView },

    // Auth views
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/login/callback', name: 'login-callback', component: LoginCallbackView },

    // App views
    { path: '/markers', name: 'markers', component: MarkersView, meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },

    // MapView (protected)
    { path: '/mapview', name: 'mapview', component: () => import('@/views/MapView.vue'), meta: { requiresAuth: true } },



    { path: '/shared/:code', name: 'shared', component: sharedView },

    { path: '/demo', name: 'demomap', component: DemoMapView },
    {path: '/shared-links', name: 'shared-links', component: SavedSharedLinksView, meta: { requiresAuth: true }},
    { path: '/trips', name: 'trips', component: TripsView},
    { path: '/trips/:id', name: 'TripDetail', component: TripDetailView},
    { path: '/marker', name: 'Marker', component: MarkersView},
    { path: '/dashboard', name: 'Dashboard', component: DashboardView},
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const authed = await oktaAuth.isAuthenticated()
  if (authed) return true

  //  statt Hosted-Redirect: embedded Login-View öffnen
  return {
    name: 'login',
    query: { from: to.fullPath },
  }
})

export default router

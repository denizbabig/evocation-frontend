// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/views/Homepage.vue'
import MapLayout from '@/views/MapLayout.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Homepage },
    { path: '/map', name: 'map', component: MapLayout },
    { path: '/about', name: 'about', component: () => import('../views/AboutEvocation.vue') }
  ],
})

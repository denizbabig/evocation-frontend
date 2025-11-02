// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import MapLayout from '../views/MapLayout.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'map', component: MapLayout },
    { path: '/about', name: 'about', component: () => import('../views/AboutEvocation.vue') }
  ],
})

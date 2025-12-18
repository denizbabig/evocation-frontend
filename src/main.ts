import './assets/base.css'
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'maplibre-gl/dist/maplibre-gl.css'
import { oktaAuth } from '@/lib/oktaAuth'

;(window as any).__OKTA__ = oktaAuth
oktaAuth.start()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

oktaAuth.authStateManager.subscribe((s) => {
  const authed = !!s?.isAuthenticated
  const requiresAuth = !!router.currentRoute.value.meta.requiresAuth

  if (!authed && requiresAuth) {
    const from = router.currentRoute.value.fullPath
    router.replace({ name: 'login', query: { from } }).catch(() => {})
  }
})

<template>
  <div class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { oktaAuth } from '@/lib/oktaAuth'
import { useTripStore } from '@/stores/TripStore'

const route = useRoute()
const tripStore = useTripStore()

async function loadTripsIfAuthed() {
  const authed = await oktaAuth.isAuthenticated()
  if (!authed) return

  try {
    await tripStore.loadTrips()
  } catch (e) {
    console.warn('loadTrips failed', e)
  }
}

onMounted(async () => {
  if (route.meta.requiresAuth) {
    await loadTripsIfAuthed()
  }
})

watch(
  () => route.meta.requiresAuth,
  async (needsAuth) => {
    if (needsAuth) await loadTripsIfAuthed()
  }
)
</script>

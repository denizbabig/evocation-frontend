<!-- src/App.vue -->
<template>
  <div class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import { useTripStore } from '@/stores/TripStore'

const tripStore = useTripStore()

onMounted(async () => {
  try {
    await tripStore.loadTrips()
  } catch (e) {
    // falls beim ersten Render noch kein Token da ist -> nicht crashen
    console.warn('loadTrips failed ', e)
  }
})

</script>

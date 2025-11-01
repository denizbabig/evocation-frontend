<template>
  <div>
    <h2>Meine Reiseorte</h2>

    <p v-if="store.isLoading">⏳ Lade Marker...</p>
    <p v-else-if="store.error">{{ store.error }}</p>

    <ul v-else>
      <li v-for="m in store.markers" :key="m.id">
         {{ m.title }} – {{ m.description }}
      </li>
    </ul>
  </div>
</template>



<script setup lang="ts">
import { onMounted } from 'vue'
import { useMarkerStore } from '../stores/MarkerStore'

const store = useMarkerStore()

onMounted(() => {
  store.loadMarkers()
})
</script>




<template>
  <!-- WICHTIG: Der äußere Wrapper ist RELATIV, die Map ist ABSOLUT -->
  <div class="relative w-full h-full">
    <div id="map" class="absolute inset-0 z-1"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import maplibregl from 'maplibre-gl'

const map = ref<maplibregl.Map | null>(null)

onMounted(() => {
  map.value = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json', // kein Key nötig
    center: [13.405, 52.52],
    zoom: 3
  })
  map.value.on('load', () => {
    map.value!.setProjection({ type: 'globe' })
  })
})

onBeforeUnmount(() => {
  map.value?.remove()
})
</script>

<style scoped>
/* Falls MapLibre das Canvas vor deine UI legt, zwingen wir es nach hinten: */
.maplibregl-canvas { z-index: 0 !important; }
</style>

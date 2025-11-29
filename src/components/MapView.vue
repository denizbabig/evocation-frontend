<template>
  <div class="relative h-full w-full">
    <div id="map" class="absolute inset-0 z-[1]" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import maplibregl from 'maplibre-gl'

const map = ref<maplibregl.Map | null>(null)

onMounted(() => {
  const mapInstance = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [13.405, 50.52],
    zoom: 3
  })

  map.value = mapInstance

  mapInstance.on('load', () => {
    mapInstance.setProjection({ type: 'globe' })
  })
})

onBeforeUnmount(() => {
  map.value?.remove()
})
</script>

<style scoped>
.maplibregl-canvas { z-index: 0 !important; }
#map { cursor: grab; }
</style>

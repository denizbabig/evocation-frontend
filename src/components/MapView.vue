<script setup lang="ts">
import { onMounted } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

onMounted(() => {
  const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/019a44a4-c1e8-7e63-a06a-1ec6f9e8289a/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
    center: [13.405, 52.52],
    zoom: 2,
  })

  map.on('load', () => {
    map.setProjection({ type: 'globe' })

  })
})
</script>

<template>
  <div id="map" class="map"></div>
</template>

<style scoped>
#map {
  width: 1000px;
  height: 600px;
}
</style>

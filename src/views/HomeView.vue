<script setup lang="ts">
import AddMarker from '../components/AddMarker.vue'
import MarkerList from '../components/MarkerList.vue'
import MapView from '../components/MapView.vue'
</script>

<template>
  <main>
    <h1>Evocation Map</h1>
    <MapView />
    <AddMarker />
    <MarkerList />
  </main>
</template>

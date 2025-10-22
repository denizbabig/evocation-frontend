<template>
  <div>
    <h2>Meine Reiseorte</h2>
    <ul>
      <MarkerItem
        v-for="marker in markers"
        :key="marker.id"
        :marker="marker"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import MarkerItem from './MarkerItem.vue'

const markers = [
  { id: 1, title: 'Kyoto', date: '2025-08-31' },
  { id: 2, title: 'Tokyo', date: '2025-09-03' },
  { id: 3, title: 'Chengdu', date: '2025-09-10' }
]
</script>

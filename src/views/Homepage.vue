<script setup lang="ts">
import MapView from '@/components/MapView.vue'
import BaseCard from '@/components/BaseCard.vue' // Pfad anpassen, falls anders
</script>

<template>
  <div class="relative h-screen w-screen bg-[#0f1117] text-white">
    <!-- Map -->
    <MapView class="absolute inset-0 z-0" />

    <!-- Overlay -->
    <div class="pointer-events-none absolute inset-0 bg-black/50 z-10" />

    <!-- Card in der Mitte -->
    <div class="absolute inset-0 z-20 flex items-center justify-center">
      <BaseCard>
        CARD
      </BaseCard>
    </div>
  </div>
</template>

<style scoped></style>

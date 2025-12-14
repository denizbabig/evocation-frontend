<template>
  <div
    class="w-full max-w-xl rounded-3xl p-8 shadow-2xl transition-all duration-300"
    :class="[
      // Hält das dunkle, transparente Design des Secondary Buttons
      'border-3 border-white/30 bg-white/1 text-white backdrop-blur-md shadow-purple-900/50',
      // Optional: Ein leichter Hover-Effekt wie beim Button
      'hover:border-white/50 hover:bg-white/10'
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// Zusätzliche Props (z.B. variant oder size) können hier später hinzugefügt werden,
// falls du verschiedene Kartentypen benötigst.
</script>

<style scoped>
/* Hier können spezifische, nur für diese Komponente geltende Styles hinzugefügt werden */
</style>

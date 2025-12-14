<template>
  <div
    class="w-full max-w-xl rounded-3xl p-8 shadow-2xl transition-all duration-300"
    :class="[ 'border-3 border-white/30 bg-white/10 text-white backdrop-blur-md shadow-purple-900/50 hover:border-white/50 hover:bg-white/10'
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>

<template>
  <li>
    <strong>{{ marker.title }}</strong> — {{ marker.date }}
  </li>
</template>

<script setup lang="ts">
defineProps({
  marker: {
    type: Object,
    required: true
  }
})
</script>

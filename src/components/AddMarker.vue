<script setup lang="ts">
import { ref } from 'vue'
import { useMarkerStore } from '../stores/MarkerStore'

const store = useMarkerStore()
const title = ref('')
const description = ref('')
const firstDay = ref('')
const lastDay = ref('')


async function addMarker() {
  await store.addMarker({
    title: title.value,
    description: description.value,
    firstDay: firstDay.value,
    lastDay: lastDay.value,
    lat: 52.52,
    lng: 13.405
  })

  title.value = ''
  description.value = ''
  firstDay.value = ''
  lastDay.value = ''

}
</script>

<template>
  <div>
    <h2>Neuen Marker hinzufügen</h2>
    <form @submit.prevent="addMarker">
      <input v-model="title" placeholder="Titel" required />
      <input v-model="description" placeholder="Beschreibung" />
      <input v-model="firstDay" type="string" required />
      <input v-model="lastDay" type="string" placeholder="(optional)" />
      <button type="submit">Speichern</button>
    </form>
  </div>
</template>


<style scoped>
.marker-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  background: #c51d1d;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.marker-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input, button {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  cursor: pointer;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  transition: 0.2s;
}

button:hover {
  background: #45a049;
}
</style>

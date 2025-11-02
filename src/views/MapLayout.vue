<template>
  <div class="relative h-screen w-screen font-['Roboto'] bg-[#0f1117] text-white overflow-hidden">
    <!-- Karte -->
    <div id="map" class="absolute inset-0"></div>

    <!-- Sidebar (ausklappbar) -->
    <transition name="slide">
      <aside
        v-if="sidebarOpen"
        class="absolute top-0 left-0 h-full w-64 bg-[#1a1d24] shadow-lg z-20 p-6 space-y-4"
      >
        <button @click="sidebarOpen = false" class="text-gray-400 hover:text-white text-2xl mb-4">×</button>
        <h2 class="text-lg font-semibold mb-3">Menü</h2>
        <ul class="space-y-3">
          <li><a href="#" class="block hover:text-blue-400">Marker</a></li>
        </ul>
      </aside>
    </transition>

    <!-- Floating Controls -->
    <div class="absolute top-4 left-4 z-10 flex items-center space-x-3">
      <!-- Hamburger Button -->
      <button
        @click="sidebarOpen = !sidebarOpen"
        class="bg-white text-gray-800 w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-gray-200 transition"
      >
        <span class="material-icons text-2xl">menu</span>
      </button>

      <!-- Suchfeld -->
      <div
        class="flex items-center bg-white rounded-full shadow-md h-[40px] w-[350px] text-gray-800"
      >
        <span class="material-icons text-gray-500 mr-2">search</span>
        <input
          v-model="searchQuery"
          placeholder="Ort suchen..."
          class="flex-1 bg-transparent outline-none text-sm h-full"
        >
      </div>
    </div>

    <!-- Profil-Avatar -->
    <div class="absolute top-4 right-4 z-10">
      <img
        src="https://api.dicebear.com/8.x/adventurer/svg?seed=Deniz"
        alt="User Avatar"
        class="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-105 transition"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const sidebarOpen = ref(false)
const searchQuery = ref('')

onMounted(() => {

  const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/019a44a4-c1e8-7e63-a06a-1ec6f9e8289a/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
    center: [13.405, 52.52],
    zoom: 3.
  })

  map.on('load', () => {
      map.setProjection({ type: 'globe' })
  })

  setTimeout(() => {
    map.resize()
  }, 500)
})
</script>

<style scoped>
/* Sidebar Slide Transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>

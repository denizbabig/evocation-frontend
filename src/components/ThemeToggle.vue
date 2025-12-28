<template>
  <button
    @click="toggleTheme"
    class="relative inline-flex items-center justify-center w-10 h-10 rounded-full
           border-2 border-white/30 bg-white/5 text-purple-400 backdrop-blur-md
           transition-all duration-300 hover:border-white hover:bg-white/10
           focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
    :aria-label="isDarkMode ? 'Auf helles Thema umschalten' : 'Auf dunkles Thema umschalten'"
  >
    <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>

    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-45">
      <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

/* State */
const isDarkMode = ref(true)

/* Helpers */
function applyTheme(theme: 'light' | 'dark') {
  const htmlElement = document.documentElement

  htmlElement.classList.remove('light', 'dark')
  htmlElement.classList.add(theme)

  localStorage.setItem('theme', theme)
  isDarkMode.value = theme === 'dark'
}

/* UI Actions */
function toggleTheme() {
  const newTheme = isDarkMode.value ? 'light' : 'dark'
  applyTheme(newTheme)
}

/* Lifecycle */
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  let initialTheme: 'light' | 'dark'

  if (savedTheme === 'light' || savedTheme === 'dark') {
    initialTheme = savedTheme
  } else if (prefersDark) {
    initialTheme = 'dark'
  } else {
    initialTheme = 'light'
  }

  applyTheme(initialTheme)
})
</script>

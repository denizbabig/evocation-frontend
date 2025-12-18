<template>
  <div class="min-h-[100dvh] flex items-center justify-center text-gray-200">
    Login läuft…
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { handleLoginRedirect } from '@/lib/oktaAuth'

const router = useRouter()

onMounted(async () => {
  try {
    const target = await handleLoginRedirect()
    router.replace(target)
  } catch (e) {
    console.error('Okta callback failed', e)
    router.replace('/login')
  }
})
</script>

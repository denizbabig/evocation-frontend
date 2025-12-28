<template>
  <div class="min-h-[100dvh] bg-[#0e162c] text-white p-8">
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-3xl font-black">
        <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
          Cloudinary Test View
        </span>
      </h1>

      <div class="text-sm text-gray-300">
        Paste hier deine 2 <code class="px-1 py-0.5 rounded bg-white/10">public_id</code>s rein (ohne URL).
      </div>

      <!-- Inputs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs text-gray-400 uppercase tracking-wider">Public ID #1</label>
          <input v-model="ids[0]" class="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none" />
        </div>
        <div class="space-y-2">
          <label class="text-xs text-gray-400 uppercase tracking-wider">Public ID #2</label>
          <input v-model="ids[1]" class="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none" />
        </div>
      </div>

      <Sid

      <div v-if="!cloudName" class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        Missing <code class="px-1 py-0.5 rounded bg-white/10">VITE_CLOUDINARY_CLOUD_NAME</code> in deinem Frontend (.env).
      </div>

      <!-- Previews -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="cloudName">
        <div v-for="(pid, idx) in ids" :key="idx" class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div class="text-sm font-semibold text-gray-200">
            Upload #{{ idx + 1 }}
          </div>

          <div class="text-xs text-gray-400 break-all">
            {{ pid || '—' }}
          </div>

          <div v-if="pid" class="space-y-3">
            <!-- Card / Thumb -->
            <div class="rounded-xl overflow-hidden border border-white/10">
              <img
                :src="cldCard(pid)"
                class="w-full h-[200px] object-cover"
                alt=""
              />
            </div>

            <!-- Full / detail -->
            <div class="rounded-xl overflow-hidden border border-white/10">
              <img
                :src="cldFull(pid)"
                class="w-full max-h-[520px] object-contain bg-black/20"
                alt=""
              />
            </div>

            <div class="text-xs text-gray-400">
              <div class="break-all">card: {{ cldCard(pid) }}</div>
              <div class="break-all mt-1">full: {{ cldFull(pid) }}</div>
            </div>
          </div>

          <div v-else class="text-sm text-gray-400">
            public_id fehlt.
          </div>
        </div>
      </div>

      <div class="text-xs text-gray-500">
        Tipp: dein public_id sieht so aus: <code class="px-1 py-0.5 rounded bg-white/10">evocation/demo/...</code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined

const ids = ref<string[]>([
  // ✅ dein Upload aus der Response:
  'evocation/demo/img_ae5b759d-21b7-40f4-8613-82cf53cb07e4',
  // 👇 hier einfach deinen zweiten public_id rein
  ''
])

function cldUrl(publicId: string, transforms: string) {
  if (!cloudName) return ''
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`
}

function cldCard(publicId: string) {
  return cldUrl(publicId, 'c_fill,g_auto,w_640,h_360,dpr_auto,f_auto,q_auto')
}

function cldFull(publicId: string) {
  return cldUrl(publicId, 'dpr_auto,f_auto,q_auto')
}
</script>

<template>
  <div class="p-6 text-white">
    <h2 class="text-xl font-bold mb-4">Demo Image Uploader</h2>

    <input type="file" multiple accept="image/*" @change="onPick" />

    <button
      class="mt-4 px-4 py-2 rounded bg-white/10 border border-white/20"
      :disabled="uploading || files.length === 0"
      @click="uploadAll"
    >
      {{ uploading ? 'Uploading…' : 'Upload (mit Kompression)' }}
    </button>

    <div class="mt-6">
      <div class="text-sm text-gray-300 mb-2">publicIds (copy & paste):</div>
      <pre class="text-xs bg-black/30 p-3 rounded border border-white/10 whitespace-pre-wrap">{{ publicIds.join('\n') }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadToCloudinary } from '@/lib/cloudinary'

const files = ref<File[]>([])
const publicIds = ref<string[]>([])
const uploading = ref(false)

function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  files.value = Array.from(input.files ?? [])
  publicIds.value = []
}

async function uploadAll() {
  uploading.value = true
  try {
    for (const f of files.value) {
      const asset = await uploadToCloudinary(f, {
        log: true,
        preprocess: {
          maxDim: 1600,
          quality: 0.82,
          mimeType: 'image/webp',
          skipIfSmallerThanBytes: 300_000,
          keepIfBigger: true,
        },
      })
      publicIds.value.push(asset.publicId)
    }
  } finally {
    uploading.value = false
  }
}
</script>

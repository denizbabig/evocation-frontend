<template>
  <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <div class="text-sm text-white/80 font-semibold">Cover (optional)</div>
        <div class="text-[11px] text-white/45">
          Uploadt ein Bild zu Cloudinary. Backend löscht alte Cover automatisch bei Update/Delete.
        </div>
      </div>

      <input
        ref="fileEl"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onPick"
      />

      <button
        type="button"
        class="h-10 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
        @click="fileEl?.click()"
      >
        <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
          Bild wählen
        </span>
      </button>
    </div>

    <div v-if="error" class="mt-3 text-xs text-red-200/90">
      {{ error }}
    </div>

    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
      <!-- Preview -->
      <div class="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
        <div v-if="previewUrl || coverUrl" class="relative">
          <img :src="previewUrl ?? coverUrl!" class="w-full h-36 object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />
        </div>

        <div v-else class="h-36 grid place-items-center text-white/40 text-sm">
          Kein Cover gesetzt
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-3">
        <button
          type="button"
          class="w-full h-11 rounded-2xl bg-[#111a33]/85 border border-white/15 hover:border-fuchsia-500/40 transition text-sm disabled:opacity-50"
          :disabled="!pendingFile || uploading"
          @click="upload"
        >
          <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent font-semibold">
            {{ uploading ? 'Hochladen…' : 'Cover hochladen' }}
          </span>
        </button>

        <button
          type="button"
          class="w-full h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
          :disabled="uploading"
          @click="clear"
        >
          <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Entfernen (kein Cover)
          </span>
        </button>

        <div v-if="coverUrl" class="text-[11px] text-white/45 break-all">
          <div class="text-white/60">Aktuelles Cover:</div>
          {{ coverUrl }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { uploadToCloudinary } from '@/lib/cloudinary'

const props = withDefaults(defineProps<{
  initialCoverUrl?: string | null
  initialCoverPublicId?: string | null
}>(), {
  initialCoverUrl: null,
  initialCoverPublicId: null,
})

const emit = defineEmits<{
  (e: 'change', payload: { coverUrl: string | null; coverPublicId: string | null }): void
}>()

const fileEl = ref<HTMLInputElement | null>(null)
const pendingFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const uploading = ref(false)
const error = ref<string | null>(null)

// ✅ diese beiden sind "current server state" im Picker
const coverUrl = ref<string | null>(null)
const coverPublicId = ref<string | null>(null)

function revokePreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}

onBeforeUnmount(revokePreview)

// ✅ immer wenn Modal neu gerendert wird / props sich ändern → state setzen
watch(
  () => [props.initialCoverUrl, props.initialCoverPublicId] as const,
  ([u, pid]) => {
    coverUrl.value = u ?? null
    coverPublicId.value = pid ?? null
    // pending/preview NICHT überschreiben, außer du willst hart resetten
    // (ich würde resetten, wenn Modal aufgeht – das machst du via key, siehe unten)
  },
  { immediate: true }
)

function onPick(e: Event) {
  error.value = null
  const input = e.target as HTMLInputElement
  const f = input.files?.[0] ?? null
  input.value = ''
  if (!f) return

  pendingFile.value = f
  revokePreview()
  previewUrl.value = URL.createObjectURL(f)
}

async function upload() {
  if (!pendingFile.value) return
  error.value = null
  uploading.value = true
  try {
    const asset = await uploadToCloudinary(pendingFile.value, { log: true, order: 0 })
    coverUrl.value = asset.secureUrl
    coverPublicId.value = asset.publicId

    emit('change', { coverUrl: coverUrl.value, coverPublicId: coverPublicId.value })

    pendingFile.value = null
    revokePreview()
  } catch (e: any) {
    error.value = e?.message ?? 'Upload fehlgeschlagen'
  } finally {
    uploading.value = false
  }
}

function clear() {
  error.value = null
  pendingFile.value = null
  revokePreview()
  coverUrl.value = null
  coverPublicId.value = null
  emit('change', { coverUrl: null, coverPublicId: null })
}
</script>

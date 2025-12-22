<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[1200] bg-black/55 backdrop-blur-sm" @click="onBackdrop" />
    </Transition>

    <Transition name="evoc-modal" appear>
      <div v-if="open" class="fixed inset-0 z-[1201] flex items-center justify-center p-4">
        <div class="relative w-full max-w-xl">
          <div class="relative isolate">
            <div class="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-40">
              <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 blur-[10px]" />
              <div class="absolute inset-[1px] rounded-[14px] bg-[#0e162c]" />
            </div>

            <div class="relative rounded-2xl bg-[#0b1228]/95 border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-purple-900/50 overflow-hidden">
              <div class="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                <h3 class="text-xl font-semibold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                  Link speichern
                </h3>

                <AppButton variant="secondary" size="md" type="button" @click="close">
                  <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                    Schließen
                  </span>
                </AppButton>
              </div>

              <div class="p-6 space-y-5">
                <div v-if="error" class="rounded-xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200">
                  {{ error }}
                </div>

                <div class="space-y-2">
                  <div class="text-xs text-white/45">Shared Link oder Code</div>
                  <input
                    v-model="input"
                    class="w-full rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-4 py-3 text-white outline-none"
                    placeholder="z.B. https://.../shared/ABC123 oder nur ABC123"
                  />
                </div>

                <div class="space-y-2">
                  <div class="text-xs text-white/45">Name / Person (optional)</div>
                  <input
                    v-model="name"
                    class="w-full rounded-2xl bg-[#111a33]/90 backdrop-blur-xl border border-white/15 px-4 py-3 text-white outline-none"
                    placeholder="Name der Person"
                  />
                </div>

                <div class="flex justify-end gap-3 pt-3">
                  <AppButton variant="secondary" type="button" @click="close">
                    <span class="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                      Abbrechen
                    </span>
                  </AppButton>

                  <AppButton variant="primary" type="button" @click="save" :disabled="saving">
                    <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                      {{ saving ? 'Speichere…' : 'Speichern' }}
                    </span>
                  </AppButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from '@/components/AppButton.vue'
import { apiFetch } from '@/lib/api'
import { createSavedShareLink } from '@/lib/api'

const props = withDefaults(defineProps<{
  modelValue: boolean
}>(), {})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'created', item: any): void
}>()

const open = computed(() => props.modelValue)

const API_BASE = '/share/saved'

const input = ref('')
const name = ref('')
const saving = ref(false)
const error = ref<string | null>(null)

function close() {
  emit('update:modelValue', false)
}

function onBackdrop() {
  close()
}

function extractCode(raw: string) {
  const s = raw.trim()
  if (!s) return ''

  // full URL?
  try {
    const u = new URL(s)
    const parts = u.pathname.split('/').filter(Boolean)
    // erwartet .../shared/{code}
    const code = parts[parts.length - 1] ?? ''
    return decodeURIComponent(code)
  } catch {
    // treat as code
    return s
  }
}

async function save() {
  error.value = null

  const codeOrLink = input.value.trim()
  if (!codeOrLink) {
    error.value = 'Bitte einen gültigen Code oder Link eingeben.'
    return
  }

  saving.value = true
  try {
    const created = await apiFetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codeOrLink,                 // ✅ backend field
        label: name.value?.trim() || null, // ✅ backend field
      }),
    })

    emit('created', created)
    close()
  } catch (e: any) {
    console.error(e)

    const msg = String(e?.message ?? '')

    // apiFetch wirft: "POST /share/saved 404: { ... "message":"Share code not found (or revoked)" ... }"
    if (msg.includes('404') && (msg.includes('not found') || msg.includes('revoked'))) {
      error.value = 'Dieser Share-Link ist nicht mehr gültig (wurde zurückgezogen oder existiert nicht). Bitte lass dir einen neuen Link schicken.'
      return
    }

    error.value = e?.message ?? 'Konnte Link nicht speichern.'
  } finally {
    saving.value = false
  }
}

watch(() => open.value, (o) => {
  if (!o) return
  input.value = ''
  name.value = ''
  error.value = null
  saving.value = false
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.evoc-modal-enter-active {
  transition: opacity 260ms cubic-bezier(0.16, 1, 0.3, 1),
  transform 340ms cubic-bezier(0.16, 1, 0.3, 1),
  filter 340ms cubic-bezier(0.16, 1, 0.3, 1);
}
.evoc-modal-leave-active {
  transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
  transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
  filter 500ms cubic-bezier(0.16, 1, 0.3, 1);
}
.evoc-modal-enter-from,
.evoc-modal-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.985);
  filter: blur(4px);
}
.evoc-modal-enter-to,
.evoc-modal-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}
</style>

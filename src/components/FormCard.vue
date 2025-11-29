<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Dialog Content -->
        <div
          class="relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl transition-colors duration-300 border"
          :class="
            isDarkMode
              ? 'bg-slate-900 border-slate-700'
              : 'bg-white border-slate-200'
          "
          @click.stop
        >
          <!-- Header -->
          <div class="p-6 border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Calendar :size="24" class="text-white" />
              </div>
              <div>
                <h2 class="text-xl" :class="isDarkMode ? 'text-slate-100' : 'text-slate-800'">
                  Neues Event erstellen
                </h2>
                <p class="text-sm mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  Fülle die Details für dein Event aus
                </p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
            <!-- Titel -->
            <div>
              <label
                for="title"
                class="block text-sm mb-2"
                :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
              >
                Titel *
              </label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                placeholder="Event-Name eingeben"
                class="w-full px-4 py-3 rounded-xl border transition-all"
                :class="
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400'
                "
              />
            </div>

            <!-- Beschreibung -->
            <div>
              <label
                for="description"
                class="block text-sm mb-2"
                :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
              >
                Beschreibung
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="4"
                placeholder="Beschreibe dein Event..."
                class="w-full px-4 py-3 rounded-xl border transition-all resize-none"
                :class="
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400'
                "
              />
            </div>

            <!-- Datum Grid -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Startdatum -->
              <div>
                <label
                  for="startDate"
                  class="block text-sm mb-2"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
                >
                  Startdatum *
                </label>
                <input
                  id="startDate"
                  v-model="formData.startDate"
                  type="date"
                  required
                  class="w-full px-4 py-3 rounded-xl border transition-all"
                  :class="
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400'
                  "
                />
              </div>

              <!-- Enddatum -->
              <div>
                <label
                  for="endDate"
                  class="block text-sm mb-2"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
                >
                  Enddatum *
                </label>
                <input
                  id="endDate"
                  v-model="formData.endDate"
                  type="date"
                  required
                  class="w-full px-4 py-3 rounded-xl border transition-all"
                  :class="
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400'
                  "
                />
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex gap-3 pt-4 border-t" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
              <button
                type="button"
                @click="$emit('close')"
                class="flex-1 px-4 py-3 rounded-xl transition-all"
                :class="
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                "
              >
                Abbrechen
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition-all"
              >
                Event erstellen
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Calendar } from 'lucide-vue-next';

interface Props {
  open: boolean;
  isDarkMode: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', data: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
});

const handleSubmit = () => {
  emit('submit', { ...formData.value });
  resetForm();
};

const handleBackdropClick = () => {
  emit('close');
};

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  };
};

watch(() => props.open, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-active .relative,
.dialog-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.dialog-enter-from .relative,
.dialog-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

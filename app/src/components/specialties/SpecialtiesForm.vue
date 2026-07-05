<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  initialName?: string
}>()

const emit = defineEmits<{
  (e: 'submit', name: string): void
}>()

const name = ref('')

watch(() => props.initialName, (v) => {
  name.value = v ?? ''
}, { immediate: true })

function onSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed) return
  emit('submit', trimmed)
}

function submit() {
  onSubmit()
}

defineExpose({ submit })
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <label class="label" for="specialty-name">Nombre</label>
      <input
        id="specialty-name"
        v-model="name"
        type="text"
        required
        class="input"
        placeholder="Ej: Cardiología"
        autofocus
      />
      <p v-if="name" class="mt-1.5 text-xs text-slate-400">
        Slug: <span class="font-mono text-slate-500">{{ name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }}</span>
      </p>
    </div>
  </form>
</template>

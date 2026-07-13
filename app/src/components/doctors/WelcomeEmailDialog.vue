<script setup lang="ts">
import { ref } from 'vue'
import { Send, Clock } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'send'): void
  (e: 'later'): void
}>()

const loading = ref(false)

async function handleSend() {
  loading.value = true
  emit('send')
}

function handleLater() {
  emit('later')
}
</script>

<template>
  <div class="text-center py-2">
    <div class="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
      <Send class="w-7 h-7 text-primary-600" />
    </div>
    <h3 class="text-lg font-semibold text-slate-900 mb-1">Médico creado correctamente</h3>
    <p class="text-sm text-slate-500 mb-6">
      ¿Querés enviarle un email de bienvenida con sus credenciales?
    </p>
    <div class="flex justify-center gap-3">
      <button class="btn-primary" :disabled="loading" @click="handleSend">
        <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        <Send v-else class="w-4 h-4" />
        Enviar email
      </button>
      <button class="btn-ghost" @click="handleLater">
        <Clock class="w-4 h-4" />
        Más tarde
      </button>
    </div>
  </div>
</template>

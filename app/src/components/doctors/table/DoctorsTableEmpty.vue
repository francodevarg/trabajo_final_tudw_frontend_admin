<script setup lang="ts">
import { Stethoscope } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div
      class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"
    >
      <Stethoscope class="w-7 h-7 text-slate-400" />
    </div>

    <p class="text-sm font-medium text-slate-600">
      No hay médicos
    </p>

    <p class="text-xs text-slate-400 mt-1">
      Agregá el primero usando el botón de arriba.
    </p>
  </div>
</template>
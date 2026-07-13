<script setup lang="ts">
defineProps<{
  steps: string[]
  current: number
}>()
</script>

<template>
  <div class="flex items-center gap-2 mb-6">
    <template v-for="(label, i) in steps" :key="i">
      <div class="flex items-center gap-2">
        <div
          class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors"
          :class="i <= current
            ? 'bg-primary-600 text-white'
            : 'bg-slate-100 text-slate-400'"
        >
          {{ i + 1 }}
        </div>
        <span
          class="text-xs font-medium hidden sm:inline transition-colors"
          :class="i <= current ? 'text-slate-700' : 'text-slate-400'"
        >
          {{ label }}
        </span>
      </div>
      <div
        v-if="i < steps.length - 1"
        class="h-px flex-1 min-w-[20px] transition-colors"
        :class="i < current ? 'bg-primary-300' : 'bg-slate-200'"
      />
    </template>
  </div>
</template>

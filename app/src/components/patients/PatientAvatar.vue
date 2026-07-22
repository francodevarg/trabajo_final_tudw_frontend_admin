<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg'
}>()

const initials = computed(() => {
  return [props.firstName, props.lastName]
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const colors = [
  'bg-primary-100 text-primary-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
]

const colorClass = computed(() => {
  const hash = [...(props.firstName + props.lastName)].reduce((a, c) => a + c.charCodeAt(0), 0)
  return colors[hash % colors.length]
})

const sizeClasses: Record<string, string> = {
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
}
</script>

<template>
  <div
    class="rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none"
    :class="[colorClass, sizeClasses[size ?? 'md']]"
  >
    {{ initials }}
  </div>
</template>

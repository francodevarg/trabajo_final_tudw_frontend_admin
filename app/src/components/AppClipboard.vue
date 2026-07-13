<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    text: string
    showOnHover?: boolean
    width?: string
    height?: string
    iconSize?: string
  }>(),
  {
    showOnHover: true,
    width: 'w-7',
    height: 'h-7',
    iconSize: 'w-3.5 h-3.5',
  }
)

const emit = defineEmits<{
  (e: 'copied'): void
}>()

const copied = ref(false)

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.text)
  } catch {
    //fallback for older browsers
    const textarea = document.createElement('textarea')

    textarea.value = props.text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'

    document.body.appendChild(textarea)

    textarea.select()
    document.execCommand('copy')

    document.body.removeChild(textarea)
  }

  copied.value = true
  emit('copied')

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <button
    type="button"
    :aria-label="copied ? 'Copiado' : 'Copiar al portapapeles'"
    :title="copied ? 'Copiado' : 'Copiar'"
    class="inline-flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
    :class="[
      width,
      height,
      showOnHover ? 'opacity-0 group-hover:opacity-100' : ''
    ]"
    @click.stop="copyToClipboard"
  >
    <Transition mode="out-in" name="clip">
      <Check
        v-if="copied"
        :class="[iconSize, 'text-emerald-500']"
      />

      <Copy
        v-else
        :class="iconSize"
      />
    </Transition>
  </button>
</template>

<style scoped>
.clip-enter-active,
.clip-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.clip-enter-from,
.clip-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
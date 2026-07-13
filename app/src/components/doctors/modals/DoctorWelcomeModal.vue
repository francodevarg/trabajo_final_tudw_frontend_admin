<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import WelcomeEmailDialog from '../WelcomeEmailDialog.vue'

defineProps<{
    open: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'send'): void
    (e: 'later'): void
}>()

function handleLater() {
    emit('later')
    emit('close')
}
</script>

<template>
    <AppModal :open="open" title="Médico creado" max-width="sm:max-w-md" @close="handleLater">
        <WelcomeEmailDialog @send="emit('send')" @later="handleLater" />
    </AppModal>
</template>
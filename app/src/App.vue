<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()

onMounted(() => {
  auth.init()
})
</script>

<template>
  <RouterView />
</template>

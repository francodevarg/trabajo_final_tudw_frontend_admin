<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
// import { seedIfEmpty } from '@/services/seed.service'

const auth = useAuthStore()

onMounted(() => {
  // seedIfEmpty()
  auth.init()
})
</script>

<template>
  <RouterView />
</template>

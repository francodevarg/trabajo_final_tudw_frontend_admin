<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen flex bg-slate-50">
    <AppSidebar v-model:open="sidebarOpen" />
    <div class="flex-1 flex flex-col min-w-0">
      <AppNavbar :on-menu="() => (sidebarOpen = true)" />
      <main class="flex-1 p-5 sm:p-6 lg:p-8 overflow-x-auto app-scroll">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
    <ToastContainer />
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.page-leave-to {
  opacity: 0;
}
</style>

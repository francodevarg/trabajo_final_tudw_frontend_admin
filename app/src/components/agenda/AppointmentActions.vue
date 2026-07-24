<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'

import type {
  AppointmentReadDTO,
  AppointmentActionConfig
} from '@/types/appointment'

import {
  getAvailableActions
} from '@/types/appointment'

import { useAuthStore } from '@/stores/auth.store'
import { useAppointmentsStore } from '@/stores/appointments.store'

import AppointmentStatusConfirmModal from './AppointmentStatusConfirmModal.vue'


const props = defineProps<{
  appointment: AppointmentReadDTO
}>()


const auth = useAuthStore()
const appointmentsStore = useAppointmentsStore()


const showMenu = ref(false)

const menuRef = ref<HTMLDivElement | null>(null)

const loadingAction = ref<string | null>(null)

const showConfirmModal = ref(false)

const pendingAction = ref<AppointmentActionConfig | null>(null)



const availableActions = computed(() =>
  getAvailableActions(
    props.appointment.status,
    auth.userGroup
  )
)



function toggleMenu() {
  showMenu.value = !showMenu.value
}



function handleClickOutside(
  event: MouseEvent
) {

  if (
    menuRef.value &&
    !menuRef.value.contains(
      event.target as Node
    )
  ) {
    showMenu.value = false
  }

}



onMounted(() => {
  document.addEventListener(
    'click',
    handleClickOutside
  )
})


onBeforeUnmount(() => {
  document.removeEventListener(
    'click',
    handleClickOutside
  )
})



function handleActionClick(
  actionConfig: AppointmentActionConfig
) {

  showMenu.value = false


  if (actionConfig.confirm) {

    pendingAction.value = actionConfig

    showConfirmModal.value = true

    return
  }


  executeAction(actionConfig)

}



async function executeAction(
  actionConfig: AppointmentActionConfig
) {

  loadingAction.value =
    actionConfig.action


  try {

    await appointmentsStore.updateAppointmentStatus(
      props.appointment.id,
      actionConfig.action
    )

  } finally {

    loadingAction.value = null

  }

}



function handleConfirmAction() {

  if (!pendingAction.value) {
    return
  }


  const action =
    pendingAction.value


  showConfirmModal.value = false

  pendingAction.value = null


  executeAction(action)

}



function handleCloseConfirm() {

  showConfirmModal.value = false

  pendingAction.value = null

}

</script>


<template>

  <div v-if="availableActions.length" ref="menuRef" class="relative" :class="showMenu ? 'z-20' : 'z-10'">

    <button @click.stop="toggleMenu" class="
        p-1.5 rounded-lg
        text-slate-400
        hover:text-slate-600
        hover:bg-slate-100
        transition-colors
        cursor-pointer
      ">

      <MoreHorizontal class="w-4 h-4" />

    </button>



    <Transition name="menu">

      <div v-if="showMenu" class="
          absolute right-0 top-full mt-1
          w-48
          bg-white
          rounded-xl
          shadow-lg
          border border-slate-100
          py-1
          z-50
        ">

        <button v-for="action in availableActions" :key="action.action" @click.stop="handleActionClick(action)"
          :disabled="loadingAction !== null" class="
            flex items-center gap-2
            w-full
            px-3 py-2
            text-sm font-medium
            rounded-lg
            transition-colors
            cursor-pointer
            text-left
            disabled:opacity-50
            disabled:cursor-not-allowed
          " :class="action.buttonClass">

          <span v-if="loadingAction === action.action" class="
              w-3.5 h-3.5
              border-2
              border-current/40
              border-t-current
              rounded-full
              animate-spin
            " />

          {{ action.label }}

        </button>

      </div>

    </Transition>



  </div>


  <AppointmentStatusConfirmModal :open="showConfirmModal" :appointment="appointment" :action-config="pendingAction"
    :loading="loadingAction !== null" @close="handleCloseConfirm" @confirm="handleConfirmAction" />


</template>


<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}


.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
</style>
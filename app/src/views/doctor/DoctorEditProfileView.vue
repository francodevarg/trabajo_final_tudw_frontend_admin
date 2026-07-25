<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDoctorsStore } from '@/stores/doctors.store'
import { useUiStore } from '@/stores/ui.store'
import DoctorsFormWizard from '@/components/doctors/DoctorsFormWizard.vue'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const doctorsStore = useDoctorsStore()
const ui = useUiStore()
const auth = useAuthStore()


const loading = ref(true)
const saving = ref(false)
const emailError = ref<string | null>(null)

const formRef = ref<InstanceType<typeof DoctorsFormWizard> | null>(null)

onMounted(async () => {
  try {
    if(auth.userDoctorId)
    await Promise.all([
      doctorsStore.fetchOne(auth.userDoctorId),
    ])
  } catch {
    ui.error('No se pudo cargar tu perfil')
  } finally {
    loading.value = false
  }
})

function handleCancel() {
  router.back()
}

async function handleSubmit(payload: any) {
  saving.value = true
  emailError.value = null
  try {
    if(auth.userDoctorId){
      await doctorsStore.updateMe(auth.userDoctorId,payload)
    }
    ui.success('Perfil actualizado correctamente')
  } catch (e: any) {
    const errData = e?.response?.data
    if (errData?.email) {
      emailError.value = errData.email
    } else {
      ui.error(errData?.detail || 'No se pudo actualizar el perfil')
    }
  } finally {
    saving.value = false
  }
}

function triggerSubmit() {
  formRef.value?.submit()
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button
        class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        @click="handleCancel"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Editar mi perfil</h1>
        <p class="text-sm text-slate-400">Gestioná tu información profesional y horarios de atención</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <Loader2 class="w-6 h-6 text-primary-500 animate-spin" />
    </div>

    <!-- Form -->
    <div v-else-if="doctorsStore.myProfile" class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <DoctorsFormWizard
        ref="formRef"
        :initial="doctorsStore.myProfile"
        :email-error="emailError"
        mode="self-edit"
        @submit="handleSubmit"
      />

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
        <button class="btn-ghost" :disabled="saving" @click="handleCancel">
          Cancelar
        </button>
        <button class="btn-primary" :disabled="saving" @click="triggerSubmit">
          <span
            v-if="saving"
            class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
          />
          Guardar perfil
        </button>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-16">
      <p class="text-sm text-slate-400">No se pudo cargar tu perfil.</p>
    </div>
  </div>
</template>

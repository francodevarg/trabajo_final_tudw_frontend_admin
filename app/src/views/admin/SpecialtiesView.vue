<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Stethoscope } from 'lucide-vue-next'
import { useSpecialtiesStore } from '@/stores/specialties.store'
import { useUiStore } from '@/stores/ui.store'
import type { Specialty } from '@/types'
import AppModal from '@/components/AppModal.vue'
import SpecialtiesForm from '@/components/specialties/SpecialtiesForm.vue'
import SpecialtiesTable from '@/components/specialties/SpecialtiesTable.vue'

const store = useSpecialtiesStore()
const ui = useUiStore()

type ModalMode = 'create' | 'edit' | 'delete' | null

const modalMode = ref<ModalMode>(null)
const selected = ref<Specialty | null>(null)
const modalLoading = ref(false)
const formRef = ref<InstanceType<typeof SpecialtiesForm> | null>(null)

onMounted(() => {
  store.fetchAll()
})

function openCreate() {
  selected.value = null
  modalMode.value = 'create'
}

function openEdit(item: Specialty) {
  selected.value = item
  modalMode.value = 'edit'
}

function openDelete(item: Specialty) {
  selected.value = item
  modalMode.value = 'delete'
}

function closeModal() {
  modalMode.value = null
  selected.value = null
}

function triggerFormSubmit() {
  formRef.value?.submit()
}

async function handleCreate(name: string) {
  modalLoading.value = true
  try {
    await store.create(name)
    ui.success('Especialidad creada')
    closeModal()
  } catch {
    ui.error('No se pudo crear la especialidad')
  } finally {
    modalLoading.value = false
  }
}

async function handleEdit(name: string) {
  if (!selected.value) return
  modalLoading.value = true
  try {
    await store.update(selected.value.id, name)
    ui.success('Especialidad actualizada')
    closeModal()
  } catch {
    ui.error('No se pudo actualizar la especialidad')
  } finally {
    modalLoading.value = false
  }
}

async function handleDelete() {
  if (!selected.value) return
  modalLoading.value = true
  try {
    await store.remove(selected.value.id)
    ui.success('Especialidad eliminada')
    closeModal()
  } catch {
    ui.error('No se pudo eliminar la especialidad')
  } finally {
    modalLoading.value = false
  }
}

function getTitle() {
  if (modalMode.value === 'create') return 'Nueva especialidad'
  if (modalMode.value === 'edit') return 'Editar especialidad'
  return 'Eliminar especialidad'
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <Stethoscope class="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Especialidades</h1>
          <p class="text-xs text-slate-400">{{ store.items.length }} registros</p>
        </div>
      </div>
      <button class="btn-primary" 
        v-permission="'doctor.add_specialty'"
        @click="openCreate">
        <Plus class="w-4 h-4" />
        Agregar
      </button>
    </div>

    <!-- Table -->
    <SpecialtiesTable
      :items="store.items"
      :loading="store.loading"
      @edit="openEdit"
      @delete="openDelete"
    />

    <!-- Modal: Create / Edit -->
    <AppModal
      :open="modalMode === 'create' || modalMode === 'edit'"
      :title="getTitle()"
      @close="closeModal"
    >
      <SpecialtiesForm
        ref="formRef"
        :initial-name="selected?.name"
        @submit="modalMode === 'create' ? handleCreate($event) : handleEdit($event)"
      />
      <template #footer>
        <div class="flex justify-end gap-2">
          <button class="btn-ghost" @click="closeModal">Cancelar</button>
          <button
            class="btn-primary"
            :disabled="modalLoading"
            @click="triggerFormSubmit"
          >
            <span v-if="modalLoading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
            {{ modalMode === 'create' ? 'Crear' : 'Guardar' }}
          </button>
        </div>
      </template>
    </AppModal>

    <!-- Modal: Delete confirmation -->
    <AppModal
      :open="modalMode === 'delete'"
      :title="getTitle()"
      @close="closeModal"
    >
      <div class="text-center">
        <div class="w-12 h-12 rounded-2xl bg-error-100 flex items-center justify-center mx-auto mb-4">
          <span class="text-error-600 text-xl">!</span>
        </div>
        <p class="text-sm text-slate-600">
          ¿Seguro que querés eliminar
          <span class="font-semibold text-slate-800">{{ selected?.name }}</span>?
        </p>
        <p class="text-xs text-slate-400 mt-1">Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <div class="flex justify-center gap-2">
          <button class="btn-ghost" @click="closeModal">Cancelar</button>
          <button
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-error-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-error-700 active:bg-error-800 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="modalLoading"
            @click="handleDelete"
          >
            <span v-if="modalLoading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
            Eliminar
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

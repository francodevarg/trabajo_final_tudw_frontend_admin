  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useDoctorsStore } from '@/stores/doctors.store'
  import { useSpecialtiesStore } from '@/stores/specialties.store'
  import { useUiStore } from '@/stores/ui.store'
  import type { Doctor, CreateDoctorRequest } from '@/types'
  import DoctorsHeader from '@/components/doctors/DoctorsHeader.vue'
  import DoctorsTable from '@/components/doctors/table/DoctorsTable.vue'
  import DoctorDeleteModal from '@/components/doctors/modals/DoctorDeleteModal.vue'
  import DoctorViewModal from '@/components/doctors/modals/DoctorViewModal.vue'
  import DoctorFormModal from '@/components/doctors/modals/DoctorFormModal.vue'

  const specialtiesStore = useSpecialtiesStore()
  const ui = useUiStore()

  type ModalMode = 'create' | 'edit' | 'delete' | 'view' | null

  const modalMode = ref<ModalMode>(null)
  const selected = ref<Doctor | null>(null)
  const modalLoading = ref(false)

  import { useDoctorsFilters } from '@/composables/doctor/useDoctorsFilters'

  import { storeToRefs } from 'pinia'

  const store = useDoctorsStore()

  const { items } = storeToRefs(store)

const {
  filters,
  filteredItems,
  hasFilters,
  clearFilters,
} = useDoctorsFilters(items)

  const createdDoctorId = ref<number | null>(null)

  onMounted(() => {
    store.fetchAll()
    specialtiesStore.fetchAll()
  })

  function openCreate() {
    selected.value = null
    modalMode.value = 'create'
    
  }

  function openEdit(item: Doctor) {
    selected.value = item
    modalMode.value = 'edit'
    
  }

  function openView(item: Doctor) {
    selected.value = item
    modalMode.value = 'view'
  }

  function openDelete(item: Doctor) {
    selected.value = item
    modalMode.value = 'delete'
  }

  function closeModal() {
    modalMode.value = null
    selected.value = null
    
  }


  function buildPayload(p: any): CreateDoctorRequest {
    return {
      first_name: p.first_name || undefined,
      last_name: p.last_name || undefined,
      email: p.email || undefined,
      specialty_id: p.specialty_id || undefined,
      insurance_ids: p.insurance_ids?.length ? p.insurance_ids : undefined,
      license_number: p.license_number || undefined,
      phone: p.phone || undefined,
      description: p.description || undefined,
      consultation_fee: p.consultation_fee || undefined,
      availabilities: p.availabilities?.length ? p.availabilities : undefined,
    }
  }

  async function handleCreate(p: any) {
    modalLoading.value = true
    
    try {
      console.log('Creating doctor with payload:', buildPayload(p))
      const doctor = await store.create(buildPayload(p))
      createdDoctorId.value = doctor.id
      modalMode.value = null
    } catch (e: any) {
      const errData = e?.response?.data
      if (errData?.email) {
        modalMode.value = 'create'
      } else {
        ui.error(errData?.detail || 'No se pudo crear el médico')
      }
    } finally {
      modalLoading.value = false
    }
  }

  async function handleEdit(p: any) {
    if (!selected.value) return
    modalLoading.value = true
    
    try {
      console.log('Updating doctor with payload:', buildPayload(p))
      await store.update(selected.value.id, buildPayload(p))
      ui.success('Médico actualizado')
      closeModal()
    } catch (e: any) {
      const errData = e?.response?.data
      if (errData?.email) {
      } else {
        ui.error(errData?.detail || 'No se pudo actualizar el médico')
      }
    } finally {
      modalLoading.value = false
    }
  }

  async function handleDelete() {
    if (!selected.value) return
    modalLoading.value = true
    try {
      await store.remove(selected.value.id)
      ui.success('Médico eliminado')
      closeModal()
    } catch {
      ui.error('No se pudo eliminar el médico')
    } finally {
      modalLoading.value = false
    }
  }


</script>

  <template>
    <div>
      <DoctorsHeader
        :total="filteredItems.length"
        :has-filters="hasFilters"
        v-model:filters="filters"
        @clear-filters="clearFilters"
        @create="openCreate"
      />

      <DoctorsTable :items="filteredItems" :loading="store.loading" @view="openView" @edit="openEdit"
        @delete="openDelete"/>

      <DoctorFormModal :open="modalMode === 'create' || modalMode === 'edit'"
        :mode="modalMode === 'create' ? 'create' : 'edit'" :doctor="selected" :loading="modalLoading"
        @close="closeModal" @create="handleCreate" @update="handleEdit" />

      <DoctorDeleteModal :open="modalMode === 'delete'" :doctor="selected" :loading="modalLoading" @close="closeModal"
        @confirm="handleDelete" />


      <DoctorViewModal :open="modalMode === 'view'" :doctor="selected" @close="closeModal" />
    </div>
  </template>

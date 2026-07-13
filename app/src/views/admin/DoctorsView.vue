  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useDoctorsStore } from '@/stores/doctors.store'
  import { useSpecialtiesStore } from '@/stores/specialties.store'
  import { useUiStore } from '@/stores/ui.store'
  import type { DoctorDTO, DoctorCreateDTO } from '@/types'
  import DoctorsHeader from '@/components/doctors/DoctorsHeader.vue'
  import DoctorsTable from '@/components/doctors/table/DoctorsTable.vue'
  import DoctorDeleteModal from '@/components/doctors/modals/DoctorDeleteModal.vue'
  import DoctorViewModal from '@/components/doctors/modals/DoctorViewModal.vue'
  import DoctorFormModal from '@/components/doctors/modals/DoctorFormModal.vue'
  import DoctorWelcomeModal from '@/components/doctors/modals/DoctorWelcomeModal.vue'

  const store = useDoctorsStore()
  const specialtiesStore = useSpecialtiesStore()
  const ui = useUiStore()

  type ModalMode = 'create' | 'edit' | 'delete' | 'view' | null

  const modalMode = ref<ModalMode>(null)
  const selected = ref<DoctorDTO | null>(null)
  const modalLoading = ref(false)

  /* ── Search & filters ── */
  const searchQuery = ref('')
  const specialtyFilter = ref('')
  const statusFilter = ref('')
  const insuranceFilter = ref('')

  const filteredItems = computed(() => {
    let items = store.items

    // Search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      items = items.filter(d =>
        d.first_name.toLowerCase().includes(q) ||
        d.last_name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        (d.license_number && d.license_number.toLowerCase().includes(q)) ||
        (d.phone && d.phone.toLowerCase().includes(q))
      )
    }

    // Specialty filter
    if (specialtyFilter.value) {
      items = items.filter(d => {
        const s = d.specialty
        if (!s) return false
        if (typeof s === 'string') return s === specialtyFilter.value
        if (typeof s === 'object' && 'name' in s) return s.name === specialtyFilter.value
        return false
      })
    }

    // Status filter
    if (statusFilter.value === 'active') {
      items = items.filter(d => d.is_active !== false)
    } else if (statusFilter.value === 'inactive') {
      items = items.filter(d => d.is_active === false)
    }

    // Insurance filter
    if (insuranceFilter.value) {
      items = items.filter(d => {
        const ins = d.insurances
        if (!Array.isArray(ins)) return false
        return ins.some(i => {
          if (typeof i === 'string') return i === insuranceFilter.value
          if (typeof i === 'object' && i !== null && 'name' in i) return i.name === insuranceFilter.value
          return false
        })
      })
    }

    return items
  })

  /* ── Modal state ── */
  const emailError = ref<string | null>(null)
  const showWelcomeDialog = ref(false)
  const createdDoctorId = ref<number | null>(null)

  onMounted(() => {
    store.fetchAll()
    specialtiesStore.fetchAll()
  })

  function openCreate() {
    selected.value = null
    modalMode.value = 'create'
    emailError.value = null
  }

  function openEdit(item: DoctorDTO) {
    selected.value = item
    modalMode.value = 'edit'
    emailError.value = null
  }

  function openView(item: DoctorDTO) {
    selected.value = item
    modalMode.value = 'view'
  }

  function openDelete(item: DoctorDTO) {
    selected.value = item
    modalMode.value = 'delete'
  }

  function closeModal() {
    modalMode.value = null
    selected.value = null
    emailError.value = null
  }


  function buildPayload(p: any): DoctorCreateDTO {
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
    emailError.value = null
    try {
      console.log('Creating doctor with payload:', buildPayload(p))
      const doctor = await store.create(buildPayload(p))
      createdDoctorId.value = doctor.id
      modalMode.value = null
      showWelcomeDialog.value = true
    } catch (e: any) {
      const errData = e?.response?.data
      if (errData?.email) {
        emailError.value = Array.isArray(errData.email) ? errData.email[0] : errData.email
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
    emailError.value = null
    try {
      console.log('Updating doctor with payload:', buildPayload(p))
      await store.update(selected.value.id, buildPayload(p))
      ui.success('Médico actualizado')
      closeModal()
    } catch (e: any) {
      const errData = e?.response?.data
      if (errData?.email) {
        emailError.value = Array.isArray(errData.email) ? errData.email[0] : errData.email
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

  async function handleSendWelcomeEmail(item: DoctorDTO) {
    try {
      await store.sendWelcomeEmail(item.id)
      ui.success('Email de bienvenida enviado')
    } catch {
      ui.error('No se pudo enviar el email')
    }
  }

  async function handleToggleActive(item: DoctorDTO) {
    try {
      await store.toggleActive(item.id)
      ui.success(item.is_active ? 'Médico desactivado' : 'Médico activado')
    } catch {
      ui.error('No se pudo cambiar el estado')
    }
  }

  async function handleViewSendWelcome() {
    if (!selected.value) return
    await handleSendWelcomeEmail(selected.value)
    const fresh = store.items.find(d => d.id === selected.value!.id)
    if (fresh) selected.value = fresh
  }

  async function handleWelcomeSend() {
    if (createdDoctorId.value) {
      try {
        await store.sendWelcomeEmail(createdDoctorId.value)
        ui.success('Email de bienvenida enviado')
      } catch {
        ui.error('No se pudo enviar el email')
      }
    }
    showWelcomeDialog.value = false
    createdDoctorId.value = null
  }

  function handleWelcomeLater() {
    showWelcomeDialog.value = false
    createdDoctorId.value = null
  }

</script>

  <template>
    <div>
      <DoctorsHeader :total="filteredItems.length" v-model:search="searchQuery" v-model:specialty="specialtyFilter"
        v-model:status="statusFilter" v-model:insurance="insuranceFilter" @create="openCreate" />

      <DoctorsTable :items="filteredItems" :loading="store.loading" @view="openView" @edit="openEdit"
        @delete="openDelete" @send-welcome-email="handleSendWelcomeEmail" @toggle-active="handleToggleActive" />

      <DoctorFormModal :open="modalMode === 'create' || modalMode === 'edit'"
        :mode="modalMode === 'create' ? 'create' : 'edit'" :doctor="selected" :loading="modalLoading"
        :email-error="emailError" @close="closeModal" @create="handleCreate" @update="handleEdit" />

      <DoctorDeleteModal :open="modalMode === 'delete'" :doctor="selected" :loading="modalLoading" @close="closeModal"
        @confirm="handleDelete" />

      <DoctorWelcomeModal :open="showWelcomeDialog" @send="handleWelcomeSend" @later="handleWelcomeLater"
        @close="handleWelcomeLater" />

      <DoctorViewModal :open="modalMode === 'view'" :doctor="selected" @close="closeModal"
        @send-welcome-email="handleViewSendWelcome" />
    </div>
  </template>

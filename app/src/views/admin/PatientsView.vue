<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePatientsStore } from '@/stores/patients.store'
import type { Patient } from '@/types'
import PatientsHeader from '@/components/patients/PatientsHeader.vue'
import PatientsTable from '@/components/patients/PatientsTable.vue'
import PatientDetailModal from '@/components/patients/PatientDetailModal.vue'

const store = usePatientsStore()

const showModal = ref(false)
const selectedPatient = ref<Patient | null>(null)


onMounted(() => {
  store.fetchAll()
})

function onRefresh() {
  store.fetchAll()
}


function openDetail(item: Patient) {
  selectedPatient.value = item
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedPatient.value = null
}
</script>

<template>
  <div>
    <PatientsHeader
      :total="store.items.length"
      :loading="store.loading"
      @refresh="onRefresh"
    />

    <PatientsTable
      :items="store.items"
      :loading="store.loading"
      @view="openDetail"
    />

    <PatientDetailModal
      :open="showModal"
      :patient="selectedPatient"
      @close="closeModal"
    />
  </div>
</template>

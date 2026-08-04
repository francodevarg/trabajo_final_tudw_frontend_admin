<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePatientsStore } from '@/stores/patients.store'
import type { Patient } from '@/types'
import PatientsHeader from '@/components/patients/PatientsHeader.vue'
import PatientsTable from '@/components/patients/PatientsTable.vue'
import PatientDetailModal from '@/components/patients/PatientDetailModal.vue'

const store = usePatientsStore()

const showModal = ref(false)
const selectedPatient = ref<Patient | null>(null)
const search = ref('')

const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return store.items

  return store.items.filter(item => {
    const fullName = `${item.first_name} ${item.last_name}`.toLowerCase()
    return fullName.includes(q) || String(item.dni).includes(q)
  })
})


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
      v-model:search="search"
      :total="filteredItems.length"
      :loading="store.loading"
      @refresh="onRefresh"
    />

    <PatientsTable
      :items="filteredItems"
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

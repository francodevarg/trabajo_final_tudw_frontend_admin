<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { usePatientsStore } from '@/stores/patients.store'
import type { Patient } from '@/types'
import PatientsHeader from '@/components/patients/PatientsHeader.vue'
import PatientsTable from '@/components/patients/PatientsTable.vue'
import PatientDetailModal from '@/components/patients/PatientDetailModal.vue'

const store = usePatientsStore()

const showModal = ref(false)
const selectedPatient = ref<Patient | null>(null)

let searchTimeout: ReturnType<typeof setTimeout>

onMounted(() => {
  store.fetchAll()
})

function onSearch(value: string) {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.setSearch(value)
  }, 350)
}

function onOrdering(value: string) {
  store.setOrdering(value)
}

function onRefresh() {
  store.fetchAll()
}

function onPageChange(page: number) {
  store.setPage(page)
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
      :total="store.count"
      :loading="store.loading"
      :search="store.search"
      :ordering="store.ordering"
      @update:search="onSearch"
      @update:ordering="onOrdering"
      @refresh="onRefresh"
    />

    <PatientsTable
      :items="store.items"
      :loading="store.loading"
      :count="store.count"
      :page="store.currentPage"
      :page-size="store.pageSize"
      @view="openDetail"
      @page-change="onPageChange"
    />

    <PatientDetailModal
      :open="showModal"
      :patient="selectedPatient"
      @close="closeModal"
    />
  </div>
</template>

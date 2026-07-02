<script lang="ts">
import { defineComponent } from 'vue';
// import { useSpecialtiesStore } from '@/stores/specialties';

// const specialtiesStore = useSpecialtiesStore();

export default defineComponent({
  name: 'SpecialtiesView',
  setup() {
    return {
    //   specialties: specialtiesStore.specialties
    };
  }
});
</script>

<template>
  <div>
    <h1>Specialties</h1>
    <!-- <ul>
      <li v-for="specialty in specialties" :key="specialty.id">
        {{ specialty.name }}
      </li>
    </ul> -->
  </div>
</template>
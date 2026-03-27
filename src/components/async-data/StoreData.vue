<script setup lang="ts">
import { useDataStore } from "@/stores/dataStoreExtraction"

const storeData = useDataStore()
const { fetchData, getExtractible } = storeData;

// INFO
// l'opération est asynchrone, il faut donc attendre que le store soit chargé 
// avant d'initialiser la carte.
onMounted(async () => {
  await fetchData();
}); 

</script>

<template>
  <slot v-if="!storeData.loading && !storeData.error" />
</template>
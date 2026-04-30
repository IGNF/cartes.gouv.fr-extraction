<script setup lang="ts">
import { useLogger } from "vue-logger-plugin";
import { useDataStore } from "@/stores/dataStoreExtraction"
import { useAppStore } from "@/stores/appStore";

const appStore = useAppStore();
const storeData = useDataStore()
const log = useLogger();
const { fetchData, getExtractible } = storeData;

// INFO
// l'opération est asynchrone, il faut donc attendre que le store soit chargé 
// avant d'initialiser la carte.
watch(() => appStore.isAuthenticated, async (isAuthenticated) => {
  log.debug("Authentication status changed:", isAuthenticated);
  if (isAuthenticated) {
    log.debug("User is authenticated, fetching data...");
    await fetchData(appStore.service);
  }
}, { immediate: true });
</script>

<template>
  <slot />
</template>
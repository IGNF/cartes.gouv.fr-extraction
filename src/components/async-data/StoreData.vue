<script setup lang="ts">
import { watch } from "vue";
import { useLogger } from "vue-logger-plugin";
import { useDataStore } from "@/stores/dataStoreExtraction"
import { useAuth } from "authentification-vue-oidc";

const { isAuthenticated, user } = useAuth();
const storeData = useDataStore()
const log = useLogger();
const { fetchData, resetData } = storeData;

// INFO
// l'opération est asynchrone, il faut donc attendre que le store soit chargé 
// avant d'initialiser la carte.
watch(() => isAuthenticated.value ? user.value?.sub : undefined, async (subject) => {
  resetData();
  if (subject) {
    log.debug("User is authenticated, fetching data...");
    await fetchData();
  }
}, { immediate: true });
</script>

<template>
  <slot />
</template>
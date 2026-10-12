<script setup lang="ts">
import { computed, toRaw, watch } from "vue";
import { useLogger } from "vue-logger-plugin";
import { useDataStore } from "@/stores/dataStoreExtraction"
import { useStore } from "cartes.gouv.fr-service";

const store = useStore();
const isAuthenticated = computed(() => Boolean(store.connexion?.authenticated));
const storeData = useDataStore()
const log = useLogger();
const { fetchData } = storeData;

// INFO
// l'opération est asynchrone, il faut donc attendre que le store soit chargé 
// avant d'initialiser la carte.
watch(isAuthenticated, async (isAuthenticated) => {
  log.debug("Authentication status changed:", isAuthenticated);
  if (isAuthenticated) {
    log.debug("User is authenticated, fetching data...");
    await fetchData(toRaw(store.getService()));
  }
}, { immediate: true });
</script>

<template>
  <slot />
</template>
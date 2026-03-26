<script setup lang="ts">
import Extraction from '@/views/Extraction.vue'
import Patience from '@/components/Patience.vue'
import StoreData from '@/components/StoreData.vue';
</script>

<template>
  <Suspense>
    <!-- Chargement du dataStore avec une patience 
          avant afficahge de la cartographie 
      -->
    <StoreData>
      <Extraction />
    </StoreData>

    <!-- loading state via #fallback slot -->
    <template #fallback>
      <Patience />
    </template>
  </Suspense>
</template>

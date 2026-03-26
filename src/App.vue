<script setup lang="ts">
import Patience from '@/components/Patience.vue'
import StoreData from '@/components/StoreData.vue';

const serviceTitle = 'Service'
const serviceDescription = 'Description du service'
const logoText = ['Ministère', 'de l’intérieur']

const quickLinks = [
  {
    label: 'Home',
    to: '/',
    icon: 'ri-home-4-line',
    iconAttrs: { color: 'var(--red-marianne-425-625)' },
  }
]
const searchQuery = ref('')
</script>

<template>
  <DsfrHeader
    v-model="searchQuery"
    :service-title="serviceTitle"
    :service-description="serviceDescription"
    :logo-text="logoText"
    :quick-links="quickLinks"
    show-search
  />
  <Suspense>
    <!-- Chargement du dataStore avec une patience 
          avant afficahge de la cartographie 
      -->
    <StoreData>
        <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w">
          <RouterView />
        </div>
    </StoreData>
    <!-- loading state via #fallback slot -->
    <template #fallback>
      <Patience />
    </template>
  </Suspense>
</template>

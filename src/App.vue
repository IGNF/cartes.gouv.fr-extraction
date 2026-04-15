<script setup lang="ts">
import Patience from '@/components/utils/Patience.vue'
import StoreData from '@/components/async-data/StoreData.vue';
import { CgfrFooter, CgfrHeader } from 'cartes.gouv.fr-vue-components'

import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";

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
  <CgfrHeader
    class="CgfrHeader"
    badge-text="Extraction"
    badge-icon="fr-icon-road-map-fill"
    badge-color="pink-macaron"
  />
  <Suspense>
    <!-- Chargement du dataStore avec une patience 
          avant afficahge de la cartographie 
      -->
    <StoreData>
        <div class="Alerts" />
        <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w Content">
          <RouterView />
        </div>
        <CgfrFooter />
        <Modals />
    </StoreData>
    <!-- loading state via #fallback slot -->
    <template #fallback>
      <Patience />
    </template>
  </Suspense>
</template>

<style lang="scss">
body {
  min-height: 100vh;
}
#app {
  display: grid;
  // on définit 4 lignes (attention, il faut bien 4 enfants dans #app)
  // [nom] taille
  grid-template-rows:
    [header] auto
    [alerts] auto
    [content] 1fr
    [footer] auto;
  min-height: 100vh;
}
// on place les éléments
.CgfrHeader {
  grid-row: header;
}
.Alerts {
  grid-row: alerts;
}
.Content {
  grid-row: content;
}
.CgfrFooter {
  grid-row: footer;
}
</style>

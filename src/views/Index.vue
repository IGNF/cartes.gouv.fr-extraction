<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";
import Patience from '@/components/utils/Patience.vue'
import StoreData from '@/components/async-data/StoreData.vue';
import { CgfrFooter, CgfrHeader } from 'cartes.gouv.fr-vue-components'
import { useAppStore } from '@/stores/appStore';
import HomePage from "./HomePage.vue";

const appStore = useAppStore();

const onConnect = () => {
  console.log(appStore.service);
  appStore.service?.getAccessLogin()
  .then((url) => {
    console.log(url);
    window.location.href = url; // redirection vers la page ssosS
  });
}
const onDisconnect = () => {
  appStore.service?.getAccessLogout()
  .then((url) => {
    console.log(url);
    window.location.href = url; // redirection vers la page sso
  });
}
const user = computed(() => appStore.service?.getUser());
</script>

<template>
  <CgfrHeader
    class="CgfrHeader"
    badge-text="Extraction"
    badge-icon="fr-icon-road-map-fill"
    badge-color="pink-macaron"
    :authenticated="appStore.service?.authenticated"
    :user="appStore.service?.user" 
    @login="onConnect"
    @logout="onDisconnect"
  />
  INDEX.VUE
  		{{ appStore.service?.authenticated }}
		{{ user }}
    <HomePage v-if="!appStore.service?.authenticated"/>
    <Suspense v-else>
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

<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";
import { watch } from 'vue';
import Patience from '@/components/utils/Patience.vue'
import StoreData from '@/components/async-data/StoreData.vue';
import { CgfrFooter, CgfrHeader } from 'cartes.gouv.fr-vue-components'
import { useAppStore } from '@/stores/appStore';
import HomePage from "./HomePage.vue";

import { getService, useAuth, getSettings } from 'cartes.gouv.fr-service';

const appStore = useAppStore();

// initialisation du service
const service = getService({ mode: 'local' });
// authentification
const { isAuthenticated, user } = useAuth({ service, options: { routing : false} });

// sauvegarde du service dans le store dès que l'authentification 
// est établie. On pourrait ausi utilise un provider/inject.
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    appStore.setService(service);
  }
}, { immediate: true });

// gestion de la connexion
const onConnect = () => {
  service.getAccessLogin()
  .then((url:string) => {
    window.location.href = url; // redirection vers la page sso
  });
}
// gestion de la déconnexion
const onDisconnect = () => {
  service.getAccessLogout()
  .then((url:string) => {
    window.location.href = url; // redirection vers la page sso
  });
}
const baseUrl = import.meta.env.BASE_URL;
</script>

<template>
  <!-- INFO : on ne peut pas utiliser user directement depuis useAuth 
   car user est une string, alors que le composant CgfrHeader 
   attend un objet utilisateur -->
  <div id="app">


    <!-- FIRST GRID ROW -->
    <CgfrHeader
      class="CgfrHeader header"
      badge-text="Extraction"
      badge-icon="fr-icon-road-map-fill"
      badge-color="pink-macaron"
      :baseUrl="baseUrl"
      :authenticated="isAuthenticated"
      :user="appStore.service?.user" 
      @login="onConnect"
      @logout="onDisconnect"
    />


    <!-- SECOND GRID ROW -->
    <div class="alerts" />


    <!-- THIRD GRID ROW -->
    <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w Content">
      <!-- <Suspense v-else> -->
        <!-- Chargement du dataStore avec une patience 
              avant afficahge de la cartographie 
          -->
        <!-- <StoreData> -->
              <RouterView />
            <Modals />
        <!-- </StoreData> -->
        <!-- loading state via #fallback slot -->
        <!-- <template #fallback>
          <Patience />
        </template> -->
      <!-- </Suspense> -->
    </div>


    <!-- LAST GRID ROW -->
    <CgfrFooter class="footer"/>
  </div>
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

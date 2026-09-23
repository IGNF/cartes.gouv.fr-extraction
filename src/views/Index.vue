<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";
import { watch } from 'vue';
import Patience from '@/components/utils/Patience.vue'
import StoreData from '@/components/async-data/StoreData.vue';
import { CgfrFooter, CgfrHeader } from '@ignf/cartes.gouv.fr-vue-components'
import { useAppStore } from '@/stores/appStore';
import HomePage from "./HomePage.vue";
import { getBaseUrl } from '@/config/configService';

const appStore = useAppStore();

// gestion de la connexion
const onConnect = () => {
  appStore.service?.getAccessLogin()
  .then((url:string) => {
    window.location.href = url; // redirection vers la page sso
  });
}
// gestion de la déconnexion
const onDisconnect = () => {
  appStore.service?.getAccessLogout()
  .then((url:string) => {
    window.location.href = url; // redirection vers la page sso
  });
}

// Get baseUrl from centralized configuration service
const baseUrl = getBaseUrl();
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
      :authenticated="appStore.isAuthenticated"
      :user="appStore.user" 
      @login="onConnect"
      @logout="onDisconnect"
    />


    <!-- SECOND GRID ROW -->
    <div class="alerts" />


    <!-- THIRD GRID ROW -->
    <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w Content">
      <Suspense>
        <!-- Chargement du dataStore avec une patience 
              avant afficahge de la cartographie 
          -->
        <StoreData>
              <RouterView />
            <Modals />
        </StoreData>
        <!-- loading state via #fallback slot -->
        <template #fallback>
          <Patience />
        </template>
      </Suspense>
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

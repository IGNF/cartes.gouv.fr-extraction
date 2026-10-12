<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";
import { computed, toRaw } from 'vue';
import Patience from '@/components/utils/Patience.vue'
import StoreData from '@/components/async-data/StoreData.vue';
import { CgfrFooter, CgfrHeader } from '@ignf/cartes.gouv.fr-vue-components'
import { useStore } from 'cartes.gouv.fr-service';

const store = useStore();
const isAuthenticated = computed(() => Boolean(store.connexion?.authenticated));
const user = computed(() => store.connexion?.user || {});

// gestion de la connexion
const onConnect = () => {
  toRaw(store.getService())?.getAccessLogin()
  .then((url:string) => {
    window.location.href = url; // redirection vers la page sso
  });
}
// gestion de la déconnexion
const onDisconnect = () => {
  toRaw(store.getService())?.getAccessLogout()
  .then((url:string) => {
    window.location.href = url; // redirection vers la page sso
  });
}

</script>

<template>
  <!-- Le profil utilisateur est lu directement dans le store de la bibliothèque. -->
  <div id="app">


    <!-- FIRST GRID ROW -->
    <CgfrHeader
      class="CgfrHeader header"
      badge-text="Extraction"
      badge-icon="fr-icon-road-map-fill"
      badge-color="pink-macaron"
      :authenticated="isAuthenticated"
      :user="user"
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

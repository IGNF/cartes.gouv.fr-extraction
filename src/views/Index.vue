<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Patience from '@/components/utils/Patience.vue'
import Alerts from '@/components/alerts/Alerts.vue'
import StoreData from '@/components/async-data/StoreData.vue';
import { CgfrFooter, CgfrHeader } from '@ignf/cartes.gouv.fr-vue-components'
import { useAuth } from 'authentification-vue-oidc';

const { isAuthenticated, user: authUser, status, login, logout, error } = useAuth();
const route = useRoute();
const actionError = ref('');
// Le bandeau utilise encore le format de profil first_name / last_name.
const user = computed(() => ({
  first_name: authUser.value?.claims.given_name || authUser.value?.name || '',
  last_name: authUser.value?.claims.family_name || '',
  email: authUser.value?.email || '',
}));


const onConnect = () => login({ returnTo: route.fullPath });
const onDisconnect = () => logout();

</script>

<template>
  <!-- La session et le profil sont fournis par la bibliothèque OIDC. -->
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
    <Alerts class="Alerts" />


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
    <CgfrFooter class="footer" compact />
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

<script setup lang="ts">
import Patience from '@/components/utils/Patience.vue'
import StoreData from '@/components/async-data/StoreData.vue';
import { CgfrFooter, CgfrHeader } from 'cartes.gouv.fr-vue-components'
import { getService, useAuth } from 'cartes.gouv.fr-service';
import { setSettings } from 'cartes.gouv.fr-service';

  setSettings({
    IamCheckSsoDisable : import.meta.env.IAM_CHECK_SSO_DISABLE,
    IamCheckSsoAutoAuth : import.meta.env.IAM_CHECK_SSO_AUTO_AUTH,
    IamCheckSsoType : import.meta.env.IAM_CHECK_SSO_TYPE,
    IamCheckSsoTimeout : import.meta.env.IAM_CHECK_SSO_TIMEOUT,
    IamCheckSsoClientId : import.meta.env.IAM_CHECK_SSO_CLIENT_ID,
    IamDisable : import.meta.env.IAM_DISABLE,
    IamAuthMode : import.meta.env.IAM_AUTH_MODE,
    IamUrl : import.meta.env.IAM_URL,
    IamRealm : import.meta.env.IAM_REALM,
    IamClientId : import.meta.env.IAM_CLIENT_ID,
    IamClientSecret : import.meta.env.IAM_CLIENT_SECRET,
    IamEntrepotApiUrl : import.meta.env.IAM_ENTREPOT_API_URL,
    IamRedirectRemote : import.meta.env.IAM_REDIRECT_REMOTE,
    IamEntrepotApiUrlRemote : import.meta.env.IAM_ENTREPOT_API_URL_REMOTE
  });
console.log('import.meta.env', import.meta.env);
const service = getService({ mode: 'local' });
const { isAuthenticated, user } = useAuth({ service });

import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";

const onConnect = () => {
  service.getAccessLogin()
  .then((url) => {
    console.log(url);
    window.location.href = url; // redirection vers la page ssosS
  });
}
const onDisconnect = () => {
  service.getAccessLogout()
  .then((url) => {
    console.log(url);
    // window.location.href = url; // redirection vers la page sso
  });
}
</script>

<template>
  <DsfrButton
    v-if="!isAuthenticated"
    class="fr-mt-2w fr-mb-2w"
    label="Connection"
    @click="onConnect"
  />
    <DsfrButton
    v-else
    class="fr-mt-2w fr-mb-2w"
    label="Déconnexion"
    @click="onDisconnect"
  >
  Déconnecte : {{ user }}
  </DsfrButton>
  <!-- <CgfrHeader
    class="CgfrHeader"
    badge-text="Extraction"
    badge-icon="fr-icon-road-map-fill"
    badge-color="pink-macaron"
    :authenticated="isAuthenticated"
    :user="user" /> -->
    {{ isAuthenticated }}
    {{ user }}
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

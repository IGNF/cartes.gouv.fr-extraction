<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";
import { watch } from "vue";

import { useLogger } from "vue-logger-plugin";
import { useAppStore } from "./stores/appStore";

import { setSettings } from "cartes.gouv.fr-service";
import Index from "./views/Index.vue";

import { getService, useAuth } from "cartes.gouv.fr-service";

const log = useLogger();

const appStore = useAppStore();

// Configuration du service d'authentification avec les variables d'environnement
// Ces variables sont injectées au moment de la construction de l'application,
// et permettent de configurer le comportement du service d'authentification.
// Note : on utilise un fichier .env.local pour définir ces variables en local, 
// et elles peuvent être définies différemment en production.
setSettings({
  BaseUrl : import.meta.env.BASE_URL,
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
  IamEntrepotApiUrlRemote : import.meta.env.IAM_ENTREPOT_API_URL_REMOTE,
});

const service = getService({ mode: 'local' });
appStore.service = service;

const { isAuthenticated, user } = useAuth({ service, options: { routing : false} });

// Nécessaire de watch les deux porpriétés car elles sont mises à jour de manière asynchrone, 
// et on veut s'assurer que le store est mis à jour dès que l'une ou l'autre change.
watch([isAuthenticated, user], ([authenticated, currentUser]) => {
  appStore.isAuthenticated = authenticated;
  appStore.user = currentUser;
}, { immediate: true });

</script>

<template>
  <Index />
</template>

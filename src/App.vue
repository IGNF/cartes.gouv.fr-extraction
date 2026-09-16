<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";
import { watch } from "vue";

import { useLogger } from "vue-logger-plugin";
import { useAppStore } from "./stores/appStore";

import { setSettings } from "cartes.gouv.fr-service";
import Index from "./views/Index.vue";

import { getService, useAuth } from "cartes.gouv.fr-service";
import { getRuntimeConfig } from "./config/configService";

const log = useLogger();

const appStore = useAppStore();

// Get the runtime configuration (loaded from config.json or import.meta.env)
const config = getRuntimeConfig();

// Configuration du service d'authentification avec les variables d'environnement
// Ces variables proviennent maintenant du service centralisé de configuration
// qui peut charger depuis:
// - import.meta.env en développement local
// - /config/config.json en production (via Kubernetes ConfigMap)
setSettings({
  BaseUrl: config.BASE_URL,
  IamCheckSsoDisable: config.IAM_CHECK_SSO_DISABLE,
  IamCheckSsoAutoAuth: config.IAM_CHECK_SSO_AUTO_AUTH,
  IamCheckSsoType: config.IAM_CHECK_SSO_TYPE,
  IamCheckSsoTimeout: config.IAM_CHECK_SSO_TIMEOUT,
  IamCheckSsoClientId: config.IAM_CHECK_SSO_CLIENT_ID,
  IamDisable: config.IAM_DISABLE,
  IamAuthMode: config.IAM_AUTH_MODE,
  IamUrl: config.IAM_URL,
  IamRealm: config.IAM_REALM,
  IamClientId: config.IAM_CLIENT_ID,
  IamClientSecret: config.IAM_CLIENT_SECRET,
  IamEntrepotApiUrl: config.IAM_ENTREPOT_API_URL,
  IamRedirectRemote: config.IAM_REDIRECT_REMOTE,
  IamEntrepotApiUrlRemote: config.IAM_ENTREPOT_API_URL_REMOTE,
});

const service = getService({ mode: 'local' });
appStore.service = service;

const { isAuthenticated, user } = useAuth({ service, options: { routing : false} });

// Nécessaire de watch les deux porpriétés car elles sont mises à jour de manière asynchrone, 
// et on veut s'assurer que le store est mis à jour dès que l'une ou l'autre change.
watch([isAuthenticated, user], ([authenticated, currentUser]) => {
  appStore.isAuthenticated = authenticated;
  appStore.user = authenticated ? service.user : currentUser;
}, { immediate: true });

</script>

<template>
  <Index />
</template>

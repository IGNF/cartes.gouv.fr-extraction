<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";
import { getService, setSettings, useAuth, useStore } from "cartes.gouv.fr-service";
import Index from "./views/Index.vue";
import { getRuntimeConfig } from "./config/configService";

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

// Réhydrater le service depuis le store persisté avant l'initialisation unique de l'authentification.
const store = useStore();
const persisted = store.connexion ? { ...store.connexion } : {};
const service = getService({ mode: 'local', ...persisted });
store.setService(service);

// Les composants lisent ensuite directement l'état de connexion dans le store de la bibliothèque.
useAuth({ service, options: { routing: false } });

</script>

<template>
  <Index />
</template>

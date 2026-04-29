<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";

import { setSettings } from "cartes.gouv.fr-service";
import Index from "./views/Index.vue";

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

</script>

<template>
  <Index />
</template>

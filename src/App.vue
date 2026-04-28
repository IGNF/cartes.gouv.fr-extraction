<script setup lang="ts">
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";
import { useAppStore } from '@/stores/appStore';
import { getService, useAuth } from 'cartes.gouv.fr-service';
import { setSettings } from "cartes.gouv.fr-service";
import Index from "./views/Index.vue";

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
  IamEntrepotApiUrlRemote : import.meta.env.IAM_ENTREPOT_API_URL_REMOTE,
  BaseUrl : import.meta.env.BASE_URL,
});

const service = getService({ mode: 'local' });
const appStore = useAppStore();
appStore.setService(service);
const { isAuthenticated, user } = useAuth({ service });

</script>

<template>
  <Index />
</template>

import { createPinia } from "pinia";
import { createApp } from "vue";
import { createLogger } from "vue-logger-plugin";
import { storePlugin } from "pinia-plugin-store";

import App from "./App.vue";
import createAppRouter from "./router/index";
import { initializeConfig, isProduction, isDevelopment } from "./config/configService";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons.min.css";
import "@gouvminint/vue-dsfr/styles";
import "cartes.gouv.fr-vue-components/dist/index.css";

import "./main.css";

/**
 * Initialisation de la configuration avant la création de l'application Vue
 *
 * Cette étape critique doit se produire en premier :
 * 1. En développement : utilise les variables import.meta.env
 * 2. En production : charge /config/config.json depuis le ConfigMap Kubernetes
 *
 * Toute l'application dépend de cette configuration chargée avant le montage.
 */
async function bootstrap() {
  try {
    // Initialisation de la configuration — doit précéder tout accès à getRuntimeConfig()
    await initializeConfig();

    const pinia = createPinia();
    const store = storePlugin({
      stores: ["service"],
      storage: localStorage,
    });
    pinia.use(store);

    const logger = createLogger({
      enabled: true,
      level: isProduction() ? "error" : "debug",
      callerInfo: true,
    });

    const router = createAppRouter();
    createApp(App).use(pinia).use(router).use(logger).mount("#app");
  } catch (error) {
    console.error('[Bootstrap] Échec de l\'initialisation de l\'application :', error);
    // Affichage de l'erreur à l'utilisateur
    const errorElement = document.getElementById('app');
    if (errorElement) {
      errorElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif; color: #d0576b;">
          <h1>Erreur d'initialisation de l'application</h1>
          <p>Impossible de charger la configuration</p>
          <details>
            <summary>Détails de l'erreur</summary>
            <pre>${error instanceof Error ? error.message : String(error)}</pre>
          </details>
        </div>
      `;
    }
    throw error;
  }
}

// Lancement du processus d'initialisation
bootstrap();

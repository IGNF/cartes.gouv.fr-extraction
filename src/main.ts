import { createPinia } from "pinia";
import { createApp } from "vue";
import { createLogger } from "vue-logger-plugin";
import { storePlugin } from "pinia-plugin-store";

import App from "./App.vue";
import router from "./router/index";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons.min.css";
import "@gouvminint/vue-dsfr/styles";
import "cartes.gouv.fr-vue-components/dist/index.css";

import "./main.css";

// https://vitejs.dev/guide/env-and-mode.html#node-env-and-modes
const isProduction = import.meta.env.MODE === "production";

const pinia = createPinia();
const store = storePlugin({
  stores: ["service"],
  storage: localStorage,
});
pinia.use(store);

const logger = createLogger({
  enabled: true,
  level: isProduction ? "error" : "debug",
  callerInfo: true,
});

createApp(App).use(pinia).use(router).use(logger).mount("#app");

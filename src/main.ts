import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

import '@gouvfr/dsfr/dist/dsfr.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'
import '@gouvminint/vue-dsfr/styles'
import 'cartes.gouv.fr-vue-components/dist/index.css'

import './main.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')

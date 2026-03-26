import { createRouter, createWebHistory } from 'vue-router'

import Extraction from '@/views/CreateExtraction/Extraction.vue'
import MyExtractions from '@/views/MyExtraction/MyExtractions.vue'

const MAIN_TITLE = 'Gabarit de démarrage VueDsfr'

const routes = [
  {
    path: '/',
    name: 'extraction',
    component: Extraction,
    alias: '/extraction',
  },
  {
    path: '/myextractions/repositories',
    name: 'repositories',
    component: MyExtractions,
    alias: '/myextractions',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env?.BASE_URL || ''),
  routes,
})

router.beforeEach((to) => {
  // Cf. https://github.com/vueuse/head pour des transformations avancées de Head
  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router

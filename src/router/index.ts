import { createRouter, createWebHistory } from 'vue-router'

import Extraction from '@/views/CreateExtraction/Extraction.vue'
import MyExtractions from '@/views/MyExtraction/MyExtractions.vue'
import RepositoryList from '@/views/MyExtraction/RepositoryList.vue'
import RepositoryDetail from '@/views/MyExtraction/RepositoryDetail.vue'
import ExtractionDetail from '@/views/MyExtraction/ExtractionDetail.vue'
import HomePage from '@/views/HomePage.vue'

const MAIN_TITLE = 'Gabarit de démarrage VueDsfr'

const routes = [
  {
    path: '/',
    name: 'extraction',
    component: HomePage,
    alias: '/extraction',
  },
  {
    path: '/new-extraction',
    name: 'new-extraction',
    component: Extraction,
  },
  {
    path: '/myextractions',
    name: 'repositories',
    component: MyExtractions,
       children: [
      {
        path: '', // /repositories
        name: 'RepositoriesList',
        component: RepositoryList,
        props: true

      },
      {
        path: ':repo_id', // /repositories/123
        name: 'RepositoryDetail',
        component: RepositoryDetail,
        props: true
      },
      {
        path: ':repo_id/:extraction_id', // /repositories/123/456
        name: 'ExtractionDetail',
        component: ExtractionDetail,
        props: true
      }
    ]
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

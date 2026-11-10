import { createRouter, createWebHistory } from 'vue-router'
import { createAuthGuard } from 'authentification-vue-oidc'
import { getBaseUrl } from '@/config/configService'

import MyExtractions from '@/views/MyExtraction/MyExtractionsWithHistory.vue'
import HomePage from '@/views/HomePage.vue'
import CreateExtraction from '@/views/CreateExtraction/CreateExtraction.vue'

const MAIN_TITLE = 'Extraire une donnée | cartes.gouv.fr'

const routes = [
  {
    path: '/',
    name: 'extraction',
    component: HomePage,
  },
  {
    path: '/nouvelle-extraction',
    name: 'nouvelle-extraction',
    component: CreateExtraction,
    meta: { requiresAuth: true, title: 'Créer une extraction' },
  },
  {
    path: '/mes-extractions/',
    name: 'repositories',
    component: MyExtractions,
    meta: { requiresAuth: true, title: 'Mes extractions' },
    //    children: [
    //   {
    //     path: '', // /repositories
    //     name: 'RepositoriesList',
    //     component: RepositoryList,
    //     props: true

    //   },
    //   {
    //     path: ':repo_id', // /repositories/123
    //     name: 'RepositoryDetail',
    //     component: RepositoryDetail,
    //     props: true
    //   },
    //   {
    //     path: ':repo_id/:extraction_id', // /repositories/123/456
    //     name: 'ExtractionDetail',
    //     component: ExtractionDetail,
    //     props: true
    //   }
    // ]
  },
  {
    path: '/login',
    name: 'login',
    component: HomePage,
    meta: { isAuthCallback: true },
  },
  {
    path: '/logout',
    redirect: { name: 'extraction' },
  },
]

function createAppRouter() {
  const router = createRouter({
    history: createWebHistory(getBaseUrl()),
    routes,
  })

  router.beforeEach((to) => {
    const specificTitle = to.meta.title ? `${to.meta.title} | ` : ''
    document.title = `${specificTitle}${MAIN_TITLE}`
  })
  router.beforeEach(createAuthGuard())

  return router
}

export default createAppRouter



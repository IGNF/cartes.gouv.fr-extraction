import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

import MyExtractions from '@/views/MyExtraction/MyExtractions.vue'
import HomePage from '@/views/HomePage.vue'
import CreateExtraction from '@/views/CreateExtraction/CreateExtraction.vue'

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
    component: CreateExtraction,
    meta: { requiresAuth: true },
  },
  {
    path: '/myextractions',
    name: 'repositories',
    component: MyExtractions,
    meta: { requiresAuth: true },
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
    redirect: '/extraction',
  },
  {
    path: '/logout',
    redirect: '/extraction',
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

  // si la route cible nécessite une connexion
  // (`meta.requiresAuth`) et que l'utilisateur n'est pas authentifié,
  // on redirige vers la page d'accueil
  const appStore = useAppStore()
  if (to.meta.requiresAuth && !appStore.isAuthenticated) {
    return {
      path: '/extraction',
    }
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/AppHome.vue'
import AboutUs from '../views/AboutUs.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import { validateToken } from '../composables/use-auth'

const MAIN_TITLE = 'Gabarit de démarrage VueDsfr'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/a-propos',
    name: 'About',
    component: AboutUs,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Connexion' },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, title: "Administration" },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env?.BASE_URL || ''),
  routes,
})

router.beforeEach(async (to) => { // Title + garde d'auth
  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`

  if ((to.meta as any).requiresAuth) {
    const ok = await validateToken()
    if (!ok) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }
})

export default router

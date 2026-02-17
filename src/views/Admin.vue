<template>
  <div class="container">
    <h1>Page d'administration</h1>
    <p>Bienvenue sur votre espace personnel.</p>
    <div>
      <button @click="onLogout">Se déconnecter</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { logout } from '../composables/use-auth'

export default {
  setup() {
    const router = useRouter()
    function onLogout() {
      logout()
      router.push('/login')
    }
    return { onLogout }
  },
}
</script>

<style scoped>
.container { max-width:720px; margin:40px auto }
button { padding:8px 12px }
</style>

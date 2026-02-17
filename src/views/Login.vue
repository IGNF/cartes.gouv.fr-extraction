<template>
  <div class="container">
    <h1>Connexion</h1>
    <form @submit.prevent="onSubmit">
      <div>
        <label>Identifiant</label>
        <input v-model="username" required />
      </div>
      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" required />
      </div>
      <div style="margin-top:8px">
        <button type="submit">Se connecter</button>
      </div>
    </form>
    <p v-if="error" style="color:crimson">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login, isAuthenticated, validateToken } from '../composables/use-auth'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const error = ref<string | null>(null)
    const router = useRouter()
    const route = useRoute()

    onMounted(async () => {
      // si déjà connecté, rediriger
      if (isAuthenticated()) {
        const valid = await validateToken()
        if (valid) {
          router.replace((route.query.redirect as string) || '/admin')
        }
      }
    })

    async function onSubmit() {
      error.value = null
      const res = await login(username.value, password.value)
      if (res.ok) {
        router.push((route.query.redirect as string) || '/admin')
      } else {
        error.value = res.error || 'Échec de la connexion'
      }
    }

    return { username, password, error, onSubmit }
  },
}
</script>

<style scoped>
.container { max-width:480px; margin:40px auto }
label { display:block; margin-bottom:4px }
input { width:100%; padding:8px; box-sizing:border-box }
button { padding:8px 12px }
</style>

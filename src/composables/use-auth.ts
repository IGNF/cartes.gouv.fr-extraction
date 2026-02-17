import { ref } from 'vue'

const TOKEN_KEY = 'sso_token'
const user = ref<any>(null)

async function login(username: string, password: string) {
  try {
    const res = await fetch('/sso/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Erreur d\'authentification' }))
      throw new Error(err.message || 'Authentification échouée')
    }

    const data = await res.json()
    if (data?.token) {
      localStorage.setItem(TOKEN_KEY, data.token)
      user.value = data.user || { username }
      return { ok: true }
    }

    throw new Error('Réponse SSO invalide')
  } catch (e) {
    // fallback: si le service SSO n'existe pas en dev, on peut simuler
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      const fakeToken = 'dev-token'
      localStorage.setItem(TOKEN_KEY, fakeToken)
      user.value = { username }
      return { ok: true }
    }
    return { ok: false, error: (e as Error).message }
  }
}

function logout() {
  localStorage.removeItem(TOKEN_KEY)
  user.value = null
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

async function validateToken(): Promise<boolean> {
  const token = getToken()
  if (!token) return false
  try {
    const res = await fetch('/sso/validate', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      logout()
      return false
    }
    const data = await res.json().catch(() => null)
    user.value = data?.user || user.value || null
    return true
  } catch (e) {
    logout()
    return false
  }
}

function isAuthenticated(): boolean {
  return !!getToken()
}

export { login, logout, getToken, validateToken, isAuthenticated, user }

import { defineStore } from 'pinia'
import { shallowRef, ref } from 'vue'
import { getService, useAuth } from 'cartes.gouv.fr-service'

export const useAppStore = defineStore('app', () => {
  const service = shallowRef<ReturnType<typeof getService> | null>(null)

  const isAuthenticated = ref<boolean>(false)

  const user = shallowRef<any | string | null>(null)

  watch(service, (newService) => { 
    if (newService) {
      user.value = newService.user || null;
      isAuthenticated.value = newService.authenticated || false;
    } else {
      user.value = null;
      isAuthenticated.value = false;
    }
  }, { flush: 'pre' })

  return {
    service,
    isAuthenticated,
    user,
  }
})

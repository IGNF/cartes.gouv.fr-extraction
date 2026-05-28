import { defineStore } from 'pinia'
import { shallowRef, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const service = shallowRef<ReturnType<typeof getService> | null>(null)

  const isAuthenticated = ref<boolean>(false)

  const user = shallowRef<any | string | null>(null)

  return {
    service,
    isAuthenticated,
    user,
  }
})

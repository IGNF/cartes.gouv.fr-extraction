import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { getService } from 'cartes.gouv.fr-service'
import { setSettings } from 'cartes.gouv.fr-service'

export const useAppStore = defineStore('app', () => {
  const service = shallowRef<ReturnType<typeof getService> | null>(null)

  function setService(nextService: ReturnType<typeof getService>) {
    service.value = nextService
  }

  watch(service, (newService) => { 
    if (newService) {
      console.log("Service updated:", newService);
    } else {
      console.log("Service is now null");
    }
  })

  return {
    service,
    setService
  }
})

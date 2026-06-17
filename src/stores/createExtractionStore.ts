import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ExtractionRequestBody } from '@/types/extractibles.types'

export const useCreateExtractionStore = defineStore('createExtraction', () => {
  const selectedExtractibleID = ref<string | null>(null)
  const requestBody = ref<ExtractionRequestBody | undefined>(undefined)

  function reset() {
    selectedExtractibleID.value = null
    requestBody.value = undefined
  }

  return { selectedExtractibleID, requestBody, reset }
})

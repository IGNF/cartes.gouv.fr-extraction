import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ExtractionRequestBody } from '@/types/extractibles.types'
import type VectorLayer from 'ol/layer/Vector'

export const useCreateExtractionStore = defineStore('createExtraction', () => {
  const selectedExtractibleID = ref<string | null>(null)
  const requestBody = ref<ExtractionRequestBody | undefined>(undefined)
  const extentLayer = shallowRef<VectorLayer | null>(null)
  const extent = computed(() => {
    if (!extentLayer.value) return null
    const source = extentLayer.value.getSource()
    if (!source) return null
    const sourceExtent = source.getExtent?.()
    if (!sourceExtent) return null
    return sourceExtent
  })

  function setExtentLayer(layer: VectorLayer) {
    extentLayer.value = layer
  }

  function removeExtentLayer() {
    extentLayer.value = null
  }

  function reset() {
    selectedExtractibleID.value = null
    requestBody.value = undefined
    extentLayer.value = null
  }

  return { 
    selectedExtractibleID,
    requestBody,
    extentLayer,
    extent,
    setExtentLayer,
    removeExtentLayer,
    reset
  }
})

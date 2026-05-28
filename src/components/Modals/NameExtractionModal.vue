<script setup lang="ts">
import { DsfrAlert, DsfrInput, DsfrModal } from '@gouvminint/vue-dsfr'
import { isExtractionErrorResponse, useCreateExtraction } from '@/composables/gpfRequests'
import type {
  ExtractionRequestBody,
  createExtractionResponse,
} from '@/types/extractibles.types'
import type { ExtractionErrorResponse } from '@/types/my-extractions.types'

const props = defineProps<{
  request: ExtractionRequestBody | undefined
  processID: string | undefined
}>()

const emit = defineEmits(['success'])

const isCreateModalOpened = ref(false)
const extractionName = ref('')
const response = ref<createExtractionResponse | ExtractionErrorResponse | undefined>(undefined)
const closeAfterSuccess = ref(false)

const extractionError = computed(() => {
  if (isExtractionErrorResponse(response.value)) {
    return response.value
  }
  return undefined
})

function openModal() {
  response.value = undefined
  isCreateModalOpened.value = true
}

function closeModal() {
  isCreateModalOpened.value = false
  if (closeAfterSuccess.value) {
    emit('success')
    closeAfterSuccess.value = false
  }
}

async function validateCreateExtraction() {
  const result = await createExtraction()
  if (result && !isExtractionErrorResponse(result)) {
    closeAfterSuccess.value = true
    closeModal()
  }
}

async function createExtraction() {
  console.log('Création de l\'extraction avec les paramètres suivants :', props.request)
  if (!props.request) {
    console.error('Aucun paramètre d\'extraction défini.')
    return
  }
  if (!props.processID) {
    console.error('Aucun processID défini.')
    return
  }
  response.value = await useCreateExtraction(props.request, props.processID)
  return response.value
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <DsfrModal
    title="Lancer une nouvelle extraction"
    :opened="isCreateModalOpened"
    @close="closeModal"
  >
    <DsfrInput
      label="Nom"
      label-visible
      hint="Choisissez un nom pour votre extraction"
      v-model="extractionName"
    />
    <br>
    <DsfrAlert
      v-if="extractionError"
      type="error"
      :title="extractionError.title || 'Erreur lors du lancement de l\'extraction'"
      :description="extractionError.detail || 'Une erreur est survenue lors du lancement de l\'extraction.'"
    />
    <template #footer>
      <div class="modal-actions">
        <DsfrButton
          secondary
          @click="closeModal"
        >
          Annuler
        </DsfrButton>
        <DsfrButton
          @click="validateCreateExtraction"
        >
          Valider
        </DsfrButton>
      </div>
    </template>
  </DsfrModal>
</template>

<style scoped>
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>

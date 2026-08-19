<script setup lang="ts">
import { DsfrAlert, DsfrInput, DsfrModal } from '@gouvminint/vue-dsfr'
import { isExtractionErrorResponse } from '@/composables/Extractions/Requests/gpfRequests'
import { useCreateExtraction } from '@/composables/Extractions/Requests/useExtraction'
import type {
  ExtractionRequestBody,
  createExtractionResponse,
} from '@/types/extractibles.types'
import type { ExtractionErrorResponse } from '@/types/my-extractions.types'
import type { ModalInterface } from '@/types/UITypes'

const props = defineProps<{
  request: ExtractionRequestBody | undefined
  processID: string | undefined
}>()

const emit = defineEmits<{
  success: [extractionName: string, jobID: string]
}>()

const isCreateModalOpened = ref(false)
const extractionName = ref('')
const response = ref<Error | any>(undefined)
const closeAfterSuccess = ref(false)
const jobID = ref<string>('')

const extractionError = computed(() =>
  response.value instanceof Error ? response.value : undefined
)

function openModal() {
  response.value = undefined
  isCreateModalOpened.value = true
}

function closeModal() {
  isCreateModalOpened.value = false
  if (closeAfterSuccess.value) {
    emit('success', extractionName.value, jobID.value)
    closeAfterSuccess.value = false
  }
}

async function validateCreateExtraction() {
  const result = await useCreateExtraction(props.request, props.processID, extractionName.value)
  response.value = result

  if (result instanceof Error) {
    return
  }

  jobID.value = result.jobID
  closeAfterSuccess.value = true
  closeModal()
}

const modalInterface: ModalInterface = {
  openModal,
  closeModal,
}

defineExpose(modalInterface)
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
      title="Erreur lors du lancement de l'extraction"
      :description="extractionError.message || 'Une erreur est survenue lors du lancement de l\'extraction.'"
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
  width: 100%;
}
</style>

<script setup lang="ts">
import { DsfrInput, DsfrModal } from '@gouvminint/vue-dsfr'
import { useCreateExtraction } from '@/composables/gpfRequests'
import type {
  ExtractionRequestBody,
  createExtractionErrorResponse,
  createExtractionResponse,
} from '@/types/extractibles.types'

const props = defineProps<{
  request: ExtractionRequestBody | undefined
}>()

const isCreateModalOpened = ref(false)
const extractionName = ref('')
const response = ref<createExtractionResponse | createExtractionErrorResponse | undefined>(undefined)

function openModal() {
  isCreateModalOpened.value = true
}

function closeModal() {
  isCreateModalOpened.value = false
}

async function validateCreateExtraction() {
  await createExtraction()
  closeModal()
}

async function createExtraction() {
  console.log('Création de l\'extraction avec les paramètres suivants :', props.request)
  if (!props.request) {
    console.error('Aucun paramètre d\'extraction défini.')
    return
  }
  response.value = await useCreateExtraction(props.request)
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

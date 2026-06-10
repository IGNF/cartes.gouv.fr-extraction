<script setup lang="ts">
import { DsfrModal, DsfrButton } from '@gouvminint/vue-dsfr'
import type { ModalInterface } from '@/types/UITypes'

const props = defineProps<{
  extractionName: string | undefined
}>()

const emit = defineEmits(['delete', 'cancel'])

const isDeleteModalOpened = ref(false)

function openModal() {
  isDeleteModalOpened.value = true
}

function closeModal() {
  isDeleteModalOpened.value = false
  emit('cancel')
}

function confirmDelete() {
    emit('delete')
}

const modalInterface: ModalInterface = {
  openModal,
  closeModal,
}

defineExpose(modalInterface)
</script>

<template>
  <DsfrModal
    title="Confirmer la suppression"
    :opened="isDeleteModalOpened"
    @close="closeModal"
  >
    <p>Êtes-vous sûre de vouloir supprimer <strong>{{ extractionName }}</strong> ?</p>
    <template #footer>
      <div class="modal-actions">
        <DsfrButton
          secondary
          @click="closeModal"
        >
          Annuler
        </DsfrButton>
        <DsfrButton
          @click="confirmDelete"
        >
          Supprimer
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

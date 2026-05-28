<script setup lang="ts">
import { DsfrModal } from '@gouvminint/vue-dsfr'

const isSuccessModalOpened = ref(false)

function openModal() {
  isSuccessModalOpened.value = true
}

function closeModal() {
  isSuccessModalOpened.value = false
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <DsfrModal
    title="Extraction lancée"
    :opened="isSuccessModalOpened"
    @close="closeModal"
  >
    <p>
      Votre extraction de données a été lancée avec succès. Vous pouvez suivre son avancement depuis l’espace
      <RouterLink
        to="/myextractions"
        class="fr-link"
      >
        Mes extractions
      </RouterLink>
    </p>

    <hr>

    <p>
      Vous recevrez un courriel une fois l’extraction terminée à l’adresse associée à votre compte.
    </p>
  </DsfrModal>
</template>
<script setup lang="ts">
import { DsfrModal } from '@gouvminint/vue-dsfr'
import svgSuccess from '@gouvfr/dsfr/dist/artwork/pictograms/system/success.svg'
import type { ModalInterface } from '@/types/UITypes'
const isSuccessModalOpened = ref(false)

function openModal() {
  isSuccessModalOpened.value = true
}

function closeModal() {
  isSuccessModalOpened.value = false
}

const modalInterface: ModalInterface = {
  openModal,
  closeModal,
}

defineExpose(modalInterface)
</script>

<template>
  <DsfrModal
    title="Extraction lancée"
    :opened="isSuccessModalOpened"
    @close="closeModal"
  >
  <div class="icon">
    <img :src="svgSuccess" alt="Success" />
  </div>
    <p class="fr-mb-2w">
      Votre extraction de données a été lancée avec succès. Vous pouvez suivre son avancement depuis l’espace
      <RouterLink
        to="/myextractions"
        class="fr-link"
      >
        Mes extractions
      </RouterLink>
    </p>

    <hr>

    <p class="fr-mb-2w">
      Vous recevrez un courriel une fois l’extraction terminée à l’adresse associée à votre compte.
    </p>
  </DsfrModal>
</template>
<style scoped>
.icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

p {
  text-align: center;
}
</style>
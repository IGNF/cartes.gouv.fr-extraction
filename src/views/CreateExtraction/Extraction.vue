<script setup lang="ts">
import { DsfrStepper } from '@gouvminint/vue-dsfr';
import ChooseExtraction from './ChooseExtraction.vue';
import ChooseArea from './ChooseArea.vue';
import { useDataStore } from '@/stores/dataStoreExtraction'


const dataStore = useDataStore()
const { getExtractible } = dataStore;
const extractibles = computed(() => getExtractible())

onMounted(() => {
  console.log('Extraction view mounted');
});
const currentStep = ref(1)

</script>
<template>
  <div class="fr-container">
    <h1>Créer une nouvelle extraction</h1>
    <DsfrStepper
      :steps="[
        'Sélectionner une zone',
        'Choisir une source de données',
        'Affiner l\'extraction'
      ]"
      :current-step="currentStep"
    />
    <div class="fr-grid-row">
      <ChooseArea v-if="currentStep === 1" :extractibles="extractibles"/>
      <ChooseExtraction v-if="currentStep === 2"  :extractibles="extractibles"/>
      <ChooseExtraction v-if="currentStep === 3" />
    </div>
    <div class="fr-grid-row nav-row">
        <DsfrButton secondary @click="currentStep--" :disabled="currentStep <= 1">Précédent</DsfrButton>
        <DsfrButton @click="currentStep++" :disabled="currentStep >= 3">Suivant</DsfrButton>
    </div>
  </div>
</template>
<style scoped> 
.nav-row {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}
</style>
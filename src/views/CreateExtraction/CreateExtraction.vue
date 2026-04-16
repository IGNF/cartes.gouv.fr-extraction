<script setup lang="ts">
import { DsfrStepper } from '@gouvminint/vue-dsfr';
import ChooseExtractible from './ChooseExtractible.vue';
import ChooseArea from './ChooseArea.vue';
import { useDataStore } from '@/stores/dataStoreExtraction'
import ChooseSqlParams from './ChooseSqlParams.vue';
import type { Extractible } from '@/types/extractibles.types';


const dataStore = useDataStore()
const { getExtractible } = dataStore;
const extractibles = computed(() => getExtractible())

onMounted(() => {
  console.log('Extraction view mounted');
});

const currentStep = ref(1)
watch(currentStep, (newStep) => {
  if (newStep === 3 && !selectedExtractible.value) {
    // currentStep.value = 2; // Retourner à l'étape précédente si aucune extraction n'est sélectionnée
    alert('Veuillez sélectionner une extraction avant de continuer.');
  }
})

const selectedExtractible = ref<Extractible | null>(null)
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
      <ChooseArea v-show="currentStep === 1"/>
      <ChooseExtractible 
        v-show="currentStep === 2"  
        :extractibles="extractibles" 
        v-model="selectedExtractible"/>
      <ChooseSqlParams 
      v-show="currentStep === 3" 
      :extractible="selectedExtractible" 
      />
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
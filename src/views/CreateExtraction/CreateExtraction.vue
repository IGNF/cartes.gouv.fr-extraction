<script setup lang="ts">
import { DsfrStepper } from '@gouvminint/vue-dsfr';
import ChooseExtractible from './ChooseExtractible.vue';
import ChooseArea from './ChooseArea.vue';
import { useDataStore } from '@/stores/dataStoreExtraction'
import ChooseSqlParams from './ChooseSqlParams.vue';
import type { Extractible, ExtractionRequestBody } from '@/types/extractibles.types';
import { useCreateExtraction } from '@/composables/gpfRequests';


const dataStore = useDataStore()
const { getExtractible } = dataStore;
const extractibles = computed(() => getExtractible())

const currentStep = ref(1)
watch(currentStep, (newStep) => {
  if (newStep === 3 && !selectedExtractible.value) {
    currentStep.value = 2; // Retourner à l'étape précédente si aucune extraction n'est sélectionnée
    alert('Veuillez sélectionner une extraction avant de continuer.');
  }
})

const selectedExtractible = ref<Extractible | null>(null)
const request = ref<ExtractionRequestBody | undefined>(undefined)
const response= ref<createExtractionResponse | createExtractionErrorResponse | undefined>(undefined)
function createExtraction() {
    console.log('Création de l\'extraction avec les paramètres suivants :', request.value);
    if (!request.value) {
        console.error('Aucun paramètre d\'extraction défini.');
        return;
    }
    response.value = useCreateExtraction(request.value);
}
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
        v-model:selectedExtractible="selectedExtractible"/>
      <ChooseSqlParams 
      v-show="currentStep === 3" 
      :extractible="selectedExtractible" 
      v-model="request"/>
    </div>
        <!-- {{ request }} -->
    <div class="fr-grid-row nav-row">
        <!-- Bouton Précédent -->
        <DsfrButton 
          secondary 
          @click="currentStep--" 
          :disabled="currentStep <= 1">
          Précédent
        </DsfrButton>
        <!-- Les boutons Suivant -->
        <DsfrButton 
          v-show="currentStep < 3"
          @click="currentStep++" 
          :disabled="currentStep == 2 && !selectedExtractible">
          Suivant
        </DsfrButton>
        <DsfrButton 
          v-show="currentStep === 3"
          :disabled="!request?.inputs?.relations || Object.keys(request.inputs.relations).length === 0"
          @click="createExtraction">
          Lancer l'extraction
        </DsfrButton>
    </div>
    <!-- {{ response }} -->
  </div>
</template>
<style scoped> 
.nav-row {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}
</style>
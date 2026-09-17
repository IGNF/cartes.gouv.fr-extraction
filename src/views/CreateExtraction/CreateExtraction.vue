<script setup lang="ts">
import { DsfrStepper } from '@gouvminint/vue-dsfr';
import ChooseExtractible from './ChooseExtractible.vue';
import ChooseArea from './ChooseArea.vue';
import { useDataStore } from '@/stores/dataStoreExtraction'
import ChooseSqlParams from './ChooseSqlParams.vue';
import type { Extractible, ExtractionRequestBody } from '@/types/extractibles.types';
import NameExtractionModal from '@/components/Modals/NameExtractionModal.vue';
import SuccessModal from '@/components/Modals/SuccessModal.vue';
import { onMounted } from 'vue'
import { useCreateExtractionStore } from '@/stores/createExtractionStore'
import { filterExtractiblesByLayerIntersection } from '@/composables/layerUtils'
import ChooseSqlParams_v1 from './ChooseSqlParams_v1.vue';

const dataStore = useDataStore()
const { getExtractible } = dataStore;
const createExtractionStore = useCreateExtractionStore()

const extractibles = computed(() => {
  return filterExtractiblesByLayerIntersection(
    getExtractible(),
    createExtractionStore.extentLayer,
  )
})

const currentStep = ref(1)
watch(currentStep, (newStep) => {
  if (newStep === 3 && !selectedExtractible.value) {
    currentStep.value = 2; // Retourner à l'étape précédente si aucune extraction n'est sélectionnée
    alert('Veuillez sélectionner une extraction avant de continuer.');
  }
})

const selectedExtractible = ref<Extractible | null>(null)
const request = ref<ExtractionRequestBody | undefined>(undefined)
const nameExtractionModalRef = ref<InstanceType<typeof NameExtractionModal> | null>(null)
const successModalRef = ref<InstanceType<typeof SuccessModal> | null>(null)

onBeforeMount(() => {
  if (createExtractionStore.selectedExtractibleID !== null || createExtractionStore.requestBody !== undefined) {
    const match = extractibles.value.find(
      (e) => e.processID === createExtractionStore.selectedExtractibleID
    )
    if (match) selectedExtractible.value = match
    if (createExtractionStore.requestBody !== undefined) {
      request.value = createExtractionStore.requestBody
    }
    console.log('Restoring state from store:', {
      selectedExtractible: selectedExtractible.value,
      request: request.value,
    } )
    currentStep.value = 3
    createExtractionStore.reset()
    createExtractionStore.setExtentLayerFromRequestBody(request.value)
  }
})

function handleExtractionSuccess() {
  successModalRef.value?.openModal()
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
      <ChooseSqlParams_v1 
      v-show="currentStep === 3" 
      :extractible="selectedExtractible" 
      v-model="request"/>
    </div>
        {{ request }}
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
          @click="nameExtractionModalRef?.openModal()">
          Lancer l'extraction
        </DsfrButton>
    </div>
    <NameExtractionModal
      ref="nameExtractionModalRef"
      :request="request"  
      :processID="selectedExtractible?.processID"
      @success="handleExtractionSuccess"
    />
    <SuccessModal ref="successModalRef" />
  </div>
</template>
<style scoped> 
.nav-row {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}
</style>
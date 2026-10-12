<script setup lang="ts">
import { downloadAllItemsAsZip, getResultDownloadList, useGetExtractionResults, useGetJobByID, useGetJobInputs } from '@/composables/Extractions/Requests/gpfRequests'
import { useDeleteExtraction, useRelaunchExtraction, useRelaunchExtractionWithNewParams } from '@/composables/Extractions/Requests/useExtraction'
import type { Extraction } from '@/types/my-extractions.types'
import type { ExtractionRequestBody } from '@/types/extractibles.types'
import type { RelaunchAction } from '@/types/UITypes'
import ExtractionList from '@/components/ExtractionList.vue'
import DeleteModal from '@/components/Modals/DeleteModal.vue'
import RelaunchModal from '@/components/Modals/RelaunchModal.vue'
import { useRouter } from 'vue-router'

const deleteModalRef = ref<InstanceType<typeof DeleteModal>>()
const relaunchModalRef = ref<InstanceType<typeof RelaunchModal>>()
const selectedExtraction = ref<Extraction | undefined>()
const router = useRouter()

async function onDownloadExtraction(extraction: Extraction) {
  try {
    const jobResult = await useGetExtractionResults(extraction.jobID)
    const downloadItems = await getResultDownloadList(jobResult)
    await downloadAllItemsAsZip(downloadItems, `extraction-${extraction.name}.zip`)
  } catch (error) {
    console.error('Erreur lors du téléchargement des données :', error)
  }
}

function onDeleteExtraction(extraction: Extraction) {
  selectedExtraction.value = extraction
  deleteModalRef.value?.openModal()
}

async function onConfirmDelete() {
   if (!selectedExtraction.value) {
    console.error('Aucune extraction sélectionnée pour la suppression.')
    return
  }
  try {
    const result = await useDeleteExtraction(selectedExtraction.value.jobID, selectedExtraction.value.status)
    if (result instanceof Error) throw result
    deleteModalRef.value?.closeModal()
  } catch (error) {
    console.error('Erreur lors de la suppression :', error)
  }
}

function onRelaunchExtraction(extraction: Extraction) {
  selectedExtraction.value = extraction
  relaunchModalRef.value?.openModal()
}

async function onConfirmRelaunchExtraction(action: RelaunchAction) {
  if (!selectedExtraction.value) {
    console.error('Aucune extraction sélectionnée pour la relance.')
    return
  }
  const extraction = selectedExtraction.value
  let currentJob: Awaited<ReturnType<typeof useGetJobByID>>
  let params: ExtractionRequestBody
  try {
    currentJob = await useGetJobByID(extraction.jobID)
    // useGetJobInputs ne renvoie que les inputs : on reconstitue le corps de requête complet.
    params = {
      inputs: await useGetJobInputs(currentJob.jobID),
      outputs: {
        logs: {},
        summary: {},
        extractedData: {},
      },
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des paramètres du job ${extraction.jobID} :`, error)
    return
  }

  if (action === 'replace') {
    console.log(`Relancer l'extraction ${selectedExtraction.value} en mode remplacement`)
    try {
      const result = await useRelaunchExtraction(params, currentJob.jobID, currentJob.processID, selectedExtraction.value.name, currentJob.status)
      if (result instanceof Error) throw result
    } catch (error) {
      console.error('Erreur lors de la relance de l’extraction :', error)
      return
    }
  } else if (action === 'duplicate') {
    console.log(`Relancer l'extraction ${selectedExtraction.value} en mode duplication`)
    useRelaunchExtractionWithNewParams(params, currentJob.processID)
    router.push('/new-extraction')
  }
  relaunchModalRef.value?.closeModal()
}

</script>
<template>
    <div class="fr-container">
        <ExtractionList
            @download="onDownloadExtraction"
            @delete="onDeleteExtraction"
            @relaunch="onRelaunchExtraction" />
        <DeleteModal
            ref="deleteModalRef"
            :extraction-name="selectedExtraction?.name"
            @delete="onConfirmDelete" />
        <RelaunchModal
            ref="relaunchModalRef"
            @relaunchExtraction="onConfirmRelaunchExtraction" />
    </div>
</template>
<style scoped> 
</style>
<script setup lang="ts">
import { downloadAllItemsAsZip, getResultDownloadList, useGetExtractionResults, useGetJobs, useDeleteExtraction } from '@/composables/gpfRequests'
import type { ExtractionJob, Extraction } from '@/types/my-extractions.types'
import type { RelaunchAction } from '@/types/UITypes'

const jobs = ref<ExtractionJob[]>([])
const deleteModalRef = ref<InstanceType<typeof DeleteModal>>()
const relaunchModalRef = ref<InstanceType<typeof RelaunchModal>>()
const selectedExtraction = ref<Extraction | undefined>()

async function fetchJobs() {
  try {
    jobs.value = await useGetJobs()
  } catch (error) {
    console.error('Erreur lors de la récupération des jobs :', error)
  }
}

onMounted(async () => {
  await fetchJobs()
})

const extractionList = computed<Extraction[]>(() => {
  return jobs.value.map((job: ExtractionJob) => ({
    status: job.status,
    name: job.jobID,
    url: `https://data.geopf.fr/extraction${job.links?.[0]?.href || ''}`,
    updated: new Date(job.updated)
  }))
})

async function onDownloadExtraction(extraction: Extraction) {
  try {
    const jobResult = await useGetExtractionResults(extraction.name)
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
   if (!selectedExtraction.value.name) {
    console.error('L\'extraction sélectionnée n\'a pas de nom défini.')
    return
  }
  if (!selectedExtraction.value.name) {
    console.error('Aucun jobID défini.')
    return
  }
  try {
    await useDeleteExtraction(selectedExtraction.value.name)
    await fetchJobs() // Rafraîchir la liste des jobs après la suppression
    deleteModalRef.value?.closeModal()
  } catch (error) {
    console.error('Erreur lors de la suppression :', error)
  }
}

function onRelaunchExtraction(extraction: Extraction) {
  selectedExtraction.value = extraction
  relaunchModalRef.value?.openModal()
}

function onConfirmRelaunchExtraction(action: RelaunchAction) {
  if (!selectedExtraction.value) {
    console.error('Aucune extraction sélectionnée pour la relance.')
    return
  }
  if (action === 'replace') {
    console.log(`Relancer l'extraction ${selectedExtraction.value} en mode remplacement`)
    console.log(selectedExtraction.value)
  } else if (action === 'duplicate') {
    console.log(`Relancer l'extraction ${selectedExtraction.value} en mode duplication`)
    // Appeler la fonction de relance en mode duplication ici
  }
  relaunchModalRef.value?.closeModal()
}

</script>
<template>
    <div class="fr-container">
        <ExtractionList 
            :extractions="extractionList"
            @download="onDownloadExtraction"
            @delete="onDeleteExtraction"
            @relaunch="onRelaunchExtraction" />
        <DeleteModal
            ref="deleteModalRef"
            :extraction-name="selectedExtraction?.name"
            :job-id="selectedExtraction?.name"
            @delete="onConfirmDelete" />
        <RelaunchModal
            ref="relaunchModalRef"
            @relaunchExtraction="onConfirmRelaunchExtraction" />
    </div>
</template>
<style scoped> 
</style>
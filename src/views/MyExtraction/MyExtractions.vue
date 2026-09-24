<script setup lang="ts">
import { downloadAllItemsAsZip, getResultDownloadList, useGetExtractionResults, useGetJobByID } from '@/composables/Extractions/Requests/gpfRequests'
import { useGetHistoricDocumentList } from '@/composables/Extractions/Requests/historicRequests'
import { useDeleteExtraction, useRelaunchExtraction, useRelaunchExtractionWithNewParams } from '@/composables/Extractions/Requests/useExtraction'
import type { ExtractionJob, Extraction } from '@/types/my-extractions.types'
import type { HistoricContentWithDocumentID } from '@/types/historique.types'
import type { RelaunchAction } from '@/types/UITypes'
import { useRouter } from 'vue-router'

type EnrichedExtractionJob = HistoricContentWithDocumentID & ExtractionJob
const jobs = ref<EnrichedExtractionJob[]>([])
const deleteModalRef = ref<InstanceType<typeof DeleteModal>>()
const relaunchModalRef = ref<InstanceType<typeof RelaunchModal>>()
const selectedExtraction = ref<Extraction | undefined>()
const router = useRouter()

async function fetchJobs() {
  try {
    const historicDocuments = await useGetHistoricDocumentList()

    jobs.value = (
      await Promise.all(
        historicDocuments.map(async (document) => {
          try {
            const job = await useGetJobByID(document.jobID)

            return {
              ...job,
              ...document,
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération du job pour le document ${document._id} :`, error)
            return null
          }
        })
      )
    ).filter((job): job is EnrichedExtractionJob => job !== null)
  } catch (error) {
    console.error('Erreur lors de la récupération des jobs :', error)
  }
}

onMounted(async () => {
  await fetchJobs()
})

const extractionList = computed<Extraction[]>(() => {
  return jobs.value.map((job) => ({
    status: job.status,
    name: job.jobName?.trim() || "Extraction sans nom : " + job.jobID,
    jobID: job.jobID,
    params: job.params,
    message: job.message || '',
    url: `https://data.geopf.fr/extraction${job.links?.[0]?.href || ''}`,
    updated: new Date(job.updated)
  }))
})

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
    await useDeleteExtraction(selectedExtraction.value.jobID, jobs.value.find(job => job.jobID === selectedExtraction.value?.jobID)?.documentID || '')
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

async function onConfirmRelaunchExtraction(action: RelaunchAction) {
  if (!selectedExtraction.value) {
    console.error('Aucune extraction sélectionnée pour la relance.')
    return
  }
  let currentJob = jobs.value.find(job => job.jobID === selectedExtraction.value?.jobID)
  if (!currentJob) {
    console.error('Job actuel introuvable pour la relance.')
    return
  }
  if (action === 'replace') {
    console.log(`Relancer l'extraction ${selectedExtraction.value} en mode remplacement`)
    await useRelaunchExtraction(currentJob.params, selectedExtraction.value.jobID, currentJob.documentID, currentJob.uuidStoredData, currentJob.name, currentJob.status)
    await fetchJobs() // Rafraîchir la liste des jobs après la suppression
  } else if (action === 'duplicate') {
    console.log(`Relancer l'extraction ${selectedExtraction.value} en mode duplication`)
    useRelaunchExtractionWithNewParams(currentJob.params, currentJob.processID)
    router.push('/new-extraction')
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
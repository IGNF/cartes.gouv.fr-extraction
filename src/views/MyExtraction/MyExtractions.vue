<script setup lang="ts">
import { downloadAllItemsAsZip, getResultDownloadList, useDeleteExtraction, useGetExtractionResults, useGetJobs } from '@/composables/gpfRequests'
import type { ExtractionJob, Extraction } from '@/types/my-extractions.types'

const jobs = ref<ExtractionJob[]>([])

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

async function onDeleteExtraction(extraction: Extraction) {
  try {
    await useDeleteExtraction(extraction.name)
    await fetchJobs()
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'extraction :', error)
  }
}

</script>
<template>
    <div class="fr-container">
        <ExtractionList 
            :extractions="extractionList"
            @download="onDownloadExtraction"
            @delete="onDeleteExtraction" />
    </div>
</template>
<style scoped> 
</style>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useGetJobByID } from '@/composables/Extractions/Requests/gpfRequests'
import { useGetHistoricDocumentList } from '@/composables/Extractions/Requests/historicRequests'
import { useStartNewExtraction } from '@/composables/Extractions/Requests/useExtraction'
import { useNormalizeString } from '@/composables/utils'
import type { HistoricContentWithDocumentID } from '@/types/historique.types'
import type { ExtractionJob, ExtractionWithHistory } from '@/types/my-extractions.types'
import ExtractionListElementWithHistory from './ExtractionListElementWithHistory.vue'
import Patience from './utils/Patience.vue'

type EnrichedExtractionJob = HistoricContentWithDocumentID & ExtractionJob

const emit = defineEmits<{
    (e: 'download', extraction: ExtractionWithHistory): void
    (e: 'delete', extraction: ExtractionWithHistory): void
    (e: 'relaunch', extraction: ExtractionWithHistory): void
}>()

const searchValue = ref('')
const jobs = ref<EnrichedExtractionJob[]>([])
const limit = 4
const visibleCount = ref(limit)
const isLoading = ref(false)
const errorMessage = ref('')
const startNewExtraction = useStartNewExtraction()

async function fetchJobs() {
    if (isLoading.value) return
    isLoading.value = true
    errorMessage.value = ''

    try {
        const historicDocuments = await useGetHistoricDocumentList()
        const enrichedJobs = await Promise.all(
            historicDocuments.map(async (document): Promise<EnrichedExtractionJob | null> => {
                try {
                    const job = await useGetJobByID(document.jobID)
                    return { ...job, ...document }
                } catch (error) {
                    console.error(`Erreur lors de la récupération du job pour le document ${document.documentID} :`, error)
                    return null
                }
            }),
        )

        jobs.value = enrichedJobs.filter((job): job is EnrichedExtractionJob => job !== null)
            .sort((a, b) => {
                const priority = (status: string) => status === 'running' ? 0 : status === 'successful' ? 1 : 2
                const priorityDifference = priority(a.status) - priority(b.status)
                if (priorityDifference !== 0) return priorityDifference

                return new Date(b.updated).getTime() - new Date(a.updated).getTime()
            })
        visibleCount.value = Math.max(limit, jobs.value.filter(job => job.status === 'running').length)
    } catch (error) {
        errorMessage.value = 'Impossible de récupérer les extractions depuis l’historique.'
        console.error('Erreur lors de la récupération des jobs :', error)
    } finally {
        isLoading.value = false
    }
}

const filteredExtractions = computed<ExtractionWithHistory[]>(() => {
    const query = useNormalizeString(searchValue.value)
    const extractions = jobs.value.map(job => ({
        status: job.status,
        name: job.name?.trim() || job.jobName?.trim() || `Extraction sans nom : ${job.jobID}`,
        jobID: job.jobID,
        documentID: job.documentID,
        params: job.params,
        uuidStoredData: job.uuidStoredData,
        message: job.message || '',
        url: `https://data.geopf.fr/extraction${job.links?.[0]?.href || ''}`,
        updated: new Date(job.updated),
    }))

    return query
        ? extractions.filter(extraction => useNormalizeString(extraction.name).includes(query))
        : extractions
})

const visibleExtractions = computed(() => filteredExtractions.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredExtractions.value.length)

watch(searchValue, () => {
    visibleCount.value = Math.max(limit, jobs.value.filter(job => job.status === 'running').length)
})

onMounted(() => {
    void fetchJobs()
})

defineExpose({ refresh: fetchJobs })
</script>

<template>
    <div class="fr-grid-row fr-mb-10v w-100">
        <div class="fr-grid-row">
            <h2 class="fr-mr-2v">Extractions</h2><span class="fr-badge">{{ jobs.length }}</span>
        </div>
        <DsfrButton class="fr-ml-auto" icon="fr-icon-add-line" icon-right @click="startNewExtraction">
            Créer une extraction
        </DsfrButton>
    </div>
    <DsfrSearchBar v-model="searchValue" class="mw-50 fr-mb-20v" placeholder="Rechercher" />
    <DsfrAlert v-if="errorMessage" type="error" title="Erreur de chargement" :description="errorMessage" />
    <Patience v-if="isLoading" />
    <template v-else>
        <ExtractionListElementWithHistory
            v-for="extraction in visibleExtractions"
            :key="extraction.documentID"
            :extraction="extraction"
            @download="emit('download', $event)"
            @delete="emit('delete', $event)"
            @relaunch="emit('relaunch', $event)"
        />
        <div v-if="hasMore" class="fr-grid-row fr-grid-row--center">
            <DsfrButton
                label="Charger plus d'extractions"
                icon="fr-icon-add-line"
                secondary
                :disabled="isLoading"
                @click="visibleCount += limit"
            />
        </div>
    </template>
</template>

<style scoped>
h2 {
    margin: 0;
}

.mw-50 {
    max-width: 50%;
}
</style>
<script setup lang="ts">
import { useGetJobs } from '@/composables/Extractions/Requests/gpfRequests';
import { useRouter } from 'vue-router';
import { useNormalizeString } from '@/composables/utils';
import type { Extraction, ExtractionJob } from '@/types/my-extractions.types';
import ExtractionListElement from './ExtractionListElement.vue';
import { useStartNewExtraction } from '@/composables/Extractions/Requests/useExtraction.js';

const router = useRouter();

const emit = defineEmits<{
    (e: 'download', extraction: Extraction): void
    (e: 'delete', extraction: Extraction): void
    (e: 'relaunch', extraction: Extraction): void
}>()

const searchValue = ref<string>('')
const jobs = ref<ExtractionJob[]>([])
const page = ref(1)
const limit = 4
const isLoading = ref(false)
const hasMore = ref(true)
const isFirstPage = ref(true)
const pendingJobs = ref<ExtractionJob[]>([])
const reachedEnd = ref(false)

const startNewExtraction = useStartNewExtraction();

async function fetchJobs() {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    try {
        if (isFirstPage.value) {
            const runningJobs = await useGetJobs({ statuses: ['RUNNING'] })
            const firstPageLimit = Math.max(0, limit - runningJobs.length)
            const firstPageJobs = firstPageLimit > 0
                ? await useGetJobs({ page: 1, limit: firstPageLimit, statuses: ['SUCCESSFUL', 'FAILED', 'DISMISSED'] })
                : []
            const existingIDs = new Set<string>()
            jobs.value = [...runningJobs, ...firstPageJobs].filter(job => {
                if (existingIDs.has(job.jobID)) return false
                existingIDs.add(job.jobID)
                return true
            })
            // Relire la page 1 avec limit=4 au prochain clic : la première requête
            // a pu utiliser une limite plus petite pour faire place aux jobs en cours.
            reachedEnd.value = firstPageLimit > 0 && firstPageJobs.length < firstPageLimit
            hasMore.value = !reachedEnd.value
            isFirstPage.value = false
            return
        }

        // Garder les jobs récupérés en avance mais pas encore affichés.
        const queued = [...pendingJobs.value]
        const existingIDs = new Set([...jobs.value, ...queued].map(job => job.jobID))
        let nextPage = page.value
        let end = reachedEnd.value

        // Plusieurs pages API peuvent être nécessaires pour obtenir quatre nouveaux jobs
        // après dédoublonnage avec la première page et les résultats déjà affichés.
        while (queued.length < limit && !end) {
            const newJobs = await useGetJobs({ page: nextPage, limit, statuses: ['SUCCESSFUL', 'FAILED', 'DISMISSED'] })
            nextPage++
            for (const job of newJobs) {
                if (!existingIDs.has(job.jobID)) {
                    existingIDs.add(job.jobID)
                    queued.push(job)
                }
            }
            end = newJobs.length < limit
        }

        jobs.value = [...jobs.value, ...queued.slice(0, limit)]
        pendingJobs.value = queued.slice(limit)
        page.value = nextPage
        reachedEnd.value = end
        hasMore.value = !end || pendingJobs.value.length > 0
    } catch (error) {
        console.error('Erreur lors de la récupération des jobs :', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    void fetchJobs()
})

const filteredExtractions = computed(() => {
    const query = useNormalizeString(searchValue.value)
    const extractions: Extraction[] = jobs.value.map(job => ({
        status: job.status,
        name: job.jobName?.trim() || `Extraction sans nom : ${job.jobID}`,
        jobID: job.jobID,
        message: job.message || '',
        url: `https://data.geopf.fr/extraction${job.links?.[0]?.href || ''}`,
        updated: new Date(job.updated),
    }))

    return query
        ? extractions.filter(extraction => useNormalizeString(extraction.name).includes(query))
        : extractions
})

</script>
<template>
    <div class="fr-grid-row fr-mb-10v w-100">
        <div class="fr-grid-row">
            <h2 class="fr-mr-2v">Extractions</h2><span class="fr-badge">{{ jobs.length }}</span>
        </div>
        <DsfrButton
            class="fr-ml-auto"
            icon="fr-icon-add-line"
            icon-right
            @click="startNewExtraction"
        >
            Créer une extraction
        </DsfrButton>
    </div>
    <DsfrSearchBar
        class="mw-50 fr-mb-20v"
        placeholder="Rechercher"
        v-model="searchValue"
    />  
    <ExtractionListElement
        v-for="extraction in filteredExtractions"
        :key="extraction.jobID"
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
            @click="fetchJobs"
        />
    </div>
</template>

<style scoped>
h2 {
    margin: 0;
}

.mw-50{
    max-width: 50%;
}

</style>
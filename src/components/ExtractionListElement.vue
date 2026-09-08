<script setup lang="ts">
import { useGetJobInputs } from '@/composables/Extractions/Requests/gpfRequests'
import type { ExtractionRequestBody } from '@/types/extractibles.types'
import type { Extraction } from '@/types/my-extractions.types';
import { DsfrAccordion, DsfrAccordionsGroup } from '@gouvminint/vue-dsfr'

const props = defineProps<{
    extraction: Extraction
}>()

const emit = defineEmits<{
    (e: 'download', extraction: Extraction): void
    (e: 'delete', extraction: Extraction): void
    (e: 'relaunch', extraction: Extraction): void
}>()

const activeDebugAccordion = ref(-1)
const jobInputs = ref<ExtractionRequestBody | null>(null)
const isLoadingJobInputs = ref(false)
const jobInputsError = ref<string | null>(null)

const formattedDate = computed(() =>
    new Date(props.extraction.updated).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
)

function statusLinter(status: string) {
    var ret = ''
    switch (status) {
        case 'successful':
            ret = 'Prête'
            break;
        case 'failed':
            ret = 'En erreur'
            break;
        case 'running':
            ret = 'En cours'
            break;
        case 'dismissed':
            if (props.extraction.message == "Données extraites supprimées" ) {
                ret = 'Expirée'
            } else
            ret = 'Annulée'
            break;
        default:
            ret = status
            break;
    }
    return ret.toUpperCase()
}

async function loadJobInputs(accordionIndex: number) {
    if (accordionIndex !== 0 || jobInputs.value || isLoadingJobInputs.value) return

    isLoadingJobInputs.value = true
    jobInputsError.value = null

    try {
        jobInputs.value = await useGetJobInputs(props.extraction.jobID)
    } catch (error: unknown) {
        jobInputsError.value = error instanceof Error
            ? error.message
            : 'Impossible de récupérer les paramètres du job.'
    } finally {
        isLoadingJobInputs.value = false
    }
}

</script>
<template>
    <div class="fr-container execution-card  execution-card fr-mb-10v w-100 fr-p-10v">
        <div class="row">
            <div class="status fr-text--sm" :data-status="extraction.status">{{ statusLinter(extraction.status) }}</div>
            <DsfrButton
                secondary
                :disabled="extraction.status == 'dismissed'"
                @click="emit('delete', extraction)"
            >
                <span class="fr-icon-delete-bin-line fr-ml-auto"></span>
            </DsfrButton>
        </div>
        <h4 class="fr-mt-4v">{{ extraction.name }}</h4>
        <div class="row">
            <div>
                <p v-if="extraction.updated && statusLinter(extraction.status) === 'EXPIRÉE'">Expirée le {{ formattedDate }}</p>
                <p v-else>Dernier lancement le {{ formattedDate }}</p>
            </div>
            <div class="row">
                <DsfrButton
                    :disabled="extraction.status != 'successful'"
                    @click="emit('download', extraction)"
                >
                    Télécharger les données
                </DsfrButton>
                <DsfrButton
                    secondary
                    @click="emit('relaunch', extraction)"
                >
                    Relancer l'extraction
                </DsfrButton>
            </div>
        </div>
        <DsfrAccordionsGroup
            v-model="activeDebugAccordion"
            @update:model-value="loadJobInputs"
        >
            <DsfrAccordion title="Debug : paramètres de l'extraction">
                <p v-if="isLoadingJobInputs">Chargement des paramètres...</p>
                <p v-else-if="jobInputsError" class="fr-message fr-message--error">
                    {{ jobInputsError }}
                </p>
                <pre v-else-if="jobInputs">{{ JSON.stringify(jobInputs, null, 2) }}</pre>
            </DsfrAccordion>
        </DsfrAccordionsGroup>
    </div>
</template>

<style scoped>
.execution-card {
    border : 1px solid var(--border-default-grey);
}

h4 {
    color: var(--text-action-high-blue-france);
}
.status {
    padding: 0rem 0.3rem;
    border-radius: 4px;
    font-weight: 500;
    text-align: center;
    width: fit-content;
}
.status[data-status="successful"] {
    background-color: var(--light-options-illustration-color-950-default-green-bourgeon-950, #C9FCAC);
    color: var(--text-default-green-bourgeon-sun-425, #447049);
}
.status[data-status="failed"]     { 
    background-color: var(--light-options-illustration-color-950-default-orange-terre-battue-950, #FEE9E5);
    color: var(--text-default-orange-terre-battue-sun-370, #755348);
}
.status[data-status="running"]    {
    background-color: var(--light-options-illustration-color-950-default-yellow-tournesol-950, #FEECC2);
    color: var(--text-default-yellow-tournesol-sun-407, #716043);
}
.status[data-status="dismissed"]  {
    background-color: var(--light-options-illustration-color-950-default-beige-gris-galet-950, #F3EDE5);
    color: var(--text-default-beige-gris-galet-sun-407, #6A6156);
}
.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

}

.row p {
    margin: 0;
}

pre {
    max-height: 30rem;
    overflow: auto;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>
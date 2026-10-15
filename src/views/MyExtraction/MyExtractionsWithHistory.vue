<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { downloadAllItemsAsZip, getResultDownloadList, useGetExtractionResults } from '@/composables/Extractions/Requests/gpfRequests'
import { useDeleteExtraction, useRelaunchExtraction, useRelaunchExtractionWithNewParams } from '@/composables/Extractions/Requests/useExtraction'
import type { ExtractionWithHistory } from '@/types/my-extractions.types'
import type { ExtractionRequestBody } from '@/types/extractibles.types'
import type { RelaunchAction } from '@/types/UITypes'
import ExtractionListWithHistory from '@/components/ExtractionListWithHistory.vue'
import DeleteModal from '@/components/Modals/DeleteModal.vue'
import RelaunchModal from '@/components/Modals/RelaunchModal.vue'

const extractionListRef = ref<InstanceType<typeof ExtractionListWithHistory>>()
const deleteModalRef = ref<InstanceType<typeof DeleteModal>>()
const relaunchModalRef = ref<InstanceType<typeof RelaunchModal>>()
const selectedExtraction = ref<ExtractionWithHistory>()
const isProcessing = ref(false)
const errorMessage = ref('')
const router = useRouter()

async function onDownloadExtraction(extraction: ExtractionWithHistory) {
    try {
        const jobResult = await useGetExtractionResults(extraction.jobID)
        const downloadItems = await getResultDownloadList(jobResult)
        await downloadAllItemsAsZip(downloadItems, `extraction-${extraction.name}.zip`)
    } catch (error) {
        console.error('Erreur lors du téléchargement des données :', error)
    }
}

function onDeleteExtraction(extraction: ExtractionWithHistory) {
    if (isProcessing.value) return
    errorMessage.value = ''
    selectedExtraction.value = extraction
    deleteModalRef.value?.openModal()
}

async function onConfirmDelete() {
    if (!selectedExtraction.value || isProcessing.value) return
    const extraction = selectedExtraction.value
    isProcessing.value = true
    errorMessage.value = ''

    try {
        const result = await useDeleteExtraction(extraction.jobID, extraction.documentID, extraction.status)
        if (result instanceof Error) throw result
        deleteModalRef.value?.closeModal()
        selectedExtraction.value = undefined
        await extractionListRef.value?.refresh()
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Erreur lors de la suppression.'
        console.error('Erreur lors de la suppression :', error)
    } finally {
        isProcessing.value = false
    }
}

function onRelaunchExtraction(extraction: ExtractionWithHistory) {
    if (isProcessing.value) return
    errorMessage.value = ''
    selectedExtraction.value = extraction
    relaunchModalRef.value?.openModal()
}

async function onConfirmRelaunchExtraction(action: RelaunchAction) {
    if (!selectedExtraction.value || isProcessing.value) return
    const extraction = selectedExtraction.value
    isProcessing.value = true
    errorMessage.value = ''

    try {
        // Le document conserve le corps complet, y compris les outputs, même après expiration du job.
        const params = JSON.parse(JSON.stringify(extraction.params)) as ExtractionRequestBody
        if (action === 'replace') {
            // Ce composable supprime le job et son historique, puis appelle useCreateExtraction.
            const result = await useRelaunchExtraction(
                params,
                extraction.jobID,
                extraction.uuidStoredData,
                extraction.name,
                extraction.documentID,
                extraction.status,
            )
            if (result instanceof Error) throw result
            await extractionListRef.value?.refresh()
        } else if (action === 'duplicate') {
            useRelaunchExtractionWithNewParams(params, extraction.uuidStoredData)
            await router.push('/new-extraction')
        }
        relaunchModalRef.value?.closeModal()
        selectedExtraction.value = undefined
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Erreur lors de la relance de l’extraction.'
        console.error('Erreur lors de la relance de l’extraction :', error)
    } finally {
        isProcessing.value = false
    }
}
</script>

<template>
    <div class="fr-container" :aria-busy="isProcessing">
        <DsfrAlert v-if="errorMessage" type="error" title="Erreur" :description="errorMessage" />
        <ExtractionListWithHistory
            ref="extractionListRef"
            @download="onDownloadExtraction"
            @delete="onDeleteExtraction"
            @relaunch="onRelaunchExtraction"
        />
        <DeleteModal
            ref="deleteModalRef"
            :extraction-name="selectedExtraction?.name"
            @delete="onConfirmDelete"
        />
        <RelaunchModal ref="relaunchModalRef" @relaunch-extraction="onConfirmRelaunchExtraction" />
    </div>
</template>
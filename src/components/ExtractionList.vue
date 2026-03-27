<script setup lang="ts">
import { useRouter } from 'vue-router';
import ExtractionListElement from './ExtractionListElement.vue';

const router = useRouter();

const props = defineProps<{
    extractions: {
        status: string
        title: string
        url: string
        launch_date: Date
        execution_url: string
    } []
    repositoryId: string
}>()

</script>
<template>
    <div class="fr-grid-row fr-mb-10v w-100">
        <div class="fr-grid-row">
            <h2 class="fr-mr-2v">Extractions</h2><span class="fr-badge">{{ extractions.length }}</span>
        </div>
        <DsfrButton
            class="fr-ml-auto"
            icon="fr-icon-add-line"
            icon-right
            @click="() => router.push('/new-extraction')"
        >
            Créer une extraction
        </DsfrButton>
    </div>
    <DsfrSearchBar
        class="mw-50 fr-mb-20v"
        placeholder="Rechercher"
    />  
    <ExtractionListElement
        v-for="extraction in extractions"
        :key="extraction.title"
        :extraction="extraction"
    />
</template>

<style scoped>
h2 {
    margin: 0;
}

.mw-50{
    max-width: 50%;
}

</style>
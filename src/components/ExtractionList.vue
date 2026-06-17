<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useNormalizeString } from '@/composables/utils';
import type { Extraction } from '@/types/my-extractions.types';
import ExtractionListElement from './ExtractionListElement.vue';

const router = useRouter();

const props = defineProps<{
    extractions: Extraction[]
}>()

const emit = defineEmits<{
    (e: 'download', extraction: Extraction): void
    (e: 'delete', extraction: Extraction): void
    (e: 'relaunch', extraction: Extraction): void
}>()

const searchValue = ref<string>('')

const filteredExtractions = computed(() => {
    const query = useNormalizeString(searchValue.value)

    const extractions = query
        ? props.extractions.filter((extraction) => useNormalizeString(extraction.name).includes(query))
        : props.extractions

    return [...extractions].sort(
        (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime(),
    )
})

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
        v-model="searchValue"
    />  
    <ExtractionListElement
        v-for="extraction in filteredExtractions"
        :key="extraction.name"
        :extraction="extraction"
        @download="emit('download', $event)"
        @delete="emit('delete', $event)"
        @relaunch="emit('relaunch', $event)"
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
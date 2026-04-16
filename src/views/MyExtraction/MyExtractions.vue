<script setup lang="ts">
import { useGetMyExtractions } from '@/composables/GetMyExtractions'
import type { RepositoryItem } from '@/types/my-extractions.types'

const route = useRoute();

const props = defineProps<{
}>()

const { extractionList } = useGetMyExtractions()

</script>
<template>
    <div class="fr-container">
        <ExtractionList 
            :extractions="extractionList" />
    </div>
</template>
<style scoped> 
</style>
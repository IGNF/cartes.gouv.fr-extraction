<script setup lang="ts">
import type { RepositoryItem } from '@/types/my-extractions.types'

const props = defineProps<{
    id: string
    repository: RepositoryItem
}>()

</script>
<template>
    <div class="fr-container">
        <h2>{{ repository.title }}</h2>
        <p>{{ repository.description }}</p>
        <ExtractionList
            :extractions="repository.extractions"
            :repositoryId="id"
        />
    </div>
</template>
<style scoped> 
</style>
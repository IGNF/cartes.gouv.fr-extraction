<script setup lang="ts">
const props = defineProps<{
    repoExtractionList: {
        title: string
        description: string
        url_name: string
    }[]
}>()
</script>
<template>
    <SearchableCardList
        :items="repoExtractionList"
    />
</template>
<style scoped> 
</style>
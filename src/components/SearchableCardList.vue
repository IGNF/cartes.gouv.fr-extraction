<script setup lang="ts">
import { DsfrCard } from '@gouvminint/vue-dsfr';

const props = defineProps<{
    items: {
        description: string
        title: string
    }[]
}>()

const searchedString = ref<string>("")
</script>

<template>
    <div class="fr-container">
        <DsfrSearchBar class="fr-mb-2w" 
            v-model="searchedString"
            :class="'mw-50'"
        />
        <div class="fr-grid-row">
            <DsfrCard
                v-for="(item, index) in props.items"
                :key="index"
                class="fr-col-12 fr-col-md-6 fr-col-lg-4 fr-mb-2w"
                :description="item.description"
                :title="item.title"
                img-src="https://loremflickr.com/300/200/cat?random=1"
                img-ratio="medium"
                :horizontal="false"
                :no-arrow="false"
                link=""
                size="sm"
            />
        </div>
    </div>
</template>

<style scoped>

.mw-50{
    max-width: 50%;
}

</style>
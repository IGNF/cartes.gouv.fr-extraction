<script setup lang="ts">
import CardList from './CardList.vue'

const props = defineProps<{
    items: {
        description: string
        title: string
        url_name: string
    }[]
}>()


const searchedString = ref<string>("")

const filteredItems = computed(() => {
    const query = searchedString.value.trim().toLowerCase()

    if (!query)
        return props.items

    return props.items.filter((item) => {
        return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
    })
})
</script>

<template>
    <div class="fr-container w-100">
        <div ref="searchBarWrapperRef">
            <DsfrSearchBar class="fr-mb-2w" 
                v-model="searchedString"
                :class="'mw-50 fr-mb-20v'"
            />
        </div>
        <CardList 
            :items="filteredItems" />
    </div>
</template>

<style scoped>

.mw-50{
    max-width: 50%;
}
.w-100{
    width: 100%;
}

</style>
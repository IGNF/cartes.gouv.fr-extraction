<script setup lang="ts">
import { useGetMyExtractions } from '@/composables/GetMyExtractions'
import type { RepositoryItem } from '@/types/my-extractions.types'

const route = useRoute();

const props = defineProps<{
}>()

const { repoExtractionList } = useGetMyExtractions()

const selectedRepositoryId = computed(() => {
    const repoId = route.params.repo_id
    return Array.isArray(repoId) ? repoId[0] : repoId
})

const selectedRepository = computed<RepositoryItem | undefined>(() =>
    repoExtractionList.value.find(repo => repo.url_name === selectedRepositoryId.value)
)

const menuItems = computed(() => [
  {
    id: '1',
    to: '/myextractions',
    text: 'Tout mes dossiers',
    active: route.path === '/myextractions'
  },
    ...repoExtractionList.value.map((repo, index) => ({
    id: String(index + 2),
    to: `/myextractions/${repo.url_name}`,
    text: repo.title,
    active: route.path === `/myextractions/${repo.url_name}`
  }))
])
</script>
<template>
    <MyExtractionSkeleton>
        <template #left-column>
            <h4><span class="fr-icon-database-line fr-mr-2v"></span>Mes extractions</h4>
                <p class="fr-mt-1w fr-mb-2w">Gérer mes dossiers et mes extractions</p>
            <hr>
            <DsfrSideMenu 
                :menuItems="menuItems" />
        </template>
        <template #main-column>
            <router-view v-slot="{ Component, route }"  >
                <component
                    :is="Component"
                    :repo-extraction-list="repoExtractionList"
                    v-if="route.name === 'RepositoriesList'"
                />
                <component
                    :is="Component"
                    :repository="selectedRepository"
                    :id="selectedRepositoryId"
                    v-if="route.name === 'RepositoryDetail' && selectedRepository && selectedRepositoryId"
                />
            </router-view>
        </template>
    </MyExtractionSkeleton>
</template>
<style scoped> 
.extract-list-header {
    background-color: var(--background-alt-grey);
    align-items: center;
    height: 4rem;
}
.extract-list-header h3 {
    margin: 0 0 0 1rem;
}
.extract-list-container {
  margin-top: 2rem;
  border: 1px solid var(--light-decisions-border-border-default-grey, #DDD);
  width: 100%;
}

.tag-name {
  background-color: var(--background-alt-blue-france);
  color: var(--text-action-high-blue-france);
  border-radius: 25px;
  margin-right: 4px;
  font-size: 0.875rem;
}
.check-cell {
    display: inline-flex;
}
</style>
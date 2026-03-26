<script setup lang="ts">
import { useNormalizeString } from '@/composables/utils'
import { DsfrSideMenu } from '@gouvminint/vue-dsfr';

const props = defineProps<{
}>()

// const headerRows = [
//           { label: 'Nom', key: 'name' },
//           { label: 'Création', key: 'creation' },
//           { label: 'Tag', key: 'tag' }
//         ]

// const rows = computed(() => {
//     return props.extractibles.filter(o => useNormalizeString(o.name).includes(useNormalizeString(searchedString.value)))  
// })

// const selection = ref<string[]>([])
// const currentPage = ref<number>(0)
// const selectedRow = ref<string[]>([])
// const searchedString = ref<string>("")
// // function selectRow(e : Event)  {
// //     console.log(e)
// // }
// onMounted(() => {
//   console.log('ChooseExtraction component mounted');
//   console.log('Extractible data:', props.extractibles);
// });
const menuItems = [
    {
      "id": "1",
      "to": "/myextractions/repositories",
      "text": "Tout mes dossiers",
      "active": true
    },
    {
      "id": "2",
      "to": "/repositories/repository-1",
      "text": "Repository-1",
    }
];
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
            <SearchableCardList
                :items="[
                    { title: 'Dossier d\'extraction 1', description: 'Description du dossier d\'extraction 1' },
                    { title: 'Dossier d\'extraction 2', description: 'Description du dossier d\'extraction 2' },
                    { title: 'Dossier d\'extraction 3', description: 'Description du dossier d\'extraction 3' },
                    { title: 'Dossier d\'extraction 4', description: 'Description du dossier d\'extraction 4' },
                    { title: 'Dossier d\'extraction 5', description: 'Description du dossier d\'extraction 5' },
                ]"
            />
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
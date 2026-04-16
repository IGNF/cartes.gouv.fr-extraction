<script setup lang="ts">
import { useNormalizeString } from '@/composables/utils'
import type { Extractible } from '@/types/extractibles.types';

const props = defineProps<{
    extractibles: Extractible[] // props à définir si nécessaire
}>()

const headerRows = [
          { label: 'Nom', key: 'name' },
          { label: 'Création', key: 'creation' },
          { label: 'Tag', key: 'tag' }
        ]

const rows = computed(() => {
    if (!props.extractibles) return []
    return props.extractibles.filter(o => useNormalizeString(o.name).includes(useNormalizeString(searchedString.value)))  
})

const selection = ref<string[]>([])
const currentPage = ref<number>(0)
const selectedRow = ref<string[]>([])
const searchedString = ref<string>("")
// function selectRow(e : Event)  {
//     console.log(e)
// }
onMounted(() => {
  console.log('ChooseExtractible component mounted');
  console.log('Extractible data:', props.extractibles);
});
</script>
<template>
    <ExtractibleGrid icon-class="fr-icon-database-line" title="Données extractibles">
        <div class="fr-container--fluid">
            <div class="fr-grid-row">
                <DsfrSearchBar class="fr-mr-2v" 
                    v-model="searchedString"
                />
                <DsfrButton secondary>
                    Filtres
                </DsfrButton>
            </div>
            <DsfrDataTable
                title=""
                v-model:selection="selection"
                selectable-rows
                v-model:current-page="currentPage"
                :headers-row="headerRows"
                :rows="rows"
                :sortable-rows="['name', 'creation']"
                :sorted="'name'"
                pagination
            >
                <template #cell="{ colKey, cell }">
                    <template v-if="colKey === 'tag'">
                        <div v-if="cell?.tag">
                          <span v-for="tag in cell.tag" :key="tag" class="fr-pl-2v fr-pr-2v tag-name">{{ tag }}</span>
                        </div>
                    </template>
                    <!-- <template v-else-if="colKey === 'name'" class="check-cell">
                        <DsfrRadioButton
                            :label="cell"
                            v-model="selectedRow"

                            @click="selectRow"
                        />
                    </template> -->
                    <template v-else>
                        {{ cell }}
                    </template>
                </template>
            </DsfrDataTable>
            IDs sélectionnées : {{ selection }}
        </div>
    </ExtractibleGrid>
</template>
<style scoped> 
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
<script setup lang="ts">
import { useNormalizeString } from '@/composables/utils'
import type { Extractible } from '@/types/extractibles.types';

const props = defineProps<{
    extractibles: Extractible[] // props à définir si nécessaire
}>()

const selectedExtractible = defineModel<Extractible | null>('selectedExtractible')

const headerRows = [
            { label: 'Id', key: 'id' },
            { label: 'Nom', key: 'name' },
            { label: 'Création', key: 'creation' },
            { label: 'Contact', key: 'contact' }
        ]

const rows = computed(() => {
    if (!props.extractibles) return []
    let ret =  props.extractibles.filter(o => useNormalizeString(o.name).includes(useNormalizeString(searchedString.value))).map(o => ({ ...o, id: o.name + '_' + o.creation }))
    // supprime la sélection si elle n'est plus dans les résultats filtrés
    if (!ret.some(o => o.id === selectedRow.value)) { selectedRow.value = "" }

    return ret
})

const selection = ref<string[]>([])
const currentPage = ref<number>(0)
const searchedString = ref<string>("")

//  on utilise cette variable pour stocker la ligne sélectionnée,
//  car la table permet de sélectionner plusieurs lignes, 
//  mais on veut en sélectionner qu'une à la fois
const selectedRow = ref<string>("")

watch(selection, (newSelection, oldSelection) => {
    if (newSelection.length == 0) {
        selectedRow.value = ""
    }
    if (newSelection.length == 1) {
        selectedRow.value = newSelection[0]
    }
    else if (newSelection.length > 1) {
        selectedRow.value = newSelection.filter(item => !oldSelection.includes(item))[0]
    }
})

watch(selectedRow, (newSelectedRow) => {
    if (newSelectedRow === "") {
        selection.value = []
        selectedExtractible.value = null
    }
    else {
        selection.value = [newSelectedRow]
        selectedExtractible.value = props.extractibles.find(o => o.name + '_' + o.creation === newSelectedRow) ?? null
    }
})



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
                row-key="id"
                :rows="rows"
                :sortable-rows="['name', 'creation', 'contact']"
                :sorted="'name'"
                pagination
            >
                <!-- <template #cell="{ colKey, cell }">
                    <template v-if="colKey === 'tag'">
                        <div v-if="cell?.tag">
                          <span v-for="tag in cell.tag" :key="tag" class="fr-pl-2v fr-pr-2v tag-name">{{ tag }}</span>
                        </div>
                    </template>
                    <template v-else>
                        {{ cell }}
                    </template>
                </template> -->
            </DsfrDataTable>
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

/* Permet de masquer la checkbox du header
car on ne veut pas que l'utilisateur puisse sélectionner plusieurs lignes à la fois 
*/
:deep(thead .fr-cell--fixed .fr-checkbox-group) {
    display: none;
}

/* Colonne technique id: on la garde pour row-key, mais on la masque visuellement */
:deep(thead tr > th:nth-child(2)),
:deep(tbody tr > th:nth-child(2)),
:deep(tbody tr > td:nth-child(2)) {
    display: none;
}

</style>
<script setup lang="ts">
import { DsfrButton, DsfrSelect } from '@gouvminint/vue-dsfr'
import type { ExtractibleRelation } from '@/types/extractibles.types'
import type { ClauseWhere, Filter, FilterGroup as FilterGroupType, TableAttributes } from '@/types/sql.types'
import FilterGroup from './FilterGroup.vue'

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
}>(), {
	relations: () => [],
})

const model = defineModel<ClauseWhere>({
	required: true,
	default: () => ({ table: '', filter: undefined, exportedAttributes: [] }),
})

/** Une clause peut avoir été initialisée avec un filtre simple : on l'encapsule alors dans un groupe. */
function initFilterGroup(filter: Filter | FilterGroupType): FilterGroupType {
	if (!filter) {
		return { logicalOperator: 'AND', filters: [] }
	}

	if ('filters' in filter) {
		return filter
	}

	if (!filter.attribute) {
		return { logicalOperator: 'AND', filters: [] }
	}

	return { logicalOperator: 'AND', filters: [filter] }
}

const filterGroup = ref<FilterGroupType | undefined>(model.value.filter ? initFilterGroup(model.value.filter) : undefined)
const TableAttributeSelection = ref<TableAttributes>({ table: { attributes: [] } })
const selectedTableName = computed(() => Object.keys(TableAttributeSelection.value)[0] ?? '')

const selectedRelation = computed<ExtractibleRelation>(() =>
	props.relations.find((relation) => relation.name === selectedTableName.value) ?? { name: '', type: '', attributes: {} }
)

function addFilterGroup() {
	filterGroup.value = { logicalOperator: 'AND', filters: [] }
}

watch([filterGroup, TableAttributeSelection], () => {
	model.value = {
		table: selectedTableName.value,
		filter: filterGroup.value?.filters.length ? filterGroup.value : undefined,
		exportedAttributes: TableAttributeSelection.value[selectedTableName.value]?.attributes ?? [],
	}
}, { deep: true })
</script>

<template>
	<TableAttributeSelector
		:relations="relations"
		:table-name="selectedTableName"
		v-model="TableAttributeSelection"
	/>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-12">
			<FilterGroup
				v-if="filterGroup"
				:relation="selectedRelation"
				v-model="filterGroup"
				@delete-filter-group="filterGroup = undefined"
			/>
			<DsfrButton
				v-else
				label="Ajouter un groupe de filtres"
				icon="fr-icon-add-line"
				tertiary
				@click="addFilterGroup"
				:disabled="!selectedTableName"
			/>
		</div>
	</div>
</template>
<style scoped>
.advanced-request-form__select {
	margin-bottom: 1rem;
	max-width: 50%;
}
</style>
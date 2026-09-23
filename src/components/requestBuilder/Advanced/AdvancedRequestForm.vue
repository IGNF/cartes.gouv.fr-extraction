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

function initTableAttributeSelection(clause: ClauseWhere): TableAttributes {
	if (!clause.table) {
		return { table: { attributes: [] } }
	}

	return { [clause.table]: { attributes: [...clause.exportedAttributes] } }
}

const filterGroup = ref<FilterGroupType | undefined>(model.value.filter ? initFilterGroup(model.value.filter) : undefined)
const TableAttributeSelection = ref<TableAttributes>(initTableAttributeSelection(model.value))
const selectedTableName = computed(() => Object.keys(TableAttributeSelection.value)[0] ?? '')

const selectedRelation = computed<ExtractibleRelation>(() =>
	props.relations.find((relation) => relation.name === selectedTableName.value) ?? { name: '', type: '', attributes: {} }
)

const initModel = ref<ClauseWhere>(model.value)
const isHydrating = ref(false)

watch(
	() => model.value,
	(newModel) => {
		initModel.value = newModel
	},
	{ deep: true, immediate: true }
)

/**
 * Restaure le groupe de filtres et la sélection de table depuis la clause reçue.
 * Ignoré si le modèle reçu correspond déjà à l'état local actuel (écho de notre propre mise à jour).
 */
watch(
	initModel,
	async (newModel) => {
		const currentClause: ClauseWhere = {
			table: selectedTableName.value,
			filter: filterGroup.value?.filters.length ? filterGroup.value : undefined,
			exportedAttributes: TableAttributeSelection.value[selectedTableName.value]?.attributes ?? [],
		}
		if (JSON.stringify(currentClause) === JSON.stringify(newModel)) return

		isHydrating.value = true
		filterGroup.value = newModel.filter ? initFilterGroup(newModel.filter) : undefined
		TableAttributeSelection.value = initTableAttributeSelection(newModel)

		await nextTick()
		isHydrating.value = false
	},
	{ deep: true, immediate: true }
)

function addFilterGroup() {
	filterGroup.value = { logicalOperator: 'AND', filters: [] }
}

watch([filterGroup, TableAttributeSelection], () => {
	if (isHydrating.value) return

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
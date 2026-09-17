<script setup lang="ts">
import { DsfrSelect } from '@gouvminint/vue-dsfr'
import type { ExtractibleRelation } from '@/types/extractibles.types'
import type { ClauseWhere, Filter, FilterGroup as FilterGroupType } from '@/types/sql.types'
import FilterGroup from './FilterGroup.vue'

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
}>(), {
	relations: () => [],
})

const model = defineModel<ClauseWhere>({ required: true, default: () => ({ table: '', filter: { logicalOperator: 'AND', filters: [] } }) })
const emit = defineEmits<{ delete: [] }>()

const defaultFilter = (): Filter => ({ attribute: '', operator: '=', value: '' })

/** Une clause peut avoir été initialisée avec un filtre simple : on l'encapsule alors dans un groupe. */
function initFilterGroup(filter: Filter | FilterGroupType): FilterGroupType {
	if ('filters' in filter) {
		return filter.filters.length ? filter : { ...filter, filters: [defaultFilter()] }
	}
	return { logicalOperator: 'AND', filters: [filter] }
}

const selectedTableName = ref(model.value.table)
const filterGroup = ref<FilterGroupType>(initFilterGroup(model.value.filter))

const tableOptions = computed(() => props.relations.map((relation) => relation.name))

const selectedRelation = computed<ExtractibleRelation>(() =>
	props.relations.find((relation) => relation.name === selectedTableName.value) ?? { name: '', type: '', attributes: {} }
)

watch([selectedTableName, filterGroup], () => {
	model.value = {
		table: selectedTableName.value,
		filter: filterGroup.value,
	}
}, { deep: true })
</script>

<template>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-12 advanced-request-form__select">
			<DsfrSelect
				label="Table"
				:options="tableOptions"
				v-model="selectedTableName"
			/>
		</div>

		<div class="fr-col-12">
			<FilterGroup
				:relation="selectedRelation"
				v-model="filterGroup"
				@delete-filter-group="emit('delete')"
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
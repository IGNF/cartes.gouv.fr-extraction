<script setup lang="ts">
import { DsfrButton, DsfrSegmentedSet } from '@gouvminint/vue-dsfr'
import type { ExtractibleRelation } from '@/types/extractibles.types'
import type { Filter, FilterGroup, logicalOperator } from '@/types/sql.types'
import ConditionForm from './ConditionForm.vue'

const DEFAULT_MAX_FILTER_GROUP_DEPTH = 2

const props = withDefaults(defineProps<{
	relation: ExtractibleRelation
	depth?: number
	maxDepth?: number
}>(), {
	relation: () => ({ name: '', type: '', attributes: {} }),
	depth: 1,
	maxDepth: DEFAULT_MAX_FILTER_GROUP_DEPTH,
})

const model = defineModel<FilterGroup>({
	required: true,
	default: () => ({ logicalOperator: 'AND', filters: [] }),
})

const emit = defineEmits<{ 'delete-filter-group': [] }>()

const logicalOperatorOptions: { label: string, value: logicalOperator }[] = [
	{ label: 'ET', value: 'AND' },
	{ label: 'OU', value: 'OR' },
]

const defaultFilter = (): Filter => ({ attribute: '', operator: '=', value: '' })

const canAddFilterGroup = computed(() => props.depth < props.maxDepth)

const selectedLogicalOperator = computed({
	get: () => model.value.logicalOperator,
	set: (value: logicalOperator) => {
		model.value = { ...model.value, logicalOperator: value }
	},
})

function isFilterGroup(filter: Filter | FilterGroup): filter is FilterGroup {
	return 'filters' in filter
}

function updateFilter(index: number, filter: Filter | FilterGroup) {
	const filters = [...model.value.filters]
	filters[index] = filter
	model.value = { ...model.value, filters }
}

function addFilter() {
	model.value = {
		...model.value,
		filters: [...model.value.filters, defaultFilter()],
	}
}

function addFilterGroup() {
	if (!canAddFilterGroup.value) return

	model.value = {
		...model.value,
		filters: [...model.value.filters, { logicalOperator: 'AND', filters: [defaultFilter()] }],
	}
}

function deleteFilter(index: number) {
	model.value = {
		...model.value,
		filters: model.value.filters.filter((_, i) => i !== index),
	}
}
</script>

<template>
	<div class="fr-p-2w filter-group">
		<div class="fr-grid-row fr-grid-row--middle fr-grid-row--gutters">
			<div class="fr-col">
				<DsfrSegmentedSet
					:options="logicalOperatorOptions"
					v-model="selectedLogicalOperator"
				/>
			</div>
			<div class="fr-col-auto">
				<DsfrButton
					label="Supprimer le groupe"
					tertiary
					@click="emit('delete-filter-group')"
					class="filter-group__delete-button"
				/>
			</div>
		</div>

		<div class="fr-mt-2w">
			<div
				v-for="(filter, index) in model.filters"
				:key="index"
				class="fr-grid-row fr-grid-row--bottom fr-grid-row--gutters fr-mb-2w"
			>
				<div class="fr-col">
					<FilterGroup
						v-if="isFilterGroup(filter)"
						:relation="props.relation"
						:depth="props.depth + 1"
						:max-depth="props.maxDepth"
						:model-value="filter"
						@update:model-value="updateFilter(index, $event)"
						@delete-filter-group="deleteFilter(index)"
					/>
					<ConditionForm
						v-else
						:relation="props.relation"
						:model-value="filter"
						@update:model-value="updateFilter(index, $event)"
					/>
				</div>
				<div v-if="!isFilterGroup(filter)" class="fr-col-auto">
					<DsfrButton
						icon="fr-icon-delete-bin-line"
						icon-only
						tertiary
						no-outline
						label="Supprimer le filtre"
						@click="deleteFilter(index)"
					/>
				</div>
			</div>

			<div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
				<div class="fr-col-auto">
					<DsfrButton
						label="Ajouter un filtre"
						icon="fr-icon-add-line"
						tertiary
						@click="addFilter"
					/>
				</div>
				<div class="fr-col-auto">
					<DsfrButton
						v-if="canAddFilterGroup"
						label="Ajouter un groupe"
						icon="fr-icon-add-line"
						tertiary
						@click="addFilterGroup"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.filter-group {
	border: 1px solid var(--border-default-grey);
}
.filter-group__delete-button {
	text-decoration: underline;
}
</style>

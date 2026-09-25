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
	initialLogicalOperator?: logicalOperator
}>(), {
	relation: () => ({ name: '', type: '', attributes: {} }),
	depth: 1,
	maxDepth: DEFAULT_MAX_FILTER_GROUP_DEPTH,
	initialLogicalOperator: 'AND',
})

const model = defineModel<FilterGroup>({
	required: true,
})

const emit = defineEmits<{ 'delete-filter-group': [] }>()

const logicalOperatorOptions: { label: string, value: logicalOperator }[] = [
	{ label: 'ET', value: 'AND' },
	{ label: 'OU', value: 'OR' },
]

const filters = ref<(Filter | FilterGroup)[]>([...model.value.filters])

const canAddFilterGroup = computed(() => props.depth < props.maxDepth)

const selectedLogicalOperator = computed({
	get: () => model.value.logicalOperator ?? props.initialLogicalOperator,
	set: (value: logicalOperator) => {
		model.value = { ...model.value, logicalOperator: value }
	},
})

const initModel = ref<FilterGroup>(model.value)
const isHydrating = ref(false)

watch(
	() => model.value,
	(newModel) => {
		initModel.value = newModel
	},
	{ deep: true, immediate: true }
)

/**
 * Restaure la liste des filtres depuis le groupe reçu.
 * Ignoré si le modèle reçu correspond déjà aux filtres actuels (écho de notre propre mise à jour).
 */
watch(
	initModel,
	async (newModel) => {
		const currentFilters = filters.value.filter(isValidFilter)
		if (JSON.stringify(currentFilters) === JSON.stringify(newModel.filters)) return

		isHydrating.value = true
		filters.value = [...newModel.filters]

		await nextTick()
		isHydrating.value = false
	},
	{ deep: true, immediate: true }
)

function isFilterGroup(filter: Filter | FilterGroup): filter is FilterGroup {
	return Boolean(filter && 'filters' in filter)
}

function isValidFilter(filter: Filter | FilterGroup): filter is Exclude<Filter, undefined> | FilterGroup {
	return Boolean(filter) && (!isFilterGroup(filter) || filter.filters.length > 0)
}

function updateModel() {
	if (isHydrating.value) return

	model.value = {
		...model.value,
		filters: filters.value.filter(isValidFilter),
	}
}

function updateFilter(index: number, filter: Filter | FilterGroup) {
	filters.value[index] = filter
	updateModel()
}

function addFilter() {
	filters.value.push(undefined)
}

function addFilterGroup(logicalOperator: logicalOperator) {
	if (!canAddFilterGroup.value) return

	filters.value.push({ logicalOperator, filters: [] })
}

function deleteFilter(index: number) {
	filters.value.splice(index, 1)
	updateModel()
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
				v-for="(filter, index) in filters"
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
						:initial-logical-operator="props.initialLogicalOperator"
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
						label="Supprimer la condition"
						@click="deleteFilter(index)"
					/>
				</div>
			</div>

			<div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
				<div class="fr-col-auto">
					<DsfrButton
						label="Ajouter une condition"
						icon="fr-icon-add-line"
						tertiary
						@click="addFilter"
					/>
				</div>
				<div class="fr-col-auto">
					<DsfrButton
						v-if="canAddFilterGroup"
						label="Ajouter un groupe ET"
						icon="fr-icon-add-line"
						tertiary
						@click="addFilterGroup('AND')"
					/>
				</div>
				<div class="fr-col-auto">
					<DsfrButton
						v-if="canAddFilterGroup"
						label="Ajouter un groupe OU"
						icon="fr-icon-add-line"
						tertiary
						@click="addFilterGroup('OR')"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.filter-group {
	border-left: 2.5px solid var(--border-open-blue-france);
}
.filter-group__delete-button {
	text-decoration: underline;
}
</style>

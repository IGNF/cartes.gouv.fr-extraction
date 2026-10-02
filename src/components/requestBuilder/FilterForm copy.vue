<script setup lang="ts">
import { DsfrInput, DsfrSelect } from '@gouvminint/vue-dsfr'
import type { ExtractibleRelation } from '@/types/extractibles.types'

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
	tableName: string
}>(), {
	relations: () => [],
	tableName: '',
})

const filterModel = defineModel<string>({ required: true })
const emit = defineEmits<{ delete: [] }>()

function deleteFilter() {
	emit('delete')
}
const selectedOperator = ref('=')
const selectedAttribute = ref('')
const attributeValue = ref('')

const sqlOperators = [
	'=',
	'!=',
	'>',
	'<',
	'>=',
	'<=',
	'LIKE',
	'NOT LIKE',
	'IN',
	'NOT IN',
	'BETWEEN',
	'IS NULL',
	'IS NOT NULL',
	'AND',
	'OR',
]

const attributeOptions = computed(() => {
	if (!props.tableName) return []
	const relation = props.relations.find((rel) => rel.name === props.tableName)
	if (!relation) return []
	return Object.keys(relation.attributes || {})
})

const selectedAttributeHint = computed(() => {
	if (!props.tableName || !selectedAttribute.value) return ''

	const relation = props.relations.find((item) => item.name === props.tableName)
	if (!relation) return ''

	const rawValue = relation.attributes?.[selectedAttribute.value]
	if (rawValue === undefined || rawValue === null) return ''
	if (typeof rawValue === 'object') return JSON.stringify(rawValue)

	return String(rawValue)
})

watch([
	selectedAttribute,
	selectedOperator,
	attributeValue,
], () => {
	filterModel.value = [selectedAttribute.value, selectedOperator.value, attributeValue.value]
		.filter(Boolean)
		.join(' ')
}, { immediate: true })
</script>

<template>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-12 fr-col-md-6">
			<DsfrSelect
				label="Attribut"
				:options="attributeOptions"
				v-model="selectedAttribute"
				:disabled="!props.tableName"
			/>
		</div>

		<div class="fr-col-12 fr-col-md-6">
			<DsfrSelect
				label="Opérateur"
				:options="sqlOperators"
				v-model="selectedOperator"
				:disabled="!selectedAttribute"
			/>
		</div>

		<div class="fr-col-12">
			<div class="fr-grid-row fr-grid-row--bottom fr-grid-row--gutters">
				<div class="fr-col">
					<DsfrInput
						label="Valeur de l'attribut"
						label-visible
						:hint="selectedAttributeHint"
						v-model="attributeValue"
						:disabled="!selectedAttribute"
					/>
				</div>
				<div class="fr-col-auto">
					<DsfrButton
						icon="fr-icon-delete-bin-line"
						icon-only
						tertiary
						no-outline
						label="Supprimer le filtre"
						@click="deleteFilter"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

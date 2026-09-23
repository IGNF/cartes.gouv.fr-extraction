<script setup lang="ts">
import { DsfrInput, DsfrSelect } from '@gouvminint/vue-dsfr'
import type { ExtractibleRelation } from '@/types/extractibles.types'
import type { Filter, Operator } from '@/types/sql.types'

const props = withDefaults(defineProps<{
	relation: ExtractibleRelation
}>(), {
	relation: () => ({ name: '', type: '', attributes: {} }),
})

const model = defineModel<Filter | undefined>()

const operatorOptions: Operator[] = ['=', '!=', '<', '<=', '>', '>=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN']

const selectedAttribute = ref(model.value?.attribute ?? '')
const selectedOperator = ref<Operator>(model.value?.operator ?? '=')
const attributeValue = ref(String(model.value?.value ?? ''))

const attributeOptions = computed(() => Object.keys(props.relation.attributes || {}))

/**
 * Convertit la valeur textuelle saisie selon la catégorie d'opérateur choisie
 * (tableau pour IN/NOT IN, nombre pour les comparateurs numériques, chaîne sinon).
 */
function buildFilter(attribute: string, operator: Operator, rawValue: string): Filter {
	if (!attribute) {
		throw new Error('Attribute is required')
	}
	if (operator === 'IN' || operator === 'NOT IN') {
		return {
			attribute,
			operator,
			value: rawValue.split(',').map((item) => item.trim()).filter(Boolean),
		}
	}

	if (operator === '<' || operator === '<=' || operator === '>' || operator === '>=') {
		return { attribute, operator, value: Number(rawValue) }
	}

	return { attribute, operator, value: rawValue }
}

watch([selectedAttribute, selectedOperator, attributeValue], () => {
	if (!selectedAttribute.value) {
		model.value = undefined
		return
	}

	model.value = buildFilter(selectedAttribute.value, selectedOperator.value, attributeValue.value)
})
</script>

<template>
	<div class="fr-grid-row fr-grid-row--gutters">
		{{ model }}
		<div class="fr-col-12 fr-col-md-4">
			<DsfrSelect
				label="Attribut"
				:options="attributeOptions"
				v-model="selectedAttribute"
			/>
		</div>

		<div class="fr-col-12 fr-col-md-4">
			<DsfrSelect
				label="Opérateur"
				:options="operatorOptions"
				v-model="selectedOperator"
				:disabled="!selectedAttribute"
			/>
		</div>

		<div class="fr-col-12 fr-col-md-4">
			<DsfrInput
				label="Valeur"
				label-visible
				v-model="attributeValue"
				:disabled="!selectedAttribute"
			/>
		</div>
	</div>
</template>

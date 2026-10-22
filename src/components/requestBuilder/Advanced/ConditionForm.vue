<script setup lang="ts">
import { DsfrSelect } from '@gouvminint/vue-dsfr'
import SqlInput from './SqlInput.vue'
import { formatValue, parseSqlList } from '@/composables/sqlUtils'
import type { ExtractibleRelation } from '@/types/extractibles.types'
import { getSqlDataTypeCategory, type Filter, type Operator } from '@/types/sql.types'
import type { simpleSqlOperator } from '@/types/UITypes'

const props = withDefaults(defineProps<{
	relation: ExtractibleRelation
}>(), {
	relation: () => ({ name: '', type: '', attributes: {} }),
})

const model = defineModel<Filter | undefined>()

const operatorOptions = ([
	{ operator: '=', simpleSqlOperator: 'est égal à', options: 'est égal à (=)' },
	{ operator: '!=', simpleSqlOperator: "n'est pas égal à", options: "n'est pas égal à (!=)" },
	{ operator: '<', simpleSqlOperator: 'est inférieur à', options: 'est inférieur à (<)' },
	{ operator: '<=', simpleSqlOperator: 'est inférieur ou égal à', options: 'est inférieur ou égal à (<=)' },
	{ operator: '>', simpleSqlOperator: 'est supérieur à', options: 'est supérieur à (>)' },
	{ operator: '>=', simpleSqlOperator: 'est supérieur ou égal à', options: 'est supérieur ou égal à (>=)' },
	{ operator: 'LIKE', simpleSqlOperator: 'commence par', options: 'commence par (LIKE \'string%\')' },
	{ operator: 'NOT LIKE', simpleSqlOperator: 'ne commence pas par', options: 'ne commence pas par (NOT LIKE \'%string\')' },
	{ operator: 'LIKE', simpleSqlOperator: 'contient', options: 'contient (LIKE \'%string%\')' },
	{ operator: 'NOT LIKE', simpleSqlOperator: 'ne contient pas', options: 'ne contient pas (NOT LIKE \'%string%\')' },
	{ operator: 'LIKE', simpleSqlOperator: 'finit par', options: 'finit par (LIKE \'%string\')' },
	{ operator: 'NOT LIKE', simpleSqlOperator: 'ne finit pas par', options: 'ne finit pas par (NOT LIKE \'string%\')' },
	{ operator: 'IN', simpleSqlOperator: 'est dans la liste', options: 'est dans la liste (IN)' },
	{ operator: 'NOT IN', simpleSqlOperator: "n'est pas dans la liste", options: "n'est pas dans la liste (NOT IN)" },
	{ operator: '=', simpleSqlOperator: 'est vide', options: "est vide (= '')" },
	{ operator: '!=', simpleSqlOperator: "n'est pas vide", options: "n'est pas vide (!= '')" },
	{ operator: 'IS NULL', simpleSqlOperator: 'est nul', options: 'est nul (IS NULL)' },
	{ operator: 'IS NOT NULL', simpleSqlOperator: "n'est pas nul", options: "n'est pas nul (IS NOT NULL)" },
] satisfies { operator: Operator; simpleSqlOperator: simpleSqlOperator; options: string }[]).map(option => ({
	...option,
	text: option.options,
	value: option.simpleSqlOperator,
}))

const selectedAttribute = ref(model.value?.attribute ?? '')
const selectedOperator = ref<simpleSqlOperator>(restoreOperator(model.value).operator)
const attributeValue = ref(restoreOperator(model.value).value)
const hasInputError = ref(false)

const sqlOperator = computed(() => operatorOptions.find(option => option.simpleSqlOperator === selectedOperator.value)!.operator)
const requiresValue = computed(() => !['est vide', "n'est pas vide", 'est nul', "n'est pas nul"].includes(selectedOperator.value))

const attributeOptions = computed(() => Object.keys(props.relation.attributes || {}))
const selectedDataType = computed(() => props.relation.attributes?.[selectedAttribute.value])
const filteredOperatorOptions = computed(() => {
	const category = selectedDataType.value ? getSqlDataTypeCategory(selectedDataType.value) : undefined
	return operatorOptions.filter(option => {
		if (['<', '<=', '>', '>='].includes(option.operator)) return category === 'sqlNumber'
		if (['LIKE', 'NOT LIKE'].includes(option.operator)
			|| ['est vide', "n'est pas vide"].includes(option.simpleSqlOperator)) return category === 'sqlString'
		return true
	})
})

// Un changement d'attribut ne doit pas conserver un opérateur incompatible.
watch(filteredOperatorOptions, (options) => {
	if (!options.some(option => option.value === selectedOperator.value)) {
		selectedOperator.value = 'est égal à'
	}
})

function filterValueToString(value: Exclude<Filter, undefined>['value'] | undefined): string {
	return Array.isArray(value) ? formatValue(value) : String(value ?? '')
}

/** Restaure le libellé et retire uniquement les jokers ajoutés par le formulaire. */
function restoreOperator(filter: Filter): { operator: simpleSqlOperator; value: string } {
	const value = filterValueToString(filter?.value)
	if (filter?.operator === 'LIKE' || filter?.operator === 'NOT LIKE') {
		const negative = filter.operator === 'NOT LIKE'
		if (value.startsWith('%') && value.endsWith('%') && value.length >= 2) {
			return { operator: negative ? 'ne contient pas' : 'contient', value: value.slice(1, -1) }
		}
		if (value.startsWith('%')) {
			return { operator: negative ? 'ne commence pas par' : 'commence par', value: value.slice(1) }
		}
		if (value.endsWith('%')) {
			return { operator: negative ? 'ne finit pas par' : 'finit par', value: value.slice(0, -1) }
		}
	}
	if (filter?.value === '' && (filter.operator === '=' || filter.operator === '!=')) {
		return { operator: filter.operator === '=' ? 'est vide' : "n'est pas vide", value: '' }
	}
	return {
		operator: operatorOptions.find(option => option.operator === (filter?.operator ?? '='))!.simpleSqlOperator,
		value,
	}
}

const initModel = ref<Filter | undefined>(model.value)
const isHydrating = ref(false)

watch(
	() => model.value,
	(newModel) => {
		initModel.value = newModel
	},
	{ deep: true, immediate: true }
)

/**
 * Restaure les champs du formulaire depuis le filtre reçu.
 * Ignoré si le modèle reçu correspond déjà à la saisie actuelle (écho de notre propre mise à jour).
 */
watch(
	initModel,
	async (newModel) => {
		const currentFilter = selectedAttribute.value
			? buildFilter(selectedAttribute.value, selectedOperator.value, attributeValue.value)
			: undefined
		if (JSON.stringify(currentFilter) === JSON.stringify(newModel)) return

		isHydrating.value = true
		selectedAttribute.value = newModel?.attribute ?? ''
		const restored = restoreOperator(newModel)
		selectedOperator.value = restored.operator
		attributeValue.value = restored.value

		await nextTick()
		isHydrating.value = false
	},
	{ deep: true, immediate: true }
)

/**
 * Convertit la valeur textuelle saisie selon la catégorie d'opérateur choisie
 * (tableau pour IN/NOT IN, nombre pour les comparateurs numériques, chaîne sinon).
 */
function buildFilter(attribute: string, simpleOperator: simpleSqlOperator, rawValue: string): Filter {
	if (!attribute) {
		throw new Error('Attribute is required')
	}
	const operator = operatorOptions.find(option => option.simpleSqlOperator === simpleOperator)!.operator
	if (operator === 'IS NULL' || operator === 'IS NOT NULL') {
		return { attribute, operator, value: null }
	}
	if (simpleOperator === 'est vide' || simpleOperator === "n'est pas vide") {
		return { attribute, operator: simpleOperator === 'est vide' ? '=' : '!=', value: '' }
	}
	if (operator === 'IN' || operator === 'NOT IN') {
		return {
			attribute,
			operator,
			value: parseSqlList(rawValue),
		}
	}

	if (operator === '<' || operator === '<=' || operator === '>' || operator === '>=') {
		return { attribute, operator, value: Number(rawValue) }
	}

	if (simpleOperator === 'commence par' || simpleOperator === 'ne commence pas par') rawValue = `%${rawValue}`
	else if (simpleOperator === 'finit par' || simpleOperator === 'ne finit pas par') rawValue = `${rawValue}%`
	else if (simpleOperator.includes('contient')) rawValue = `%${rawValue}%`

	return { attribute, operator, value: rawValue }
}

watch([selectedAttribute, selectedOperator, attributeValue, hasInputError], () => {
	if (isHydrating.value) return

	if (!selectedAttribute.value) {
		model.value = undefined
		return
	}

	if (requiresValue.value && hasInputError.value) return

	model.value = buildFilter(selectedAttribute.value, selectedOperator.value, attributeValue.value)
}, { flush: 'post' })
</script>

<template>
	<div class="condition-form">
		<div class="condition-form__icon">
			<span class="condition-form__drag-icon" aria-hidden="true"></span>
		</div>
		<div class="condition-form__fields fr-grid-row fr-grid-row--gutters">
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
					:options="filteredOperatorOptions"
					v-model="selectedOperator"
					:disabled="!selectedAttribute"
				/>
			</div>

			<div class="fr-col-12 fr-col-md-4">
				<SqlInput
					v-if="requiresValue"
					v-model="attributeValue"
					v-model:has-error="hasInputError"
					:data-type="selectedDataType"
					:operator="sqlOperator"
					:disabled="!selectedAttribute"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.condition-form {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
}

.condition-form__icon {
	flex: 0 0 auto;
}

.condition-form__drag-icon {
	display: block;
	width: 1.5rem;
	height: 1.5rem;
	background-color: var(--text-action-high-blue-france);
	-webkit-mask: url('@/assets/ri-draggable.svg') center / contain no-repeat;
	mask: url('@/assets/ri-draggable.svg') center / contain no-repeat;
}

.condition-form__fields {
	flex: 1;
	min-width: 0;
	align-items: flex-start;
}
</style>

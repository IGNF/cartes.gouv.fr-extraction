<script setup lang="ts">
import { CgfrSelectList } from '@ignf/cartes.gouv.fr-vue-components'
import type { ExtractibleRelation } from '@/types/extractibles.types'

type TableParams = Record<string, { attributes: string[] }>

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
}>(), {
	relations: () => [],
})

const tableParams = defineModel<TableParams>({ required: true })

const selectedTable = ref('')
const selectedAttributes = ref<string[]>([])

const tableOptions = computed(() => props.relations.map((relation) => relation.name))

const attributeOptions = computed(() => {
	const relation = props.relations.find((item) => item.name === selectedTable.value)
	if (!relation) return []
	return Object.keys(relation.attributes || {})
})

const initModel = ref<TableParams | undefined>(tableParams.value)
const isHydrating = ref(false)

watch(
	() => tableParams.value,
	(newModel) => {
		initModel.value = newModel
	},
	{ deep: true, immediate: true }
)

/**
 * Restaure la table et les attributs sélectionnés depuis le modèle reçu.
 * Ignoré si le modèle reçu correspond déjà à la sélection actuelle (écho de notre propre mise à jour).
 */
watch(
	initModel,
	async (newModel) => {
		if (!newModel) return

		const currentParams: TableParams = selectedTable.value
			? { [selectedTable.value]: { attributes: [...selectedAttributes.value] } }
			: {}
		if (JSON.stringify(currentParams) === JSON.stringify(newModel)) return

		isHydrating.value = true
		const tableName = Object.keys(newModel)[0] ?? ''
		selectedTable.value = tableName
		selectedAttributes.value = tableName ? [...(newModel[tableName]?.attributes ?? [])] : []

		await nextTick()
		isHydrating.value = false
	},
	{ deep: true, immediate: true }
)

watch(selectedTable, (newTable, oldTable) => {
	if (isHydrating.value || newTable === oldTable) return
	selectedAttributes.value = []
})

watch([selectedTable, selectedAttributes], () => {
	if (isHydrating.value) return

	if (!selectedTable.value) {
		tableParams.value = {}
		return
	}

	tableParams.value = {
		[selectedTable.value]: {
			attributes: [...selectedAttributes.value],
		},
	}
})
</script>

<template>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-12 fr-col-md-6">
			<DsfrSelect
				label="Table à filter"
				:options="tableOptions"
				v-model="selectedTable"
			/>
		</div>
		<div class="fr-col-12 fr-col-md-6">
			<CgfrSelectList
				label="Attributs à exporter"
				:options="attributeOptions"
				v-model="selectedAttributes"
				:disabled="!selectedTable"
				legend="Attributes"
			/>
		</div>
	</div>
</template>

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

watch(selectedTable, () => {
	selectedAttributes.value = []
})

watch([selectedTable, selectedAttributes], () => {
	if (!selectedTable.value) {
		tableParams.value = {}
		return
	}

	tableParams.value = {
		[selectedTable.value]: {
			attributes: [...selectedAttributes.value],
		},
	}
}, { immediate: true })
</script>

<template>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-12 fr-col-md-6">
			<DsfrSelect
				label="Table"
				:options="tableOptions"
				v-model="selectedTable"
			/>
		</div>
		<div class="fr-col-12 fr-col-md-6">
			<CgfrSelectList
				label="Attributes"
				:options="attributeOptions"
				v-model="selectedAttributes"
				:disabled="!selectedTable"
				legend="Attributes"
			/>
		</div>
	</div>
</template>

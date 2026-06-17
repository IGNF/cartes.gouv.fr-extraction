<script setup lang="ts">
import { CgfrSelectList } from 'cartes.gouv.fr-vue-components'
import type { ExtractibleRelation, RelationInput } from '@/types/extractibles.types'

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
}>(), {
	relations: () => [],
})

const model = defineModel<RelationInput>({ required: true })
const initModel = ref<RelationInput | undefined>(model.value)
const isHydrating = ref(false)

const selectedTableNames = ref<string[]>([])

const tableOptions = computed(() => props.relations.map((relation) => relation.name))

watch(
	() => model.value,
	(newModel) => {
		initModel.value = newModel
	},
	{ deep: true, immediate: true }
)

watch(
	initModel,
	async (newModel) => {
		if (!newModel) return

		isHydrating.value = true
		selectedTableNames.value = Object.keys(newModel)

		await nextTick()
		isHydrating.value = false
	},
	{ deep: true, immediate: true }
)

watch(selectedTableNames, () => {
	if (isHydrating.value) return

	if (!selectedTableNames.value.length) {
		model.value = {}
		return
	}

	model.value = selectedTableNames.value.reduce<RelationInput>((accumulator, tableName) => {
		const relation = props.relations.find((item) => item.name === tableName)
		if (!relation) return accumulator

		accumulator[tableName] = {
			attributes: Object.keys(relation.attributes || {}),
			filters: '',
		}

		return accumulator
	}, {})
}, { immediate: true })
</script>

<template>
	<CgfrSelectList
		label="Table"
		legend="Table"
        class="w-100"
		:options="tableOptions"
		v-model="selectedTableNames"
	/>
</template>
<style scoped> 
.w-100 {
    width: 100%;
}
</style>
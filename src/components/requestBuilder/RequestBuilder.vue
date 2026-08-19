<script setup lang="ts">
import { CgfrSelectList } from 'cartes.gouv.fr-vue-components'
import { storeToRefs } from 'pinia'
import { useCreateExtractionStore } from '@/stores/createExtractionStore'
import { createIntersectSQL } from '@/composables/Extractions/useExtractionExtent'
import type { ExtractibleRelation, RelationInput } from '@/types/extractibles.types'

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
	ExtractibleSrs?: string
}>(), {
	relations: () => [],
	ExtractibleSrs: 'EPSG:3857',
})

const model = defineModel<RelationInput>({ required: true })
const initModel = ref<RelationInput | undefined>(model.value)
const isHydrating = ref(false)
const createExtractionStore = useCreateExtractionStore()
const { extentLayer } = storeToRefs(createExtractionStore)

const selectedTableNames = ref<string[]>([])

const tableOptions = computed(() => props.relations.map((relation) => relation.name))

const destinationSrid = computed(() => {
	const match = props.ExtractibleSrs?.match(/(\d+)/)
	if (!match) return 3857

	const srid = Number.parseInt(match[1], 10)
	return Number.isNaN(srid) ? 3857 : srid
})

const extentFilter = computed(() => {
	if (!extentLayer.value) return ''
	return createIntersectSQL(extentLayer.value, destinationSrid.value)
})

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

watch([selectedTableNames, extentFilter], () => {
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
			filters: extentFilter.value,
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
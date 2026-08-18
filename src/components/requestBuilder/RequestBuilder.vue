<script setup lang="ts">
import { CgfrSelectList } from 'cartes.gouv.fr-vue-components'
import { storeToRefs } from 'pinia'
import { useCreateExtractionStore } from '@/stores/createExtractionStore'
import type { ExtractibleRelation, RelationInput } from '@/types/extractibles.types'

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
}>(), {
	relations: () => [],
})

const model = defineModel<RelationInput>({ required: true })
const initModel = ref<RelationInput | undefined>(model.value)
const isHydrating = ref(false)
const createExtractionStore = useCreateExtractionStore()
const { extentGeometries } = storeToRefs(createExtractionStore)

const selectedTableNames = ref<string[]>([])

const tableOptions = computed(() => props.relations.map((relation) => relation.name))

const extentFilter = computed(() => {
	if (!extentGeometries.value.length) return ''

	const geometrySqlList = extentGeometries.value.map((geometry: Record<string, unknown>) => {
		const geometryJson = JSON.stringify(geometry)
		return `ST_SetSRID(ST_GeomFromGeoJSON('${geometryJson}'), 3857)`
	})

	if (geometrySqlList.length === 1) {
		return `ST_Intersects(geometrie, ${geometrySqlList[0]})`
	}

	return `ST_Intersects(geometrie, ST_Collect(ARRAY[${geometrySqlList.join(', ')}]))`
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
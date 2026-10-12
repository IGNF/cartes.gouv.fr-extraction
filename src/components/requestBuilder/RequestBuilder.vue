<script setup lang="ts">
import { CgfrSelectList } from '@ignf/cartes.gouv.fr-vue-components'
import { storeToRefs } from 'pinia'
import { useCreateExtractionStore } from '@/stores/createExtractionStore'
import { createIntersectSQL } from '@/composables/Extractions/useExtractionExtentUtils'
import { DEFAULT_MAP_SRS, DEFAULT_MAP_SRID } from '@/composables/useMapConstants'
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

/**
 * Synchronise le modèle de requête avec les tables sélectionnées.
 *
 * Pendant l'hydratation, la sélection est reconstruite depuis le modèle existant :
 * on évite alors de l'écraser avant que cette initialisation soit terminée. Une fois
 * l'hydratation terminée, chaque table sélectionnée est associée à tous ses attributs
 * disponibles. Les tables devenues indisponibles sont simplement ignorées et une
 * sélection vide réinitialise complètement le modèle.
 */
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
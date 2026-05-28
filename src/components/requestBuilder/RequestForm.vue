<script setup lang="ts">
import { DsfrAccordion, DsfrAccordionsGroup, DsfrButton } from '@gouvminint/vue-dsfr'
import type { ExtractibleRelation, RelationInput } from '@/types/extractibles.types'

type TableParams = Record<string, { attributes: string[] }>

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
}>(), {
	relations: () => [],
})

const model = defineModel<RelationInput>({ required: true })
const emit = defineEmits<{ delete: [] }>()

const tableParams = ref<TableParams>({})
const filters = ref<string[]>([])
const activeFilterAccordion = ref(-1)

const selectedTableName = computed(() => Object.keys(tableParams.value)[0] || '')

watch([tableParams, filters], () => {
	const tableName = selectedTableName.value
	if (!tableName) return
	model.value = {
		[tableName]: {
			attributes: tableParams.value[tableName]?.attributes ?? [],
			filters: filters.value.filter(Boolean).join(' AND '),
		},
	}
}, { deep: true })

const addFilter = () => {
	filters.value.push('')
	activeFilterAccordion.value = filters.value.length - 1
}

const deleteFilter = (index: number) => {
	filters.value.splice(index, 1)
	activeFilterAccordion.value = -1
}

</script>

<template>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-12">
			<TableAttributeSelector
				:relations="relations"
				v-model="tableParams"
			/>
		</div>

		<div class="fr-col-12">
			<h3 v-if="filters.length" class="fr-h6">Filtres</h3>
			<DsfrAccordionsGroup v-model="activeFilterAccordion">
				<DsfrAccordion
					v-for="(_, filterIndex) in filters"
					:key="`filter-${filterIndex}`"
					:title="`Filtre ${filterIndex + 1}`"
				>
					<FilterForm
						:relations="relations"
						:table-name="selectedTableName"
						v-model="filters[filterIndex]"
						@delete="deleteFilter(filterIndex)"
					/>
				</DsfrAccordion>
			</DsfrAccordionsGroup>
		</div>

		<div class="fr-col-12">
			<DsfrButton
				label="Ajouter un filtre"
				icon="fr-icon-add-line"
				secondary
				@click="addFilter"
			/>
		</div>

		<div class="fr-col-12">
			<DsfrButton
				label="Supprimer la requête"
				icon="fr-icon-delete-bin-fill"
				secondary
				style="width: 100%; justify-content: center;"
				@click="emit('delete')"
			/>
		</div>
	</div>
</template>

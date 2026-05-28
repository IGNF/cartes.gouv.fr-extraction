<script setup lang="ts">
import { DsfrAccordion, DsfrAccordionsGroup, DsfrButton } from '@gouvminint/vue-dsfr'
import type { ExtractibleRelation, RelationInput } from '@/types/extractibles.types'

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
}>(), {
	relations: () => [],
})

const model = defineModel<RelationInput>({ required: true })

const requests = ref<RelationInput[]>([])
const activeRequestAccordion = ref(-1)

watch(requests, () => {
	model.value = Object.assign({}, ...requests.value)
}, { deep: true })

const addRequest = () => {
	requests.value.push({})
	activeRequestAccordion.value = requests.value.length - 1
}

const deleteRequest = (index: number) => {
	requests.value.splice(index, 1)
	activeRequestAccordion.value = -1
}
</script>

<template>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-12">
			<DsfrAccordionsGroup v-model="activeRequestAccordion">
				<DsfrAccordion
					v-for="(_, requestIndex) in requests"
					:key="`request-${requestIndex}`"
					:title="Object.keys(requests[requestIndex])[0] ? `Extraction depuis ${Object.keys(requests[requestIndex])[0]}` : 'Veuillez sélectionner une table'"
				>
					<RequestForm
						:relations="relations"
						v-model="requests[requestIndex]"
						@delete="deleteRequest(requestIndex)"
					/>
				</DsfrAccordion>
			</DsfrAccordionsGroup>
		</div>

		<div class="fr-col-12">
			<DsfrButton
				label="Ajouter une requête"
				icon="fr-icon-add-line"
				secondary
				style="width: 100%; justify-content: center;"
				@click="addRequest"
			/>
		</div>
	</div>
</template>

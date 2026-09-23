<script setup lang="ts">
import { DsfrAccordion, DsfrAccordionsGroup, DsfrButton } from '@gouvminint/vue-dsfr'
import type { ExtractibleRelation, RelationInput } from '@/types/extractibles.types'
import type { ClauseWhere } from '@/types/sql.types'
import { clauseWhereToRelationInput } from '@/composables/sqlUtils'
import AdvancedRequestForm from './AdvancedRequestForm.vue'

const props = withDefaults(defineProps<{
	relations: ExtractibleRelation[]
}>(), {
	relations: () => [],
})

const model = defineModel<RelationInput>({ required: true, default: () => ({}) })

const defaultClause = (): ClauseWhere => ({
	table: '',
	filter: undefined,
	exportedAttributes: [],
})

const items = ref<ClauseWhere[]>([defaultClause()])
const activeAccordion = ref(-1)

watch(items, () => {
	model.value = clauseWhereToRelationInput(items.value.filter((item) => item.table !== ''))
}, { deep: true })

function addClause() {
	items.value.push(defaultClause())
	activeAccordion.value = items.value.length - 1
}

function deleteClause(index: number) {
	items.value.splice(index, 1)
	activeAccordion.value = -1
}

function getClauseTitle(index: number) {
	return items.value[index].table ? `Condition sur ${items.value[index].table}` : 'Veuillez sélectionner une table'
}
</script>

<template>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-12">
			<DsfrButton
				label="Ajouter une clause"
				icon="fr-icon-add-line"
				secondary
				@click="addClause"
			/>
		</div>
		<div class="fr-col-12">
			<DsfrAccordionsGroup v-model="activeAccordion">
				<DsfrAccordion
					v-for="(_, index) in items"
					:key="`clause-${index}`"
				>
					<template #title>
						<span class="advanced-request-builder__accordion-title">
							<span>{{ getClauseTitle(index) }}</span>
							<span
								class="advanced-request-builder__delete-button fr-icon-delete-bin-line"
								role="button"
								tabindex="0"
								aria-label="Supprimer la condition"
								@click.stop.prevent="deleteClause(index)"
								@keydown.enter.stop.prevent="deleteClause(index)"
								@keydown.space.stop.prevent="deleteClause(index)"
							/>
						</span>
					</template>
					<AdvancedRequestForm
						:relations="relations"
						v-model="items[index]"
					/>
				</DsfrAccordion>
			</DsfrAccordionsGroup>
		</div>
	</div>
</template>

<style scoped>
.advanced-request-builder__accordion-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	width: 100%;
}

.advanced-request-builder__delete-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	margin-right: 1rem;
	width: 2rem;
	height: 2rem;
	color: var(--text-action-high-blue-france);
}

.advanced-request-builder__delete-button:focus-visible {
	outline: 2px solid var(--border-action-high-blue-france);
	outline-offset: 2px;
}
</style>

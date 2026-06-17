<script setup lang="ts">
import { DsfrButton, DsfrModal, DsfrRadioButtonSet } from '@gouvminint/vue-dsfr'
import type { ModalInterface, RelaunchAction } from '@/types/UITypes'

const emit = defineEmits<{
	(event: 'relaunchExtraction', action: RelaunchAction): void
}>()

const isRelaunchModalOpened = ref(false)
const selectedAction = ref<RelaunchAction | undefined>(undefined)

const relaunchOptions = [
	{
		label: 'Remplacer l\'extraction',
		hint: 'Lance à nouveau cette extraction avec les mêmes paramètres et remplace le résultat existant.',
		id: 'relaunch-replace',
		value: 'replace',
	},
	{
		label: 'Dupliquer l\'extraction',
		hint: 'Crée une nouvelle extraction à partir de celle-ci. Vous pourrez ajuster les paramètres avant de la lancer.',
		id: 'relaunch-duplicate',
		value: 'duplicate',
	},
]

function openModal() {
	selectedAction.value = undefined
	isRelaunchModalOpened.value = true
}

function closeModal() {
	isRelaunchModalOpened.value = false
}

function relaunchExtraction() {
	if (!selectedAction.value) {
		return
	}

	emit('relaunchExtraction', selectedAction.value)
}

const modalInterface: ModalInterface = {
	openModal,
	closeModal,
}

defineExpose(modalInterface)
</script>

<template>
	<DsfrModal
		title="Relancer l'extraction"
		:opened="isRelaunchModalOpened"
		@close="closeModal"
	>
		<p class="fr-text--sm fr-mb-2w">
			Sélectionnez une options
		</p>

		<DsfrRadioButtonSet
			v-model="selectedAction"
			name="relaunch-extraction-option"
			:options="relaunchOptions"
		/>

		<template #footer>
			<div class="modal-actions">
				<DsfrButton
					secondary
					@click="closeModal"
				>
					Annuler
				</DsfrButton>
				<DsfrButton
					:disabled="!selectedAction"
					@click="relaunchExtraction"
				>
					Relancer l'extraction
				</DsfrButton>
			</div>
		</template>
	</DsfrModal>
</template>

<style scoped>
.modal-actions {
	display: flex;
	justify-content: flex-end;
	gap: 0.75rem;
	width: 100%;
}
</style>

<script setup lang="ts">
import { useCreateExtractionStore } from '@/stores/createExtractionStore'
import { useMapStore } from '@/stores/mapStore'
import Overlay from 'ol/Overlay'
import type VectorLayer from 'ol/layer/Vector'
import Select, { type SelectEvent } from 'ol/interaction/Select'
import { unByKey } from 'ol/Observable'
import type { EventsKey } from 'ol/events'

const props = withDefaults(defineProps<{
	mapId?: string
	vectorLayer?: VectorLayer | null
}>(), {
	mapId: 'mainMap',
	vectorLayer: null
})

const mapStore = useMapStore()
const createExtractionStore = useCreateExtractionStore()

const map = computed(() => mapStore.getMapRef(props.mapId))
const popupElement = ref<HTMLElement | null>(null)
const popupOverlay = shallowRef<Overlay | null>(null)
const selectInteraction = shallowRef<Select | null>(null)
let selectListener: EventsKey | null = null

function closePopup() {
	popupOverlay.value?.setPosition(undefined)
	selectInteraction.value?.getFeatures().clear()
}

function removeFeatures() {
	// getArray() renvoie le tableau interne : on le clone avant que closePopup() ne le vide.
	const features = [...(selectInteraction.value?.getFeatures().getArray() ?? [])]
	closePopup()
	createExtractionStore.removeFeatures(() => map.value?.value, features, props.vectorLayer ?? undefined)
}

function handleSelect(event: SelectEvent) {
	if (!event.selected.length || !event.mapBrowserEvent) {
		closePopup()
		return
	}

	popupOverlay.value?.setPosition(event.mapBrowserEvent.coordinate)
}

function removeInteraction(currentMap = map.value?.value) {
	if (selectListener) {
		unByKey(selectListener)
		selectListener = null
	}

	if (currentMap && selectInteraction.value) {
		currentMap.removeInteraction(selectInteraction.value)
	}

	if (currentMap && popupOverlay.value) {
		currentMap.removeOverlay(popupOverlay.value)
	}

	popupOverlay.value = null
	selectInteraction.value = null
}

watch(
	() => [map.value?.value, props.vectorLayer, popupElement.value] as const,
	(currentValue, previousValue) => {
		const currentMap = currentValue?.[0]
		const extentLayer = currentValue?.[1] as VectorLayer | null | undefined
		const currentPopupElement = currentValue?.[2]
		const previousMap = previousValue?.[0]

		removeInteraction(previousMap)

		if (!currentMap || !extentLayer || !currentPopupElement) {
			return
		}

		popupOverlay.value = new Overlay({
			element: currentPopupElement,
			positioning: 'bottom-center'
		})
		currentMap.addOverlay(popupOverlay.value)

		selectInteraction.value = new Select({
			layers: [extentLayer],
			style: null,
			hitTolerance: 5
		})
		selectListener = selectInteraction.value.on('select', handleSelect)
		currentMap.addInteraction(selectInteraction.value)
	},
	{ immediate: true }
)

onUnmounted(() => {
	removeInteraction()
})
</script>

<template>
	<div>
		<div
			ref="popupElement"
			class="GPSearchPopup"
		>
			<div class="GPButtonGroups gpf-btns-group">
				<DsfrButton
					icon="fr-icon-close-line"
					icon-only
					tertiary
					no-outline
					label="Fermer la pop-up"
					@click="closePopup"
				/>
				<DsfrButton
					icon="fr-icon-delete-line"
					icon-only
					tertiary
					no-outline
					label="Supprimer l'emprise"
					@click="removeFeatures"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.GPSearchPopup {
  width: auto;
}
</style>
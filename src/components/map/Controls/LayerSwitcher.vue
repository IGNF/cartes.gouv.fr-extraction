<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import { useMapStore } from '@/stores/mapStore'
import { LayerSwitcher } from 'geopf-extensions-openlayers'

const props = defineProps({
  mapId: {
    type: String,
    default: 'mainMap'
  },
  visibility: Boolean,
  layerSwitcherOptions: {
    type: Object,
    default: () => ({})
  }
})

const log = useLogger()
const mapStore = useMapStore()
const map = computed(() => mapStore.getMapRef(props.mapId)?.value)
const layerSwitcher = shallowRef(new LayerSwitcher({ options: props.layerSwitcherOptions }))
let stopWatching

onMounted(() => {
  stopWatching = watch(
    [map, () => props.visibility],
    ([currentMap, visible], _, onCleanup) => {
      if (!currentMap || !visible) return

      log.debug('add LayerSwitcher Control')
      currentMap.addControl(layerSwitcher.value)
      onCleanup(() => currentMap.removeControl(layerSwitcher.value))
    },
    { immediate: true }
  )
})

onUnmounted(() => stopWatching?.())
</script>

<template>
  <div />
</template>

<style>
/* Le DOM généré par OpenLayers ne reçoit pas les attributs scoped de Vue. */
/* Dimensions du bouton DSFR de LayerImport : icône 24px + padding horizontal 16px. */
div[id^="GPlayerSwitcher-"] > button[id^="GPshowLayersListPicto"] {
  width: 48px;
  height: 48px;
}

[id^="GPlayerSwitcher-"] button:is([class^="fr-icon-"], [class*=" fr-icon-"])::after {
  content: none;
}

button[id^="GPremove_"] {
  display: none;
}

</style>
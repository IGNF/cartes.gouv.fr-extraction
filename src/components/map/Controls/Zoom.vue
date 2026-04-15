<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import { useMapStore } from '@/stores/mapStore'
import {
  GeoportalZoom
} from 'geopf-extensions-openlayers'

// FIXME
// tracker Eulerian !?

const props = defineProps({
  mapId: {
    type: String,
    default: 'mainMap'
  },
  visibility: Boolean,
  analytic: Boolean,
  zoomOptions: Object
})

const log = useLogger()
const store = useMapStore()
const map = computed(() => store.getMapRef(props.mapId))
const zoom = ref(new GeoportalZoom(props.zoomOptions))

onMounted(() => {
  watch(
    () => map.value,
    (currentMap) => {
      if (currentMap && props.visibility) {
        log.debug("add Zoom Control")
        currentMap.value.addControl(zoom.value)
        zoom.value.on('zoom:in', onClickZoomIn)
        zoom.value.on('zoom:out', onClickZoomOut)
      }
    },
    { immediate: true }
  )
})

function onClickZoomIn (e) {
  log.debug(e)
}

function onClickZoomOut (e) {
  log.debug(e)
}
</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

// zoom: 2 boutons pour un seul controle
.ol-custom-zoom {
  height: $widget-btn-size * 2;
}
.ol-custom-zoom-in,
.ol-custom-zoom-out {
  height: 50%;

  // supprime tooltip
  &::before {
    content: none !important;
  }
}
</style>

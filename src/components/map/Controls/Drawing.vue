<script lang="js">
  /**
   * @description
   * ...
   * @listens emitter#drawing:open:clicked
   */
  export default {
    name: 'Drawing'
  };
</script>

<script setup lang="js">
import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from '@/stores/mapStore';


import { 
  Drawing,
} from 'geopf-extensions-openlayers';


const mapStore = useMapStore();
const log = useLogger();

const props = defineProps({
  mapId: {
    type: String,
    default: 'mainMap'
  },
  visibility: Boolean,
  analytic: Boolean,
  drawingOptions: {
    type: Object,
    default: () => ({})
  }
});

const map = computed(() => mapStore.getMapRef(props.mapId))
const drawing = ref(new Drawing(props.drawingOptions));

onMounted(() => {
  watch(
    () => map.value,
    (currentMap) => {
      if (currentMap && props.visibility) {
        currentMap.value.addControl(drawing.value);
        log.debug("Drawing - mounted and control added to map");
      }
    },
    { immediate: true }
  )
})
</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

// gp-label-div/gp-styling-div sont les sous-panel de "annoter la carte"
// positionne au même endroit qu'un panel de gauche
// .ol-overlay-container:has(.gp-label-div),
// .ol-overlay-container:has(.gp-styling-div) {
//   z-index: 4;
//   transform: none !important;
//   top: $gap;
//   left: $widget-panel-x;

//   @include max(sm) {
//     top: 0;
//     left: 0;

//     .gp-label-div,
//     .gp-styling-div {
//       width: 100vw;
//     }
//   }
// }
// .gp-label-div,
// .gp-styling-div {
//   transform: none;
// }
</style>

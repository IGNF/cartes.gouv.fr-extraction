<script lang="js">
  /**
   * @description
   * ...
   * @listens emitter#layerimport:open:clicked
   */
  export default {
    name: 'LayerImport'
  };
</script>

<script setup lang="js">
import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from '@/stores/mapStore';

import {
  LayerImport
} from 'geopf-extensions-openlayers'


// Ces injections sont optionnelles (ex: route embed sans modales).

const props = defineProps({
  mapId: {
    type: String,
    default: 'mainMap'
  },
  visibility: Boolean,
  analytic: Boolean,
  layerImportOptions: {
    type: Object,
    default: () => ({})
  }
});

const mapStore = useMapStore();
const log = useLogger();

const map = computed(() => mapStore.getMapRef(props.mapId))
const layerImport = ref(new LayerImport(props.layerImportOptions));

onMounted(() => {
  watch(
    () => map.value,
    (currentMap) => {
      if (currentMap && props.visibility) {
        currentMap.value.addControl(layerImport.value);
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
// le widget est intégré dans le container gauche
// mais le bouton est caché (car intégré dans menus gauche et droite)
.position-container-top-left .gpf-btn-icon[id^=GPshowImportPicto-] {
  display: none;
}
</style>

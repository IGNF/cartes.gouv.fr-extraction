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
import { useCreateExtractionStore } from '@/stores/createExtractionStore';

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
const createExtractionStore = useCreateExtractionStore();
const log = useLogger();

const map = computed(() => mapStore.getMapRef(props.mapId))
const handleAddVectorLayer = (event) => createExtractionStore.handleAddVectorLayer(() => map.value?.value, event.layer)
const layerImport = ref(new LayerImport(props.layerImportOptions));

const handleMapboxAdded = (event) => {
  log.debug('MapBox layer added:', event);
};

const handleServiceAdded = (event) => {
  log.debug('Service layer added:', event);
};

const handleEditorLoaded = (event) => {
  log.debug('Editor loaded:', event);
};

const handleRenderSuccess = (event) => {
  log.debug('Render success:', event);
};

const handleRenderFailure = (event) => {
  log.debug('Render failure:', event);
};

onMounted(() => {
  // Add event listeners
  layerImport.value.addEventListener('layerimport:vector:added', handleAddVectorLayer);
  layerImport.value.addEventListener('layerimport:mapbox:added', handleMapboxAdded);
  layerImport.value.addEventListener('layerimport:service:added', handleServiceAdded);
  layerImport.value.addEventListener('editor:loaded', handleEditorLoaded);
  layerImport.value.addEventListener('render:success', handleRenderSuccess);
  layerImport.value.addEventListener('render:failure', handleRenderFailure);

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

onUnmounted(() => {
  // Remove event listeners on component unmount
  const element = layerImport.value;
  element.removeEventListener('layerimport:vector:added', handleAddVectorLayer);
  element.removeEventListener('layerimport:mapbox:added', handleMapboxAdded);
  element.removeEventListener('layerimport:service:added', handleServiceAdded);
  element.removeEventListener('editor:loaded', handleEditorLoaded);
  element.removeEventListener('render:success', handleRenderSuccess);
  element.removeEventListener('render:failure', handleRenderFailure);
})
</script>

<template>
  <div />
</template>

<style lang="scss">
// le widget est intégré dans le container gauche
// mais le bouton est caché (car intégré dans menus gauche et droite)

form[id^='GPimportForm-'] {
  margin-bottom: 0;
  overflow: hidden;
}

button.GPButton.fr-icon-delete-line::after {
  content: none;
}

button.GPButton.fr-icon-close-line::after {
  content: none;
}
</style>

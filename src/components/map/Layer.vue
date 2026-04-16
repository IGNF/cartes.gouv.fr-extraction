<script setup lang="js">
import { useLogger } from "vue-logger-plugin";
import { useMapStore } from "@/stores/mapStore";
import { DEFAULT_CONF } from "@/composables/getLayerDefaultConf.js";
import { 
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geopf-extensions-openlayers';

import { 
  createVectorLayer, 
  createServiceLayer,
  createMapBoxLayer,
  createComputeLayer
} from '@/features/layer.js';

const log = useLogger();

// lib notification

const props = defineProps({
  layerOptions: {
    type: Object,
    default: () => ({})
  },
  mapId: {
    type: String,
    default: 'mainMap'
  }
});

const mapStore = useMapStore();
const emit = defineEmits(['mounted', 'unmounted']);

const map = computed(() => mapStore.getMapRef(props.mapId))

let layer = null;

function mountLayerIfReady() {
  let currentMap = mapStore.getMapRef(props.mapId);
  if (!map.value || layer) return;

  // les options sont obligatoires pour configurer une couche
  if (!props.layerOptions || Object.keys(props.layerOptions).length === 0) return;

  const service = props.layerOptions.service;
  const name = props.layerOptions.name;
  const position = props.layerOptions.position;

  if (name && service) {
    const options = {
      position: props.layerOptions.position,
      visible: props.layerOptions.visible,
      opacity: props.layerOptions.opacity,
      grayscale: props.layerOptions.grayscale,
      sourceParams: { crossOrigin: "anonymous" },
    };

    const preload = {
      preload: Infinity,
      cacheSize: 1024,
    };

    switch (service) {
      case "WMS":
        layer = new GeoportalWMS({
          layer: name,
          configuration: DEFAULT_CONF,
          apiKey: "entree-carto",
          olParams: Object.assign(options, preload),
        });
        break;
      case "WMTS":
        layer = new GeoportalWMTS({
          layer: name,
          configuration: DEFAULT_CONF,
          apiKey: "entree-carto",
          olParams: Object.assign(options, preload),
        });
        break;
      case "TMS":
        options.declutter = true;
        options.styleName = props.layerOptions.style || "default";
        layer = new GeoportalMapBox(
          {
            layer: name,
            style: props.layerOptions.style,
            configuration: DEFAULT_CONF,
            apiKey: "entree-carto",
          },
          options
        );
        break;
      default:
        break;
    }

    if (layer) {
      if (position !== layer.getZIndex() && Number(position) !== -1) {
        layer.setZIndex(Number(position));
      }
      currentMap.value.addLayer(layer);
      log.debug("Add Layer : ", name, " to map : ", props.mapId)
      emit("mounted");
    }
  }
}

onMounted(() => {
  watch(
    () => map.value,
    (currentMap) => {
      if (currentMap) {
        mountLayerIfReady();
      }
    },
    { immediate: true }
  );
});

</script>

<template>
  <div>
    <slot />
  </div>
</template>

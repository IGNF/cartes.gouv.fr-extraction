<script setup lang="js">
import { useLogger } from "vue-logger-plugin";
import { useMapStore } from "@/stores/mapStore";
import { getDefaultWmtsConfig } from "@/composables/getLayerDefaultConf.js";
import { 
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geopf-extensions-openlayers';

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
  },
  gpfLayerName: {
    type: String,
    default: undefined
  }
});

const mapStore = useMapStore();
const emit = defineEmits(['mounted', 'unmounted']);

const map = computed(() => mapStore.getMapRef(props.mapId))

let layer = null;

function mountLayerIfReady() {
  let currentMap = mapStore.getMapRef(props.mapId);
  if (!map.value || layer) return;

  const layerName = props.gpfLayerName || props.layerOptions.name;
  if (!layerName) return;

  const configuration = getDefaultWmtsConfig(layerName);
  const layerOptions = { ...configuration, ...props.layerOptions };
  const service = layerOptions.service;
  const name = props.layerOptions.name || layerName;
  const position = layerOptions.position;

  if (name && service) {
    const options = {
      position,
      visible: layerOptions.visible,
      opacity: layerOptions.opacity,
      grayscale: layerOptions.grayscale,
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
          configuration,
          apiKey: "entree-carto",
          olParams: Object.assign(options, preload),
        });
        break;
      case "WMTS":
        layer = new GeoportalWMTS({
          layer: name,
          configuration,
          apiKey: "entree-carto",
          olParams: Object.assign(options, preload),
        });
        break;
      case "TMS":
        options.declutter = true;
        options.styleName = layerOptions.style || "default";
        layer = new GeoportalMapBox(
          {
            layer: name,
            style: layerOptions.style,
            configuration,
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

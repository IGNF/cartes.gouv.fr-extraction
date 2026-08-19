<script setup lang="js">
import { useLogger } from "vue-logger-plugin";
import { useMapStore } from "@/stores/mapStore";
import { layerImportOptions } from "@/composables/getDefaultControlOptions.js";
import VectorSource from "ol/source/Vector";
import OpenLayersVectorLayer from "ol/layer/Vector";

const props = defineProps({
  sourceOptions: {
    type: Object,
    default: () => ({})
  },
  layerOptions: {
    type: Object,
    default: () => ({})
  },
  mapId: {
    type: String,
    default: "mainMap"
  }
});

const mapStore = useMapStore();
const log = useLogger();
const emit = defineEmits(["mounted", "unmounted"]);

const map = computed(() => mapStore.getMapRef(props.mapId));

let vectorLayer = null;

function removeLayer() {
  const currentMap = map.value?.value;
  if (currentMap && vectorLayer) {
    currentMap.removeLayer(vectorLayer);
    emit("unmounted");
  }
  vectorLayer = null;
}

function mountLayer() {
  const currentMap = map.value?.value;
  if (!currentMap) return;

  const source = new VectorSource(props.sourceOptions || {});
  const defaultGeoJsonStyle = layerImportOptions.vectorStyleOptions?.GeoJSON?.defaultStyle;
  vectorLayer = new OpenLayersVectorLayer({
    source,
    ...(props.layerOptions || {}),
    style: defaultGeoJsonStyle,
  });

  currentMap.addLayer(vectorLayer);
  log.debug("Add VectorLayer to map : ", props.mapId);
  emit("mounted");
}

watch(
  () => [map.value?.value, props.sourceOptions, props.layerOptions],
  () => {
    removeLayer();
    mountLayer();
  },
  { immediate: true, deep: true }
);

onUnmounted(() => {
  removeLayer();
});
</script>

<template>
  <div>
    <slot />
  </div>
</template>

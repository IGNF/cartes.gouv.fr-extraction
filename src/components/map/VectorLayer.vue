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

const vectorLayer = shallowRef(null);

function removeLayer() {
  const currentMap = map.value?.value;
  if (currentMap && vectorLayer.value) {
    currentMap.removeLayer(vectorLayer.value);
    emit("unmounted");
  }
  vectorLayer.value = null;
}

function mountLayer() {
  const currentMap = map.value?.value;
  if (!currentMap) return;

  const source = new VectorSource(props.sourceOptions || {});
  const defaultGeoJsonStyle = layerImportOptions.vectorStyleOptions?.GeoJSON?.defaultStyle;
  vectorLayer.value = new OpenLayersVectorLayer({
    source,
    ...(props.layerOptions || {}),
    style: defaultGeoJsonStyle,
  });

  if (!currentMap.getLayers().getArray().includes(vectorLayer.value)) {
    currentMap.addLayer(vectorLayer.value);
  }
  log.debug("Add VectorLayer to map : ", props.mapId);
  emit("mounted", vectorLayer.value);
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
    <slot :vector-layer="vectorLayer" />
  </div>
</template>

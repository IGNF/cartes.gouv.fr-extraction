<script setup lang="ts">
import Zoom from "@/components/map/Controls/Zoom.vue";
import LayerSwitcher from "@/components/map/Controls/LayerSwitcher.vue";
import { layerSwitcherOptions, zoomOptions } from "@/composables/getDefaultControlOptions.js";
import { sqlMap } from "@/composables/mapkeys.js";
import { useCreateExtractionStore } from "@/stores/createExtractionStore";
import { DEFAULT_GEOJSON_SRS, DEFAULT_MAP_SRS } from "@/composables/useMapConstants";
import GeoJSON, { type GeoJSONObject } from "ol/format/GeoJSON";
import { Fill, Stroke, Style } from "ol/style";
import { useLogger } from "vue-logger-plugin";

const props = defineProps<{
  extent?: GeoJSONObject | null
}>()

const geoJsonFormat = new GeoJSON()
const extractibleSourceOptions = computed(() => {
  if (!props.extent) return null

  return {
    features: geoJsonFormat.readFeatures(props.extent, {
      dataProjection: DEFAULT_GEOJSON_SRS,
      featureProjection: DEFAULT_MAP_SRS,
    }),
  }
})
const extractibleLayerOptions = {
  style: new Style({
    stroke: new Stroke({ color: 'red', width: 2 }),
    fill: new Fill({ color: 'rgba(255, 0, 0, 0.2)' }),
  }),
}

const createExtractionStore = useCreateExtractionStore()
const log = useLogger();

onMounted(() => {
  log.debug("CreateExtraction - ChooseArea mounted")
});
</script>
<template>
    <Map 
        class="map" 
        :map-id="sqlMap">
        <Layer  
            :map-id="sqlMap" 
            gpf-layer-name="ORTHOIMAGERY.ORTHOPHOTOS"
        />
        <Layer  
            gpf-layer-name="GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2"
            :map-id="sqlMap"
        />
        <VectorLayer
          v-if="extractibleSourceOptions"
          :map-id="sqlMap"
          :source-options="extractibleSourceOptions"
          :layer-options="extractibleLayerOptions"
        />
        <VectorLayer
          v-if="createExtractionStore.extentSourceOptions"
          :map-id="sqlMap"
          :source-options="createExtractionStore.extentSourceOptions"
          :layer-options="createExtractionStore.extentLayerOptions"
        />
        <Controls
            :map-id="sqlMap" 
        >
            <LayerSwitcher
              visibility
              :layer-switcher-options="layerSwitcherOptions"
              :map-id="sqlMap"
            />
            <Zoom
              visibility
              :zoom-options="zoomOptions"
              :map-id="sqlMap"
             />
        </Controls>
    </Map>
</template>
<style scoped> 
.map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

<script setup lang="ts">
import { drawingOptions, layerImportOptions, zoomOptions, searchEngineOptions } from "@/composables/getDefaultControlOptions.js";
import ExtentInteraction from "@/components/map/Interactions/extentInteraction.vue";
import { mainMap } from "@/composables/mapkeys.js";
import { useCreateExtractionStore } from "@/stores/createExtractionStore";
import { useMapStore } from "@/stores/mapStore";
import { useLogger } from "vue-logger-plugin";

const mapStore = useMapStore()
const createExtractionStore = useCreateExtractionStore()
const log = useLogger();
const DEFAULT_LAYER2 = {
  name: "PLAN.IGN",
  service: "TMS", // issu de serviceParams.id = "GPP:TMS" -> split(":")[1]
  key: "PLAN.IGN$GEOPORTAIL:GPP:TMS",
  position: -1,
  opacity: 1,
  visible: true,
  grayscale: false
};
const DEFAULT_LAYER = {
  name: "ORTHOIMAGERY.ORTHOPHOTOS",
  service: "WMTS", // issu de serviceParams.id = "OGC:WMTS" -> split(":")[1]
  key: "ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS",
  position: -1,
  opacity: 1,
  visible: true,
  grayscale: false
};


onMounted(() => {
  log.debug("CreateExtraction - ChooseArea mounted")
});
</script>
<template>
    <Map 
        class="map map-container" 
        :map-id="mainMap">
        <View
          :map-id="mainMap"
          :center="mapStore.center"
          :zoom="mapStore.zoom"
        />
        <Layer  
            key="mainMap" 
            :layerOptions="DEFAULT_LAYER"
            :map-id="mainMap"
        />
        <VectorLayer
          v-if="createExtractionStore.extentSourceOptions"
          :map-id="mainMap"
          :source-options="createExtractionStore.extentSourceOptions"
          :layer-options="createExtractionStore.extentLayerOptions"
        >
          <template #default="{ vectorLayer }">
            <ExtentInteraction
              :map-id="mainMap"
              :vector-layer="vectorLayer"
            />
          </template>
        </VectorLayer>
        <Controls
          :map-id="mainMap" 
        >
            <!-- <Drawing
              visibility
              :drawing-options="drawingOptions"
              :map-id="mainMap"
            /> -->

            <LayerImport
              visibility
              :layer-import-options="layerImportOptions"
              :map-id="mainMap"
            />
            <Zoom
              visibility
              :zoom-options="zoomOptions"
              :map-id="mainMap"
            />
            <SearchEngine
              visibility
              :search-engine-options="searchEngineOptions"
              :map-id="mainMap"
            />
        </Controls>
    </Map>
</template>
<style scoped> 
.map-container {
  margin-top: 2rem;
  border: 1px solid var(--light-decisions-border-border-default-grey, #DDD);
  width: 100%;
  height: 50vh;
  position: relative;
}
</style>



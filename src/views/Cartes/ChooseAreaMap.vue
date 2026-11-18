
<script setup lang="ts">
import { drawingOptions, layerImportOptions, layerSwitcherOptions, zoomOptions, searchEngineOptions } from "@/composables/getDefaultControlOptions.js";
import ExtentInteraction from "@/components/map/Interactions/extentInteraction.vue";
import LayerSwitcher from "@/components/map/Controls/LayerSwitcher.vue";
import { mainMap } from "@/composables/mapkeys.js";
import { useCreateExtractionStore } from "@/stores/createExtractionStore";
import { useMapStore } from "@/stores/mapStore";
import { useLogger } from "vue-logger-plugin";

const mapStore = useMapStore()
const createExtractionStore = useCreateExtractionStore()
const log = useLogger();


onMounted(() => {
  log.debug("CreateExtraction - ChooseArea mounted")
});
</script>
<template>
    <Map 
        class="map map-container" 
        :map-id="mainMap">
        <!-- <View
          :map-id="mainMap"
          :center="mapStore.center"
          :zoom="mapStore.zoom"
        /> -->
        <Layer  
            key="layer1" 
            gpf-layer-name="ORTHOIMAGERY.ORTHOPHOTOS"
            :map-id="mainMap"
        />
        <Layer  
            key="layer2" 
            gpf-layer-name="GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2"
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
            <LayerSwitcher
              visibility
              :layer-switcher-options="layerSwitcherOptions"
              :map-id="mainMap"
            />
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
            <ResetExtentControl
              visibility
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
  height: 60vh;
  position: relative;
}
</style>



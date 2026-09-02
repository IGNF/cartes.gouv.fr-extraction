<script setup lang="ts">
import Zoom from "@/components/map/Controls/Zoom.vue";
import { zoomOptions } from "@/composables/getDefaultControlOptions.js";
import { sqlMap } from "@/composables/mapkeys.js";
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
        class="map" 
        :map-id="sqlMap">
        <!-- <View
          :map-id="sqlMap"
          :center="mapStore.center"
          :zoom="mapStore.zoom"
        /> -->
        <Layer  
            :map-id="sqlMap" 
            :layerOptions="DEFAULT_LAYER"
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
  min-height: 600px;
  position: relative;
}
</style>
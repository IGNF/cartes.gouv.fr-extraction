<script lang="js">
  /**
   * @description
   * 
   * @property { Number } zoom niveau de zoom à l'initialisation de la view Openlayer
   * @property { Array } center tableau des coordonnées du centre de la carte à l'initialisation de la view Openlayer
   * 
   */
  export default {
    name: 'View'
  };
</script>

<script setup lang="js">
import View from 'ol/View';
import {
  toLonLat as toLonLatProj,
  fromLonLat as fromLonLatProj
} from "ol/proj";

import { useMapStore } from "@/stores/mapStore";
import { mainMap } from "@/composables/mapkeys";
import { DEFAULT_MAP_SRS } from '@/composables/useMapConstants';
import { useLogger } from "vue-logger-plugin";

const log = useLogger();

const mapStore = useMapStore();

const props = defineProps({
  zoom : Number,
  center : Array,
  mapId: {
    type: String,
    default: 'mainMap'
  }
});

const maps = mapStore.maps;
const map = computed(() => {
  maps;
  return mapStore.getMapRef(props.mapId);
})
/**
 * creation de la vue
 */
const view = new View({ 
  zoom: props.zoom, 
  center: fromLonLatProj(props.center),
  minZoom : 0,
  maxZoom : 21,
  projection : DEFAULT_MAP_SRS
});

/**
 * abonnement à l'evenement 'change:center' de la vue
 * pour mise à jour du centre de la carte
 */
view.on("change:center", (e) => {
  if (props.mapId == mainMap) {
    mapStore.x = e.target.getCenter()[0];
    mapStore.y = e.target.getCenter()[1];

    var coordinate = toLonLatProj(e.target.getCenter());
    mapStore.lon = coordinate[0];
    mapStore.lat = coordinate[1];
  }
})

/**
 * abonnement à l'evenement 'change:resolution' de la vue
 * pour mise à jour du zoom de la carte
 */
view.on("change:resolution", (e) => {
  mapStore.zoom = view.getZoom();
})

onMounted(() => {
  watch(
    () => map.value,
    (currentMap) => {
      if (currentMap && currentMap.value) {
        currentMap.value.setView(view);
      }
    },
    { immediate: true }
  )
});

</script>

<template></template>

<style scoped></style>
<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from '@/stores/mapStore';
import { useCreateExtractionStore } from '@/stores/createExtractionStore';

import { shallowRef } from 'vue';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

import {
  toLonLat as toLonLatProj,
} from "ol/proj";

import {
    SearchEngineAdvanced,
    InseeAdvancedSearch,
    LocationAdvancedSearch,
    CoordinateAdvancedSearch,
    ParcelAdvancedSearch
} from 'geopf-extensions-openlayers';


// FIXME
// choisir où placer le tracker Eulerian sur ce widget !

const props = defineProps({
  mapId: {
    type: String,
    default: 'mainMap'
  },
  visibility: Boolean,
  analytic: Boolean,
  searchEngineOptions: {
    type: Object,
    default: () => ({})
  }
});

const log = useLogger();
const mapStore = useMapStore();
const createExtractionStore = useCreateExtractionStore();

const map = computed(() => mapStore.getMapRef(props.mapId))

const insee = ref(new InseeAdvancedSearch());
const location = ref(new LocationAdvancedSearch());
const coordinates = ref(new CoordinateAdvancedSearch());
const parcels = ref(new ParcelAdvancedSearch());

const addExtentLayer = (feature) => {
  log.debug("SearchEngineAdvanced - addExtentLayer", feature);

  const geometry = feature?.getGeometry?.();
  if (!geometry) {
    log.warn('SearchEngineAdvanced - addExtentLayer called without valid feature geometry');
    return;
  }

  // Clone le feature pour éviter toute mutation partagée avec le widget.
  const extentFeature = feature.clone();
  const layer = new VectorLayer({
    source: new VectorSource({ features: [extentFeature] }),
    visible: true,
    opacity: 1,
    zIndex: 1000,
  });
  console.log("Adding extent layer:", layer);
  createExtractionStore.handleAddVectorLayer(() => map.value?.value, layer);

  const currentMap = map.value?.value;
  if (!currentMap) {
    return;
  }

  // Supprime la feature d'origine du widget de recherche après duplication.
  currentMap.getLayers().forEach((mapLayer) => {
    const source = mapLayer?.getSource?.();
    if (!source?.hasFeature?.(feature)) {
      return;
    }

    source.removeFeature(feature);
  });

  // Ferme la popup et supprime le marqueur de recherche.
  document.getElementById("delete-search-geometry")?.click();
}

const advancedSearchEngineOptions = computed(() => {
    return Object.assign(
      {}, 
      props.searchEngineOptions, 
      {
        advancedSearch : [
          insee.value,
          location.value,
          coordinates.value,
          parcels.value
        ]
      },
      {
        popupButtons : [
                        {
                            label: "Fermer la popup",
                            icon: "fr-icon-close-line",
                            attributes: {
                                id: "delete-search-geometry",
                            },
                            onClick: function (feature) {
                                // true => suppression de la feature + fermeture de la popup
                                return true;
                            }
                        },
                        {
                            label : "Choisir comme emprise",
                            className : "custom-button",
                            icon : "fr-icon-map-pin-add-line",
                            attributes : {
                                "data-action" : "add-feature",
                            },
                            onClick : addExtentLayer
                        }
                      ]
      }
    )
});

// const searchEngineAdvanced = ref(markRaw(new SearchEngineAdvanced(advancedSearchEngineOptions.value)));
const searchEngineAdvanced = shallowRef(new SearchEngineAdvanced(advancedSearchEngineOptions.value));

onMounted(() => {
  watch(
    () => map.value,
    (currentMap) => {
      if (currentMap && props.visibility) {
        currentMap.value.addControl(searchEngineAdvanced.value);
        searchEngineAdvanced.value.on("searchengine:search:click", onClickSearch);
        searchEngineAdvanced.value.on("searchengine:autocomplete:click", onClickAutocompletResult);
        searchEngineAdvanced.value.on("searchengine:geocode:click", onClickGeocodeResult);
        searchEngineAdvanced.value.on("searchengine:coordinates:click", onClickSeachByCoordinates);
        searchEngineAdvanced.value.on("searchengine:geolocation:click", onClickSearchGeolocationOpen);
        searchEngineAdvanced.value.on("searchengine:geolocation:remove", onClickSearchGeolocationRemove);
        log.debug("SearchEngineAdvanced - mounted and control added to map");
      }
    },
    { immediate: true }
  )
})
/**
 * Gestionnaire d'evenement sur les abonnements
 */

const onClickSearch = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearch", e);
}
const onClickAutocompletResult = (e) => {
  log.debug("SearchEngineAdvanced - onClickAutocompletResult", e);
}
const onClickGeocodeResult = (e) => {
  log.debug("SearchEngineAdvanced - onClickGeocodeResult", e);
}
const onClickSeachByCoordinates = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearchByCoordinates", e);
}
const onClickSearchGeolocationOpen = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearchGeolocationOpen", e);
  // geolocalisation demandée :
  // on ajoute l'information dans le permalien...
  // on passe par le mapStore
  // on passe en geographique
  mapStore.geolocation = toLonLatProj(e.coordinates).toString();
  emitter.emit("searchengine:geolocation:clicked", e.coordinates);
}
const onClickSearchGeolocationRemove = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearchGeolocationRemove", e);
  // geolocalisation demandée :
  // on enlève l'information dans le permalien...
  // on passe par le mapStore
  mapStore.geolocation = "";
  emitter.emit("searchengine:geolocation:removed");
}

</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.gpf-widget[id^="GPsearchEngine-Advanced"] {
  left: $widget-panel-x - 5; // marge 5 interne
  box-shadow: none;

  .GPSearchBar .GPInputGroup,
  .GPSearchBar .GPInputGroup > input,
  button[id^="GPshowSearchEnginePicto-"].fr-btn {
    height: $widget-btn-size;
  }

  @include max(sm) {
    top: $gap;
    left: $gap - 5; // 5 interne
    max-width: calc(100% - 6px); // 6px un peu magique

    &:has(.GPSearchEngine-advanced-btn[aria-expanded="true"]) {
      z-index: 4;
    }
  }
}

// empeche le retrecissement dans un contexte flex
// et fixe la largeur min
.GPsearchInputSubmit {
  flex: 0 0 $widget-btn-size;
}
// centre l'icone
.GPsearchInputSubmit::before {
  margin: 0 auto !important;
}

button[aria-label="Fermer la pop-up"], button[aria-label="Supprimer le marqueur"] {
  display: none;
}
</style>

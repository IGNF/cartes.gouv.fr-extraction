<script lang="js">
/**
* @description
* Initialisation de la carte OpenLayer
*
*/
export default {
  name: 'Map'
};
</script>

<script setup lang="js">
import { CRS } from 'geopf-extensions-openlayers'

import Map from 'ol/Map'
import View from 'ol/View'
import {
    MouseWheelZoom,
    defaults as defaultInteractions
} from "ol/interaction";
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import {
  fromLonLat,
  toLonLat
} from 'ol/proj'
import { nextTick } from 'vue'
import {
    shiftKeyOnly as eventShiftKeyOnly
} from "ol/events/condition";

import { mainMap } from "@/composables/mapkeys"
import { useMapStore } from '@/stores/mapStore'
import { useLogger } from "vue-logger-plugin";

const mapStore = useMapStore()
const log = useLogger();

const props = defineProps({
  mapId: {
    type: String,
    default: 'mainMap'
  }
})

/**
* Reference (DOM)
*/
const mapRef = ref(null)

const view = new View({
  zoom: mapStore.zoom,
  center: fromLonLat([mapStore.lon, mapStore.lat]),
  minZoom: 0,
  maxZoom: 21,
  projection: 'EPSG:3857'
})

let skipStoreViewUpdate = false

watch(
  () => [mapStore.zoom, mapStore.lon, mapStore.lat],
  () => {
    if (skipStoreViewUpdate) {
      skipStoreViewUpdate = false
      return
    }

    view.setZoom(mapStore.zoom)
    view.setCenter(fromLonLat([mapStore.lon, mapStore.lat]))
  }
)

/**
* Map
* default controls are removed (rotate, zoom and attributions)
*/
const map = new Map({
  target: props.mapId,
  view,
  controls: [], // on supprime les contrôles par defaut !
  interactions : defaultInteractions().extend([
    new MouseWheelZoom({
      constrainResolution : true,
      condition : eventShiftKeyOnly
    })
  ]),
})

provide(props.mapId, map)

onMounted(() => {
  CRS.loadByDefault();
  map.setTarget(mapRef.value)
  
  const canvas = mapRef.value.getElementsByTagName('canvas')
  if (canvas.length) {
    canvas[0].tabIndex = 0
  }
  mapStore.setMap(props.mapId, map)
  map.on('moveend', () => {
    const view = map.getView()
    const center = view?.getCenter()

    if (!center) {
      return
    }

    const [longitude, latitude] = toLonLat(center)
    skipStoreViewUpdate = true
    mapStore.zoom = view.getZoom()
    mapStore.lon = longitude
    mapStore.lat = latitude
    nextTick(() => {
      skipStoreViewUpdate = false
    })
  })
  log.debug('Map mounted : ', props.mapId)
    const osmLayer = new TileLayer({
    source: new OSM(),
  })

  // map.addLayer(osmLayer)
})


onUnmounted(() => {

  mapStore.removeMap(props.mapId)
  log.debug('Map unmounted ', props.mapId)
})

/**
 *  To focus on map and activate keyboard control.
 *  Trigerred on mouse over
 */
const onFocusOnMap = () => {
  // Si le focus est actuellement sur une balise <input> ou <select> ou sur la barre de recherche dépliée, on ne change pas de focus
  var btn = document.querySelector("button[id^=GPSearchEngine-advanced-btn-]");
  if (document.activeElement.tagName !== "INPUT" && 
      document.activeElement.tagName !== "SELECT" && 
      (!btn || btn.getAttribute("aria-expanded") !== "true")) {
    mapRef.value.focus();
  }
}
  
const updateSize = () => {
  map.updateSize();
}
  
// on expose en publique la reference au DOM
defineExpose({
  mapRef,
  updateSize
});
</script>

<template>
  <div
    :id="mapId"
    class="map-container"
    ref="mapRef"
    tabindex="0"
    @mouseover="onFocusOnMap"
  >
      <slot />
  </div>
</template>

<style lang="scss">
@use "@/assets/variables" as *;
#mainMap {
  outline : none;
}

.map-container > :first-child {
  position: absolute;
  width: 100%;
  height: inherit;
}



// positionnement des conteneurs de widgets
.ol-overlaycontainer-stopevent {
  // evite de creer un stacking context (ce qui complexifie la superposition des menuwrapper)
  z-index: initial !important;
}
.position {
  z-index: 1;
  width: $widget-btn-size;
  height: calc(100% - $gap * 2);
  gap: $gap;
}
.position-container-top-left {
  top: $gap;
  left: $gap;
}
.position-container-top-right {
  top: $gap;
  right: $gap;
  // cree un containing block
  will-change: transform;
}
.position-container-bottom-left {
  bottom: $gap;
  left: $gap;
}
.position-container-bottom-right {
  z-index: 0;
  bottom: $gap;
  right: $gap;
}
@include max(sm) {
  .position {
    height: calc(100% - ($widget-btn-size + $gap * 3));
  }
  .position-container-top-left,
  .position-container-top-right {
    top: $widget-btn-size + $gap * 2;
  }
}
.gpf-widget-button {
  width: $widget-btn-size;
  padding: 0;
  box-shadow: var(--raised-shadow);
  border-radius: $widget-btn-radius;

  & > .gpf-btn-icon {
    width: $widget-btn-size;
    height: $widget-btn-size;
    padding: $widget-btn-padding;
    // supprime l'ombre
    filter: none;
    // cree l'effet du bouton
    @include widget-btn-style;
    // surclasse dsfr
    max-width: initial !important;
    max-height: initial !important;
  }
  &.gpf-button-no-gutter > .gpf-btn-icon {
    @include widget-btn-no-gutter-style;
  }
  & > .gpf-btn-icon:not(:disabled):hover {
    @include widget-btn-style-hover;
  }
  & > .gpf-btn-icon[aria-pressed="true"],
  & > .gpf-btn-icon[aria-pressed="true"]:not(:disabled):hover {
    @include widget-btn-style-active;
  }
  // supprime les traits active
  &:has(> .gpf-btn-icon[aria-pressed="true"])::after {
    content: none;
  }
}
// conteneur top-right
.position-container-top-right {
  // cree un espace vide au-dessus du 3e widget (pour insérer le controleur de widgets)
  .gpf-widget-button:nth-child(3) {
    margin-top: $widget-btn-size;
  }
  // enleve le border-radius (en haut)
  .gpf-widget-button:nth-child(3) .gpf-btn-icon {
    border-radius: 0;
  }
}
// tooltips: position
.position-container-top-right > .gpf-widget-button > .gpf-btn-icon[aria-label]:hover::before,
.position-container-bottom-right > .gpf-widget-button > .gpf-btn-icon[aria-label]:hover::before {
  transform: translate(-100%, $widget-btn-padding);
}
.position-container-top-left > .gpf-widget-button > .gpf-btn-icon[aria-label]:hover::before,
.position-container-bottom-left > .gpf-widget-button > .gpf-btn-icon[aria-label]:hover::before {
  transform: translate($widget-btn-size - $widget-btn-padding * 2, $widget-btn-padding);
}
// modales: au dessus quand active
.position:has(> .gpf-widget-button > .gpf-btn-icon[aria-pressed="true"]) {
  z-index: 2;

  // au dessus de tout en mobile
  @include max(sm) {
    z-index: 4;
  }
}
// tooltips: au-dessus quand hover
.position:has(> .gpf-widget-button > .gpf-btn-icon[aria-label]:hover) {
  z-index: 3;
}
// supprime tooltip si deja ouverte
.position > .gpf-widget-button > .gpf-btn-icon[aria-pressed="true"]:hover::before {
  content: none;
}
// alignements en hauteur des bouton no-gutter
.position-container-top-left .gpf-button-no-gutter,
.position-container-top-right .gpf-button-no-gutter {
  margin-bottom: -$gap;
}
// panels
.gpf-panel {
  position: absolute;
  top: 0 !important; // aligne par rapport a .position
  @include widget-panel-sizes;
  box-shadow: var(--raised-shadow);
}
.position-container-top-left .gpf-panel,
.position-container-bottom-left .gpf-panel {
  left: $widget-btn-size + $gap !important;
}
.position-container-top-right .gpf-panel,
.position-container-bottom-right .gpf-panel {
  right: $widget-btn-size + $gap !important;
}
.gpf-panel__body {
  max-height: calc(70vh) !important;
  max-height: calc(100cqb - $gap * 2) !important;
}
.gpf-panel__body_ls {
  max-height: initial !important;
}
.gpf-panel__content {
  overflow: auto;
}
@include max(sm) {
  .gpf-panel {
    max-width: 100vw !important;
    max-height: 100cqb !important;
  }
  .gpf-panel__body {
    max-height: 100cqb !important;
  }
  // selecteur a rallonge obligatoire pour surclasser le style
  .position .gpf-widget-button > button[aria-pressed] ~ dialog.gpf-panel {
    min-width: 0;
    right: -$gap !important;
    top: -($widget-btn-size + $gap * 2) !important; // au-dessus de la recherche
    width: 100vw !important;
  }
  :is(.position-container-top-left, .position-container-bottom-left) .gpf-widget-button > button[aria-pressed] ~ dialog.gpf-panel {
    right: auto !important;
    left: -$gap !important;
  }
}

/**
 *  gestion du nombre de widget en fonction de la hauteur
 */

// le widget GPcontrolList est caché par défaut (pas d'outils)
.gpf-widget[id^="GPcontrolList-"] {
  display: none;
}
// puis réaffiché si minimum 1 outil (n=3, apres catalog+layerswitcher)
.position-container-top-right > .gpf-widget-button:nth-child(3) ~ .gpf-widget-button[id^="GPcontrolList-"] {
  position: absolute !important;
  display: block;
  // le controlList est affiché tout en bas, sous la liste
  // --diff-widgets
  // si le nombre max (--nb-widgets) est plus grand que le nombre de widget (--count +1 car controlList)
  // alors, --diff-widgets > 0 et bottom = 9999px * n, sinon --diff-widgets = 0 et bottom = 0
  --diff-widgets: max(var(--nb-widgets) - var(--count) + 1, 0);
  bottom: calc(var(--diff-widgets) * 9999px) !important;
}

// on ajoute un border-radius sur l'avant dernier élément, a partir du 3e (celui avant controlList)
.position-container-top-right > .gpf-widget-button:nth-child(2) ~ .gpf-widget-button:nth-last-child(2) > .gpf-btn-icon {
  border-radius: 0 0 $widget-btn-radius $widget-btn-radius;
}

// on calcule la hauteur qui dépend du nombre d'outil (le minimum entre le nombre reel (count) et le nombre max (nb-widgets))
.position-container-top-right {
  --nb-widgets: 0;
  position: relative;
  height: calc((min(var(--count), var(--nb-widgets)) * $widget-btn-size) + ($widget-btn-size * 4) + ($gap * 2));
}

// on défini le nombre de widgets max en fonction de la hauteur de map
@container map (min-height: 500px) { .position-container-top-right { --nb-widgets: 0 } }
@container map (min-height: 550px) { .position-container-top-right { --nb-widgets: 2 } }
@container map (min-height: 600px) { .position-container-top-right { --nb-widgets: 3 } }
@container map (min-height: 650px) { .position-container-top-right { --nb-widgets: 4 } }
@container map (min-height: 700px) { .position-container-top-right { --nb-widgets: 5 } }
@container map (min-height: 750px) { .position-container-top-right { --nb-widgets: 6 } }
@container map (min-height: 850px) { .position-container-top-right { --nb-widgets: 8 } }
@container map (min-height: 900px) { .position-container-top-right { --nb-widgets: 10 } }
@container map (min-height: 950px) { .position-container-top-right { --nb-widgets: 20 } }

// creation des selecteurs pour 20 outils
@for $i from 1 through 20 {
  // defini la position du widget (i) (n=3 est le premier widget)
  .position-container-top-right > .gpf-widget-button:nth-child(#{$i + 2}) { --i: #{$i} }
  // defini le nombre total de widgets (count) (n=4 car controllist ne compte pas)
  .position-container-top-right:has(> .gpf-widget-button:nth-child(#{$i + 3})) { --count: #{$i} }
}

// on décale tous les widgets qui dépassent de la hauteur (pour les masquer)
.position-container-top-right > .gpf-widget-button:not([id^="GPcontrolList-"]) {
  margin-left: calc(max(var(--i) - var(--nb-widgets), 0) * 2in);
}
</style>

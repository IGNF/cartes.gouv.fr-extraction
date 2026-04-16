import { inject } from 'vue';
import {
  defineStore
} from 'pinia';

import { useLogger } from 'vue-logger-plugin';
import { useStorage } from '@vueuse/core';
import type Map from 'ol/Map';
import type { ShallowRef } from 'vue';

type MapInstance = Map;
type MapEntry = {
  id: string
  map: ShallowRef<MapInstance | null>
}
/**
 * Espace de noms des clefs du localStorage (persistantes)
 */
const NAMESPACE = "extraction";

const ns = ((value) => {
  return NAMESPACE + '.' + value;
});

const DEFAULT = {
  X: 289739.8968702704,
  Y: 5859851.607344459,
  LON: 2.602777, // informatif
  LAT: 46.493888, // informatif
  ZOOM: 6
};

/**
 * @description
 * Store des objets de la carte
 * 
 * Les clefs préfixées par "extraction" 
 * sont les paramètres utilisateurs :
 * 
 * - extraction.center --> webmercator
 * - extraction.zoom -> absolue !
 * - extraction.x --> webmercator
 * - extraction.y --> webmercator
 * - extraction.lon --> geographic
 * - extraction.lat --> geographic
 * @see useUrlParams
 */
export const useMapStore = defineStore('map', () => {
  const log = useLogger();
  /////////////
  // objet map
  /////////////
  const maps = shallowRef<MapEntry[]>([])

  var zoom = useStorage(ns('zoom'), DEFAULT.ZOOM);
  var x = useStorage(ns('x'), DEFAULT.X);
  var y = useStorage(ns('y'), DEFAULT.Y);
  var lon = useStorage(ns('lon'), DEFAULT.LON);
  var lat = useStorage(ns('lat'), DEFAULT.LAT);
  var center = computed(() => {
    return [lon.value.toFixed(6), lat.value.toFixed(6)];
  });
 

  localStorage.setItem(ns('center'), center.value.toString());

  watch(zoom, () => {
    localStorage.setItem(ns('zoom'), Math.round(zoom.value).toString());
  })
  watch(x, () => {
    localStorage.setItem(ns('x'), x.value.toString());
  })
  watch(y, () => {
    localStorage.setItem(ns('y'), y.value.toString());
  })
  watch(lon, () => {
    localStorage.setItem(ns('lon'), lon.value.toString());
  })
  watch(lat, () => {
    localStorage.setItem(ns('lat'), lat.value.toString());
  })
  watch(center, () => {
    localStorage.setItem(ns('center'), center.value.toString()); // string
  })

  //////////////////
  // getter/setter
  //////////////////

  // function setMap (m: Map) {
  //   console.log('Setting map in store')
  //   console.log(m)
  //   map.value = m;
  // }
  function setMap(id: string, instance: MapInstance) {
    log.debug("SetMAp : ", id)
    const existing = maps.value.find((e) => e.id === id)
    if (existing) {
      existing.map.value = instance
      triggerRef(maps)
      return
    }

    maps.value.push({
      id,
      map: shallowRef(instance),
    })
    triggerRef(maps)
  }

  function getMapRef(id: string): ShallowRef<MapInstance | null> | undefined {
    return maps.value.find((e) => e.id === id)?.map
  }

  function removeMap(id: string) {
    maps.value = maps.value.filter((e) => e.id !== id)
  }

  watch(maps, () => {
    console.log('Maps in store updated :')
    console.log(maps.value)
  })


  return {
    zoom,
    center,
    x,
    y,
    lon,
    lat,
    maps,
    setMap,
    getMapRef,
    removeMap
  }
})

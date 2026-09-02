import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ExtractionRequestBody } from '@/types/extractibles.types'
import type Map from 'ol/Map'
import type VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import VectorLayerImpl from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import type Geometry from 'ol/geom/Geometry'
import { getUid } from 'ol/util'
import { extractGeoJsonFromFilter } from '@/composables/Extractions/useExtractionExtent'

const geoJsonFormat = new GeoJSON()

export const useCreateExtractionStore = defineStore('createExtraction', () => {
  const selectedExtractibleID = ref<string | null>(null)
  const requestBody = ref<ExtractionRequestBody | undefined>(undefined)

  // Layer openlayers
  const extentLayer = shallowRef<VectorLayer | null>(null)

  /**
   *  DEBUT 
   *  Dérivés du ExtentLayer
   */
  const extent = computed(() => {
    if (!extentLayer.value) return null
    const source = extentLayer.value.getSource()
    if (!source) return null
    const sourceExtent = source.getExtent?.()
    if (!sourceExtent) return null
    return sourceExtent
  })

  // Options de la couche pour reconstruire la couche d'emprise à partir de l'état du store.
  const extentLayerOptions = computed(() => {
    if (!extentLayer.value) return {}

    return {
      visible: extentLayer.value.getVisible(),
      opacity: extentLayer.value.getOpacity(),
      style: extentLayer.value.getStyle() || undefined,
      zIndex: extentLayer.value.getZIndex()
    }
  })

  // Options de la source pour reconstruire la couche d'emprise à partir de l'état du store.
  const extentSourceOptions = computed(() => {
    if (!extentLayer.value) return null

    const source = extentLayer.value.getSource()
    if (!source) return null

    const features = source.getFeatures()
    if (!features.length) return null

    return {
      features: features.map((feature: any) => feature.clone())
    }
  })

  // Liste des géométries GeoJSON de l'emprise, transformées en EPSG:4326 pour l'export.
  const extentGeometries = computed<Record<string, unknown>[]>(() => {
    if (!extentLayer.value) return []

    const source = extentLayer.value.getSource()
    if (!source) return []

    const sourceProjection = source.getProjection?.()?.getCode() ?? 'EPSG:3857'
    const features = source.getFeatures?.() ?? []

    return features
      .map((feature: any) => feature.getGeometry?.() as Geometry | undefined)
      .filter((geometry): geometry is Geometry => !!geometry)
      .map((geometry) => {
        const geometryClone = geometry.clone()

        if (sourceProjection !== 'EPSG:4326') {
          geometryClone.transform(sourceProjection, 'EPSG:4326')
        }

        return geoJsonFormat.writeGeometryObject(geometryClone, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        })
      })
  })
  /**
   *  FIN 
   */

  function setExtentLayer(layer: VectorLayer) {
    extentLayer.value = layer
  }

  function removeExtentLayer() {
    extentLayer.value = null
  }

  function handleAddVectorLayer(getMap: () => Map | null | undefined, layer: VectorLayer) {
    const currentMap = getMap()
    const previousExtentLayer = extentLayer.value

    if (previousExtentLayer && currentMap) {
      const previousLayerId = getUid(previousExtentLayer)
      const mapLayers = currentMap.getLayers().getArray()
      const layerToRemove = mapLayers.find((layer) => {
        return getUid(layer) === previousLayerId
      })

      if (layerToRemove) {
        currentMap.getLayers().remove(layerToRemove)
        removeExtentLayer()
      }
    }

    setExtentLayer(layer)
  }

  function setExtentLayerFromRequestBody(body?: ExtractionRequestBody) {
    if (!body?.inputs?.relations) {
      removeExtentLayer()
      return
    }

    // Concatène les géométries trouvées dans tous les filters des relations.
    const geometries = Object.values(body.inputs.relations)
      .map((relation) => relation?.filters ?? '')
      .flatMap((filter) => extractGeoJsonFromFilter(filter))

    if (!geometries.length) {
      removeExtentLayer()
      return
    }

    const features = geometries
      .map(({ geojson, srid }) => {
        try {
          // Lit le GeoJSON dans son SRID d'origine puis le reprojette en 3857
          // pour rester cohérent avec les cartes OpenLayers du parcours.
          const geometry = geoJsonFormat.readGeometry(geojson, {
            dataProjection: `EPSG:${srid}`,
            featureProjection: 'EPSG:3857',
          })

          return new Feature({ geometry })
        } catch {
          return null
        }
      })
      .filter((feature): feature is Feature<Geometry> => feature !== null)

    if (!features.length) {
      removeExtentLayer()
      return
    }

    const source = new VectorSource({ features })
    // Reconstruit une couche vectorielle d'emprise prête à être affichée.
    const layer = new VectorLayerImpl({
      source,
      visible: true,
      opacity: 1,
      zIndex: 1000,
    }) as VectorLayer

    setExtentLayer(layer)
  }

  function reset() {
    selectedExtractibleID.value = null
    requestBody.value = undefined
    extentLayer.value = null
  }

  return { 
    selectedExtractibleID,
    requestBody,
    extentLayer,
    extent,
    extentLayerOptions,
    extentSourceOptions,
    extentGeometries,
    setExtentLayer,
    handleAddVectorLayer,
    setExtentLayerFromRequestBody,
    removeExtentLayer,
    reset
  }
})

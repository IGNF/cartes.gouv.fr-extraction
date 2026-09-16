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
import { extractGeoJsonFromFilter } from '@/composables/Extractions/useExtractionExtentUtils'
import { DEFAULT_GEOJSON_SRS, DEFAULT_MAP_SRS } from '@/composables/useMapConstants'

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

    const sourceProjection = source.getProjection?.()?.getCode() ?? DEFAULT_MAP_SRS
    const features = source.getFeatures?.() ?? []

    return features
      .map((feature: any) => feature.getGeometry?.() as Geometry | undefined)
      .filter((geometry): geometry is Geometry => !!geometry)
      .map((geometry) => {
        const geometryClone = geometry.clone()

        if (sourceProjection !== DEFAULT_GEOJSON_SRS) {
          geometryClone.transform(sourceProjection, DEFAULT_GEOJSON_SRS)
        }

        return geoJsonFormat.writeGeometryObject(geometryClone, {
          dataProjection: DEFAULT_GEOJSON_SRS,
          featureProjection: DEFAULT_MAP_SRS,
        })
      })
  })
  /**
   *  FIN 
   */

  function setExtentLayer(layer: VectorLayer) {
    extentLayer.value = layer
  }

  function removeExtentLayer(getMap?: () => Map | null | undefined) {
    const layer = extentLayer.value
    const currentMap = getMap?.()

    if (layer && currentMap) {
      currentMap.removeLayer(layer)
    }

    extentLayer.value = null
  }

  function removeFeatures(getMap: () => Map | null | undefined, features: Feature[], layer?: VectorLayer) {
    // Le layer rendu sur la carte peut être une reconstruction (features clonées) distincte
    // de extentLayer.value : on opère donc sur le layer réellement fourni par l'appelant.
    const targetLayer = layer ?? extentLayer.value
    const source = targetLayer?.getSource()

    if (!source || !features.length) {
      return
    }

    // Les features sélectionnées peuvent être des instances différentes de celles de la source :
    // on les fait correspondre par ol_uid.
    const idsToRemove = new Set(features.map((feature) => getUid(feature)))

    const matchingFeatures = source.getFeatures()
      .filter((sourceFeature) => idsToRemove.has(getUid(sourceFeature)))

    matchingFeatures.forEach((sourceFeature) => source.removeFeature(sourceFeature))

    // Supprime la couche si elle ne contient plus aucune feature, sinon synchronise le store sur le layer utilisé.
    if (source.getFeatures().length === 0) {
      removeExtentLayer(getMap)
    } else if (targetLayer && targetLayer !== extentLayer.value) {
      setExtentLayer(targetLayer)
    }
  }

  function handleAddVectorLayer(getMap: () => Map | null | undefined, layer: VectorLayer) {
    const currentMap = getMap()
    const previousExtentLayer = extentLayer.value

    if (previousExtentLayer) {
      // Récupère les features de l'ancienne couche avant sa suppression pour les reporter sur la nouvelle.
      const previousFeatures = previousExtentLayer.getSource?.()?.getFeatures?.() ?? []
      layer.getSource()?.addFeatures(previousFeatures)

      currentMap?.removeLayer(previousExtentLayer)
      removeExtentLayer()
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
            featureProjection: DEFAULT_MAP_SRS,
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
    removeFeatures,
    reset
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ExtractionRequestBody } from '@/types/extractibles.types'
import type VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import VectorLayerImpl from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import type Geometry from 'ol/geom/Geometry'

const geoJsonFormat = new GeoJSON()

// Extrait toutes les géométries GeoJSON présentes dans les filtres SQL,
// en ciblant les appels ST_GeomFromGeoJSON('...') et leur SRID éventuel.
function extractGeoJsonFromFilter(filter: string): Array<{ geojson: Record<string, unknown>, srid: number }> {
  const results: Array<{ geojson: Record<string, unknown>, srid: number }> = []
  const geomRegex = /ST_GeomFromGeoJSON\(\s*'((?:''|[^'])*)'\s*\)/gi

  let match: RegExpExecArray | null
  while ((match = geomRegex.exec(filter)) !== null) {
    const escapedGeoJson = match[1]
    const rawGeoJson = escapedGeoJson.replace(/''/g, "'")

    try {
      const parsed = JSON.parse(rawGeoJson) as Record<string, unknown>

      const beforeGeomCall = filter.slice(0, match.index)
      const setSridMatch = /ST_SetSRID\(\s*$/i.exec(beforeGeomCall)
      // SRID par défaut attendu dans le projet pour l'affichage carto.
      let srid = 3857

      if (setSridMatch) {
        const afterGeomCall = filter.slice(match.index + match[0].length)
        const sridMatch = /^\s*,\s*(\d+)\s*\)/.exec(afterGeomCall)
        if (sridMatch) {
          srid = Number.parseInt(sridMatch[1], 10)
        }
      }

      results.push({ geojson: parsed, srid })
    } catch {
      continue
    }
  }

  return results
}

export const useCreateExtractionStore = defineStore('createExtraction', () => {
  const selectedExtractibleID = ref<string | null>(null)
  const requestBody = ref<ExtractionRequestBody | undefined>(undefined)
  const extentLayer = shallowRef<VectorLayer | null>(null)
  const extent = computed(() => {
    if (!extentLayer.value) return null
    const source = extentLayer.value.getSource()
    if (!source) return null
    const sourceExtent = source.getExtent?.()
    if (!sourceExtent) return null
    return sourceExtent
  })
  const extentLayerOptions = computed(() => {
    if (!extentLayer.value) return {}

    return {
      visible: extentLayer.value.getVisible(),
      opacity: extentLayer.value.getOpacity(),
      style: extentLayer.value.getStyle() || undefined,
      zIndex: extentLayer.value.getZIndex()
    }
  })
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

        if (sourceProjection !== 'EPSG:3857') {
          geometryClone.transform(sourceProjection, 'EPSG:3857')
        }

        return geoJsonFormat.writeGeometryObject(geometryClone, {
          dataProjection: 'EPSG:3857',
          featureProjection: 'EPSG:3857',
        })
      })
  })

  function setExtentLayer(layer: VectorLayer) {
    extentLayer.value = layer
  }

  function removeExtentLayer() {
    extentLayer.value = null
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
    setExtentLayerFromRequestBody,
    removeExtentLayer,
    reset
  }
})

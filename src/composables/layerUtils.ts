import type { Extractible } from '@/types/extractibles.types'
import type VectorLayer from 'ol/layer/Vector'
import type { Extent } from 'ol/extent'
import { createEmpty, extend, intersects } from 'ol/extent'
import GeoJSON, { type GeoJSONFeatureCollection } from 'ol/format/GeoJSON'
import { DEFAULT_GEOJSON_SRS, DEFAULT_MAP_SRS } from '@/composables/useMapConstants'

const geoJsonFormat = new GeoJSON()

function isValidExtent(extent: unknown): extent is Extent {
  return Array.isArray(extent)
    && extent.length === 4
    && extent.every((value) => typeof value === 'number' && Number.isFinite(value))
}

export function getExtractibleExtent(extent: unknown, srs?: string): Extent | null {
  if (!extent || typeof extent !== 'object') return null

  try {
    const geojson = extent as { type?: string; geometry?: object; coordinates?: unknown }
    // Accepte un Feature GeoJSON ou une Geometry GeoJSON directement
    const geometryObject = geojson.type === 'Feature' && geojson.geometry
      ? geojson.geometry
      : extent as object

    const geometry = geoJsonFormat.readGeometry(geometryObject, {
      dataProjection: DEFAULT_GEOJSON_SRS,
      featureProjection: DEFAULT_MAP_SRS,
    })
    return geometry.getExtent()
  } catch {
    return null
  }
}

// Collection GeoJSON (EPSG:4326) de toutes les features du extentLayer.
export function getVectorLayerExtent(vectorLayer: VectorLayer | null): GeoJSONFeatureCollection | null {
  if (!vectorLayer) return null

  const source = vectorLayer.getSource()
  if (!source) return null

  const features = source.getFeatures?.() ?? []
  if (!features.length) return null

  const sourceProjection = source.getProjection?.()?.getCode() ?? DEFAULT_MAP_SRS

  return geoJsonFormat.writeFeaturesObject(features, {
    dataProjection: DEFAULT_GEOJSON_SRS,
    featureProjection: sourceProjection,
  })
}

export function filterExtractiblesByLayerIntersection(
  extractibles: Extractible[],
  extentLayer: VectorLayer | null,
): Extractible[] {
  const layerFeatureCollection = getVectorLayerExtent(extentLayer)

  if (!layerFeatureCollection) {
    return extractibles
  }

  // Reconstruit un extent global (EPSG:3857) à partir de la collection GeoJSON pour le test d'intersection.
  const layerExtent = createEmpty()
  let hasGeometry = false

  for (const feature of geoJsonFormat.readFeatures(layerFeatureCollection, {
    dataProjection: DEFAULT_GEOJSON_SRS,
    featureProjection: DEFAULT_MAP_SRS,
  })) {
    const featureExtent = feature.getGeometry?.()?.getExtent()
    if (!isValidExtent(featureExtent)) continue

    extend(layerExtent, featureExtent)
    hasGeometry = true
  }

  if (!hasGeometry) {
    return extractibles
  }

  return extractibles.filter((extractible) => {
    const extractibleExtent = getExtractibleExtent(extractible.extent, extractible.srs)
    return !!extractibleExtent && intersects(extractibleExtent, layerExtent)
  })
}


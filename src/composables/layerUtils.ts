import type { Extractible } from '@/types/extractibles.types'
import type VectorLayer from 'ol/layer/Vector'
import type { Extent } from 'ol/extent'
import { createEmpty, extend, intersects } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON'

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
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    })
    return geometry.getExtent()
  } catch {
    return null
  }
}

export function getVectorLayerExtent(vectorLayer: VectorLayer | null): Extent | null {
  if (!vectorLayer) return null

  const source = vectorLayer.getSource()
  if (!source) return null

  const sourceProjection = source.getProjection?.()?.getCode() ?? 'EPSG:3857'
  console.log('getVectorLayerExtent - Source Projection:', sourceProjection)

  const features = source.getFeatures?.() ?? []
  console.log('getVectorLayerExtent - Features count:', features.length)

  if (features.length === 0) {
    const sourceExtent = source.getExtent?.()
    console.log('getVectorLayerExtent - Source extent (no features):', sourceExtent)
    if (!isValidExtent(sourceExtent)) return null
    const result = sourceProjection !== 'EPSG:3857'
      ? transformExtent(sourceExtent, sourceProjection, 'EPSG:3857')
      : sourceExtent
    console.log('getVectorLayerExtent - Transformed extent:', result)
    return result
  }

  const computedExtent = createEmpty()
  let hasGeometry = false

  for (const feature of features) {
    const geometry = feature.getGeometry?.()
    if (!geometry) continue

    const featureExtent = geometry.getExtent()
    if (!isValidExtent(featureExtent)) continue

    console.log('getVectorLayerExtent - Feature extent:', featureExtent)
    extend(computedExtent, featureExtent)
    hasGeometry = true
  }

  if (!hasGeometry) {
    console.log('getVectorLayerExtent - No geometries found')
    return null
  }

  console.log('getVectorLayerExtent - Computed extent:', computedExtent)
  const result = sourceProjection !== 'EPSG:3857'
    ? transformExtent(computedExtent, sourceProjection, 'EPSG:3857')
    : computedExtent
  console.log('getVectorLayerExtent - Final extent (EPSG:3857):', result)
  return result
}

export function filterExtractiblesByLayerIntersection(
  extractibles: Extractible[],
  extentLayer: VectorLayer | null,
): Extractible[] {
  const layerExtent = getVectorLayerExtent(extentLayer)

  if (!layerExtent) {
    return extractibles
  }

  console.log('Extractibles', extractibles);
  
  return extractibles.filter((extractible) => {
    const extractibleExtent = getExtractibleExtent(extractible.extent, extractible.srs)
    if (extractible.name == "appariement_dep52_gpkg_15-11-2024") {
            console.log('Extractible:', extractible.name, 'Extent:', extractibleExtent, 'Layer Extent:', layerExtent);
            console.log('Intersects:', !!extractibleExtent && intersects(extractibleExtent, layerExtent));
    }
    return !!extractibleExtent && intersects(extractibleExtent, layerExtent)
  })
}

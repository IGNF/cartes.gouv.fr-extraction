import GeoJSON from 'ol/format/GeoJSON'
import type Geometry from 'ol/geom/Geometry'
import type VectorLayer from 'ol/layer/Vector'
import { DEFAULT_MAP_SRS } from '@/composables/useMapConstants'

const geoJsonFormat = new GeoJSON()

/**
 * Extrait les géométries GeoJSON présentes dans un filtre SQL.
 *
 * La fonction recherche les appels `ST_GeomFromGeoJSON('...')`, décode
 * les apostrophes échappées et associe à chaque géométrie son SRID. Si
 * aucun `ST_SetSRID` ne précise de SRID, celui de la carte est utilisé.
 * Les géométries dont le JSON est invalide sont ignorées.
 *
 * @param filter Filtre SQL pouvant contenir des appels PostGIS de création de géométrie.
 * @returns Les géométries extraites et leur SRID associé.
 */
export function extractGeoJsonFromFilter(filter: string): Array<{ geojson: Record<string, unknown>, srid: number }> {
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
			let srid = Number.parseInt(DEFAULT_MAP_SRS.replace('EPSG:', ''), 10)

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

/**
 * Construit une condition SQL PostGIS d'intersection à partir des géométries
 * d'une couche vectorielle.
 *
 * Les géométries sont clonées puis reprojetées vers le SRID de destination
 * avant d'être sérialisées en GeoJSON. Une seule géométrie est utilisée
 * directement ; plusieurs géométries sont regroupées avec `ST_Collect`.
 *
 * @param layer Couche vectorielle contenant les géométries à intersecter.
 * @param destinationSrid SRID de la projection cible utilisée dans la requête.
 * @returns Une condition `ST_Intersects`, ou une chaîne vide si la couche
 * ne possède pas de source ou de géométrie exploitable.
 */
export function createIntersectSQL(layer: VectorLayer, destinationSrid: number): string {
	const source = layer.getSource()
	if (!source) return ''

	const sourceProjection = source.getProjection?.()?.getCode() ?? DEFAULT_MAP_SRS
	const destinationProjection = `EPSG:${destinationSrid}`
	const features = source.getFeatures?.() ?? []

	const geometrySqlList = features
		.map((feature) => feature.getGeometry?.() as Geometry | undefined)
		.filter((geometry): geometry is Geometry => !!geometry)
		.map((geometry) => {
			const geometryClone = geometry.clone()

			if (sourceProjection !== destinationProjection) {
				geometryClone.transform(sourceProjection, destinationProjection)
			}

			const geometryObject = geoJsonFormat.writeGeometryObject(geometryClone, {
				dataProjection: destinationProjection,
				featureProjection: destinationProjection,
			})
			const geometryJson = JSON.stringify(geometryObject).replace(/'/g, "''")

			return `ST_SetSRID(ST_GeomFromGeoJSON('${geometryJson}'), ${destinationSrid})`
		})

	if (!geometrySqlList.length) return ''

	if (geometrySqlList.length === 1) {
		return `ST_Intersects(geometrie, ${geometrySqlList[0]})`
	}

	return `ST_Intersects(geometrie, ST_Collect(ARRAY[${geometrySqlList.join(', ')}]))`
}



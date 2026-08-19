import GeoJSON from 'ol/format/GeoJSON'
import type Geometry from 'ol/geom/Geometry'
import type VectorLayer from 'ol/layer/Vector'

const geoJsonFormat = new GeoJSON()

// Extrait toutes les géométries GeoJSON présentes dans les filtres SQL,
// en ciblant les appels ST_GeomFromGeoJSON('...') et leur SRID éventuel.
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

export function createIntersectSQL(layer: VectorLayer, destinationSrid: number): string {
	const source = layer.getSource()
	if (!source) return ''

	const sourceProjection = source.getProjection?.()?.getCode() ?? 'EPSG:3857'
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



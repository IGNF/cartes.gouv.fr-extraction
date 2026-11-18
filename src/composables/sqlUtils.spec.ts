import { describe, expect, it } from 'vitest'
import { clauseWhereToRelationInput, hasNonSpatialFilter, relationInputFilterToFilter, relationInputToClauseWhere } from './sqlUtils'

const spatialFilter = `ST_Intersects(geometrie, ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[]}'), 2154))`

describe('hasNonSpatialFilter', () => {
	it('détecte uniquement les conditions autres que les filtres spatiaux', () => {
		expect(hasNonSpatialFilter('')).toBe(false)
		expect(hasNonSpatialFilter(`(${spatialFilter})`)).toBe(false)
		expect(hasNonSpatialFilter("nombre_d_etages = '2'")).toBe(true)
		expect(hasNonSpatialFilter(`((nombre_d_etages = '2')) AND (${spatialFilter})`)).toBe(true)
	})
})

describe('relationInputFilterToFilter', () => {
	it.each(['IS NULL', 'IS NOT NULL'] as const)('sérialise et restaure %s sans valeur SQL supplémentaire', (operator) => {
		const clause = {
			table: 'buildings',
			exportedAttributes: ['name'],
			filter: { attribute: 'name', operator, value: null },
		}
		const relationInput = clauseWhereToRelationInput(clause)
		expect(relationInput.buildings?.filters).toBe(`name ${operator}`)
		expect(relationInputToClauseWhere(relationInput)).toEqual([clause])
		expect(relationInputFilterToFilter(`(name ${operator})`)).toEqual({
			logicalOperator: 'AND', filters: [clause.filter],
		})
	})

	it('reconstruit les différents types de valeurs', () => {
		expect(relationInputFilterToFilter("name = 'L''été'"))
			.toEqual({ attribute: 'name', operator: '=', value: "L'été" })
		expect(relationInputFilterToFilter('height >= 12.5'))
			.toEqual({ attribute: 'height', operator: '>=', value: 12.5 })
		expect(relationInputFilterToFilter('active != false'))
			.toEqual({ attribute: 'active', operator: '!=', value: false })
		expect(relationInputFilterToFilter("status IN ('ready', 2, true)"))
			.toEqual({ attribute: 'status', operator: 'IN', value: ['ready', 2, true] })
	})

	it.each([
		['LIKE', 'Paris%'],
		['NOT LIKE', 'Paris%'],
		['LIKE', '%Paris'],
		['NOT LIKE', '%Paris'],
	])('préserve les jokers lors de la reconstruction de %s', (operator, value) => {
		const clause = {
			table: 'buildings',
			exportedAttributes: ['name'],
			filter: { attribute: 'name', operator: operator as 'LIKE' | 'NOT LIKE', value },
		}
		const relationInput = clauseWhereToRelationInput(clause)

		expect(relationInputToClauseWhere(relationInput)).toEqual([clause])
	})

	it('reconstruit les groupes imbriqués produits par clauseWhereToRelationInput', () => {
		const clause = {
			table: 'buildings',
			exportedAttributes: ['name', 'height'],
			filter: {
				logicalOperator: 'AND' as const,
				filters: [
					{ attribute: 'height', operator: '>' as const, value: 10 },
					{
						logicalOperator: 'OR' as const,
						filters: [
							{ attribute: 'name', operator: 'LIKE' as const, value: 'A%' },
							{ attribute: 'category', operator: 'NOT IN' as const, value: ['shed', 'garage'] },
						],
					},
				],
			},
		}

		const relationInput = clauseWhereToRelationInput(clause)

		expect(relationInputToClauseWhere(relationInput)).toEqual([clause])
	})

	it("ignore le filtre d'emprise ajouté au filtre structuré", () => {
		const filter = `((nombre_d_etages = '2' OR nombre_d_etages = '3')) AND (${spatialFilter} OR ${spatialFilter})`

		expect(relationInputFilterToFilter(filter)).toEqual({
			logicalOperator: 'OR',
			filters: [
				{ attribute: 'nombre_d_etages', operator: '=', value: '2' },
				{ attribute: 'nombre_d_etages', operator: '=', value: '3' },
			],
		})
	})

	it("retourne undefined quand le filtre ne contient que l'emprise", () => {
		expect(relationInputFilterToFilter(`(${spatialFilter})`)).toBeUndefined()
	})

	it('rejette une expression invalide', () => {
		expect(() => relationInputFilterToFilter("name = 'non terminé"))
			.toThrow(SyntaxError)
	})
})
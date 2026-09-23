import type { RelationInput } from '@/types/extractibles.types'
import type { ClauseWhere, Filter, FilterGroup } from '@/types/sql.types'

function isFilterGroup(filter: Filter | FilterGroup): filter is FilterGroup {
	return Boolean(filter && 'filters' in filter)
}

function formatValue(value: string | number | boolean | (string | number | boolean)[]): string {
	if (Array.isArray(value)) {
		return `(${value.map(formatValue).join(', ')})`
	}
	if (typeof value === 'string') {
		return `'${value.replace(/'/g, "''")}'`
	}
	return String(value)
}

function filterToString(filter: Exclude<Filter, undefined>): string {
	return `${filter.attribute} ${filter.operator} ${formatValue(filter.value)}`
}

function filterGroupToString(group: FilterGroup): string {
	const content = group.filters
		.filter((filter): filter is Exclude<Filter, undefined> | FilterGroup => Boolean(filter))
		.map(filter => (isFilterGroup(filter) ? filterGroupToString(filter) : filterToString(filter)))
		.join(` ${group.logicalOperator} `)
	return `(${content})`
}

function ClauseWhereToFilter(clauseWhere: ClauseWhere): string {
	if (!clauseWhere.filter) return ''

	return isFilterGroup(clauseWhere.filter) ? filterGroupToString(clauseWhere.filter) : filterToString(clauseWhere.filter)
}

/**
 * Convertit une ClauseWhere (ou un tableau de ClauseWhere, combinées par AND) en RelationInput.
 */
export function clauseWhereToRelationInput(clauseWhere: ClauseWhere | ClauseWhere[]): RelationInput {
	const clauses = Array.isArray(clauseWhere) ? clauseWhere : [clauseWhere]

	return clauses.reduce<RelationInput>((relations, clause) => {
		relations[clause.table] = {
			attributes: clause.exportedAttributes,
			filters: ClauseWhereToFilter(clause),
		}
		return relations
	}, {})
}

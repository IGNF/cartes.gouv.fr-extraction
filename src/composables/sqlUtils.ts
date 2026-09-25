import type { RelationInput } from '@/types/extractibles.types'
import type { ClauseWhere, Filter, FilterGroup, Operator, logicalOperator } from '@/types/sql.types'

type FilterValue = string | number | boolean

/**
 * Indique si une expression est entièrement entourée par une même paire de parenthèses.
 * Les parenthèses et apostrophes présentes dans une chaîne SQL sont ignorées.
 *
 * @param input Expression SQL à examiner.
 * @returns `true` lorsque les parenthèses ouvrante et fermante englobent toute l'expression.
 */
function hasWrappingParentheses(input: string): boolean {
	if (input[0] !== '(' || input[input.length - 1] !== ')') return false

	let depth = 0
	let inString = false
	for (let index = 0; index < input.length; index++) {
		if (input[index] === "'") {
			if (inString && input[index + 1] === "'") {
				index++
				continue
			}
			inString = !inString
			continue
		}
		if (inString) continue
		if (input[index] === '(') depth++
		if (input[index] === ')' && --depth === 0) return index === input.length - 1
	}
	return false
}

/**
 * Retire toutes les paires de parenthèses qui englobent entièrement une expression SQL.
 *
 * @param input Expression SQL à simplifier.
 * @returns Expression sans parenthèses englobantes superflues.
 */
function unwrapParentheses(input: string): string {
	let unwrapped = input.trim()
	while (hasWrappingParentheses(unwrapped)) unwrapped = unwrapped.slice(1, -1).trim()
	return unwrapped
}

/**
 * Découpe une expression selon un opérateur logique situé au niveau racine.
 * Les opérateurs contenus dans des parenthèses ou des chaînes SQL ne sont pas pris en compte.
 *
 * @param input Expression SQL à découper.
 * @param operator Opérateur logique utilisé comme séparateur.
 * @returns Parties de l'expression, sans espaces en début ni en fin.
 */
function splitTopLevel(input: string, operator: logicalOperator): string[] {
	const parts: string[] = []
	let start = 0
	let depth = 0
	let inString = false

	for (let index = 0; index < input.length; index++) {
		if (input[index] === "'") {
			if (inString && input[index + 1] === "'") {
				index++
				continue
			}
			inString = !inString
			continue
		}
		if (inString) continue
		if (input[index] === '(') depth++
		else if (input[index] === ')') depth--
		else if (depth === 0 && input.slice(index, index + operator.length).toUpperCase() === operator) {
			const before = input[index - 1]
			const after = input[index + operator.length]
			if (/\s/.test(before ?? '') && /\s/.test(after ?? '')) {
				parts.push(input.slice(start, index).trim())
				index += operator.length - 1
				start = index + 1
			}
		}
	}

	parts.push(input.slice(start).trim())
	return parts
}

/**
 * Détermine si une expression est exclusivement composée de prédicats spatiaux `ST_Intersects`.
 * Plusieurs prédicats reliés par `OR` sont considérés comme un même filtre d'emprise.
 *
 * @param input Expression SQL à examiner.
 * @returns `true` lorsque toutes les branches sont des appels à `ST_Intersects`.
 */
function isSpatialFilter(input: string): boolean {
	return splitTopLevel(unwrapParentheses(input), 'OR')
		.every(part => /^ST_Intersects\s*\(/i.test(unwrapParentheses(part)))
}

/**
 * Retire les filtres d'emprise ajoutés au filtre structuré avant son envoi à l'API.
 * L'enveloppe de parenthèses ajoutée lors de la concaténation est également supprimée.
 *
 * @param input Filtre SQL pouvant combiner filtre utilisateur et filtre spatial.
 * @returns Partie structurée du filtre, ou une chaîne vide si seule l'emprise était présente.
 */
function removeSpatialFilters(input: string): string {
	const parts = splitTopLevel(input.trim(), 'AND')
	const structuredParts = parts.filter(part => !isSpatialFilter(part))
	if (structuredParts.length === parts.length) return input
	return structuredParts.map(part => hasWrappingParentheses(part) ? part.slice(1, -1).trim() : part).join(' AND ')
}

/**
 * Indique si un filtre SQL contient au moins une condition autre qu'un filtre d'emprise.
 *
 * @param filter Filtre SQL à examiner.
 * @returns `true` lorsqu'une condition non spatiale subsiste après retrait des `ST_Intersects`.
 */
export function hasNonSpatialFilter(filter: string): boolean {
	return removeSpatialFilters(filter).trim() !== ''
}

/**
 * Analyse le sous-ensemble SQL produit par `ClauseWhereToFilter` et le convertit en filtres structurés.
 */
class RelationInputFilterParser {
	private index = 0

	/**
	 * Crée un parseur positionné au début de l'expression.
	 *
	 * @param input Expression SQL structurée à analyser.
	 */
	constructor(private readonly input: string) {}

	/**
	 * Analyse la totalité de l'expression et vérifie qu'aucun caractère ne reste inutilisé.
	 *
	 * @returns Filtre simple ou groupe de filtres reconstruit.
	 * @throws {SyntaxError} Lorsque l'expression est vide, invalide ou incomplète.
	 */
	parse(): Exclude<Filter | FilterGroup, undefined> {
		this.skipWhitespace()
		if (this.index === this.input.length) {
			throw this.syntaxError('Le filtre ne peut pas être vide')
		}

		const filter = this.parseExpression()
		this.skipWhitespace()
		if (this.index !== this.input.length) {
			throw this.syntaxError('Caractères inattendus')
		}
		return filter
	}

	/**
	 * Analyse l'expression située à la position courante.
	 *
	 * @returns Groupe lorsque l'expression commence par `(`, sinon filtre simple.
	 */
	private parseExpression(): Exclude<Filter | FilterGroup, undefined> {
		this.skipWhitespace()
		return this.input[this.index] === '(' ? this.parseGroup() : this.parseFilter()
	}

	/**
	 * Analyse un groupe parenthésé dont les éléments sont reliés par `AND` ou `OR`.
	 * Un même niveau ne peut pas mélanger les deux opérateurs sans sous-groupe explicite.
	 *
	 * @returns Groupe de filtres, potentiellement imbriqué.
	 * @throws {SyntaxError} Lorsque le groupe ou son opérateur logique est invalide.
	 */
	private parseGroup(): Exclude<FilterGroup, undefined> {
		this.index++
		this.skipWhitespace()
		if (this.input[this.index] === ')') {
			this.index++
			return { logicalOperator: 'AND', filters: [] }
		}

		const filters: Exclude<Filter | FilterGroup, undefined>[] = [this.parseExpression()]
		let logicalOperator: logicalOperator = 'AND'
		let hasLogicalOperator = false

		while (true) {
			this.skipWhitespace()
			if (this.input[this.index] === ')') {
				this.index++
				return { logicalOperator, filters }
			}

			const nextOperator = this.readWord().toUpperCase()
			if (nextOperator !== 'AND' && nextOperator !== 'OR') {
				throw this.syntaxError('Opérateur logique AND ou OR attendu')
			}
			if (hasLogicalOperator && logicalOperator !== nextOperator) {
				throw this.syntaxError('Les opérateurs logiques mélangés doivent être groupés')
			}
			logicalOperator = nextOperator
			hasLogicalOperator = true
			filters.push(this.parseExpression())
		}
	}

	/**
	 * Analyse un filtre composé d'un attribut, d'un opérateur et d'une valeur.
	 *
	 * @returns Filtre typé selon l'opérateur rencontré.
	 * @throws {SyntaxError} Lorsque l'opérateur et la valeur sont incompatibles.
	 */
	private parseFilter(): Exclude<Filter, undefined> {
		const attribute = this.readWord()
		if (!attribute) throw this.syntaxError('Attribut attendu')

		const operator = this.parseOperator()
		if (operator === 'IN' || operator === 'NOT IN') {
			return { attribute, operator, value: this.parseArray() }
		}

		const value = this.parseValue()
		if ((operator === '<' || operator === '<=' || operator === '>' || operator === '>=') && typeof value !== 'number') {
			throw this.syntaxError(`L'opérateur ${operator} attend un nombre`)
		}
		if ((operator === 'LIKE' || operator === 'NOT LIKE') && typeof value !== 'string') {
			throw this.syntaxError(`L'opérateur ${operator} attend une chaîne`)
		}

		return { attribute, operator, value } as Exclude<Filter, undefined>
	}

	/**
	 * Lit un opérateur SQL pris en charge à la position courante.
	 *
	 * @returns Opérateur normalisé en majuscules.
	 * @throws {SyntaxError} Lorsqu'aucun opérateur reconnu n'est présent.
	 */
	private parseOperator(): Operator {
		this.skipWhitespace()
		const remainingInput = this.input.slice(this.index)
		const match = /^(NOT\s+(?:LIKE|IN)|LIKE|IN|!=|<=|>=|=|<|>)(?=\s|\()/i.exec(remainingInput)
		if (!match) throw this.syntaxError('Opérateur de filtre attendu')

		this.index += match[0].length
		return match[0].replace(/\s+/g, ' ').toUpperCase() as Operator
	}

	/**
	 * Analyse une liste de valeurs parenthésée utilisée par `IN` ou `NOT IN`.
	 *
	 * @returns Valeurs de la liste converties vers leurs types primitifs.
	 * @throws {SyntaxError} Lorsque les parenthèses ou séparateurs sont invalides.
	 */
	private parseArray(): FilterValue[] {
		this.skipWhitespace()
		if (this.input[this.index] !== '(') throw this.syntaxError('Liste de valeurs attendue')
		this.index++
		this.skipWhitespace()

		const values: FilterValue[] = []
		if (this.input[this.index] === ')') {
			this.index++
			return values
		}

		while (true) {
			values.push(this.parseValue())
			this.skipWhitespace()
			if (this.input[this.index] === ')') {
				this.index++
				return values
			}
			if (this.input[this.index] !== ',') throw this.syntaxError('Virgule attendue dans la liste')
			this.index++
		}
	}

	/**
	 * Analyse une valeur SQL scalaire et restaure son type JavaScript.
	 *
	 * @returns Chaîne, nombre ou booléen analysé.
	 * @throws {SyntaxError} Lorsque la valeur n'appartient pas au format sérialisé attendu.
	 */
	private parseValue(): FilterValue {
		this.skipWhitespace()
		if (this.input[this.index] === "'") return this.parseString()

		const rawValue = this.readWord()
		if (!rawValue) throw this.syntaxError('Valeur attendue')
		if (/^(?:true|false)$/i.test(rawValue)) return rawValue.toLowerCase() === 'true'
		if (/^-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(rawValue)) return Number(rawValue)
		throw this.syntaxError(`Valeur non reconnue « ${rawValue} »`)
	}

	/**
	 * Analyse une chaîne SQL entourée d'apostrophes et décode les apostrophes doublées.
	 *
	 * @returns Contenu décodé de la chaîne.
	 * @throws {SyntaxError} Lorsque l'apostrophe fermante est absente.
	 */
	private parseString(): string {
		this.index++
		let value = ''
		while (this.index < this.input.length) {
			if (this.input[this.index] !== "'") {
				value += this.input[this.index++]
				continue
			}
			if (this.input[this.index + 1] === "'") {
				value += "'"
				this.index += 2
				continue
			}
			this.index++
			return value
		}
		throw this.syntaxError('Chaîne non terminée')
	}

	/**
	 * Lit le prochain mot jusqu'à un espace, une virgule ou une parenthèse.
	 *
	 * @returns Mot lu, ou une chaîne vide si aucun mot n'est présent.
	 */
	private readWord(): string {
		this.skipWhitespace()
		const start = this.index
		while (this.index < this.input.length && !/[\s(),]/.test(this.input[this.index])) {
			this.index++
		}
		return this.input.slice(start, this.index)
	}

	/**
	 * Avance la position courante après tous les caractères d'espacement consécutifs.
	 */
	private skipWhitespace(): void {
		while (/\s/.test(this.input[this.index] ?? '')) this.index++
	}

	/**
	 * Construit une erreur de syntaxe enrichie avec la position courante du parseur.
	 *
	 * @param message Description de l'erreur rencontrée.
	 * @returns Erreur prête à être levée par la méthode appelante.
	 */
	private syntaxError(message: string): SyntaxError {
		return new SyntaxError(`${message} à la position ${this.index}`)
	}
}

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

function filterGroupToString(group: FilterGroup | undefined): string {
	if (!group) return ''

	const content = group.filters
		.filter((filter): filter is Exclude<Filter, undefined> | FilterGroup => Boolean(filter))
		.map(filter => (isFilterGroup(filter) ? filterGroupToString(filter) : filterToString(filter)))
		.join(` ${group.logicalOperator ?? 'AND'} `)
	return `(${content})`
}

function ClauseWhereToFilter(clauseWhere: ClauseWhere | undefined): string {
	const filter = clauseWhere?.filter
	if (!filter) return ''

	return isFilterGroup(filter) ? filterGroupToString(filter) : filterToString(filter)
}

/**
 * Reconstruit un Filter ou FilterGroup depuis la chaîne produite par ClauseWhereToFilter.
 * Les prédicats spatiaux `ST_Intersects`, ajoutés séparément par le filtre d'emprise,
 * sont ignorés car ils ne peuvent pas être représentés par les types structurés.
 *
 * @param filter Filtre SQL sérialisé dans un `RelationInput`.
 * @returns Filtre structuré, ou `undefined` lorsque la chaîne ne contient qu'une emprise.
 * @throws {SyntaxError} Lorsque la partie structurée du filtre est invalide.
 */
export function relationInputFilterToFilter(filter: string): Filter | FilterGroup {
	const structuredFilter = removeSpatialFilters(filter)
	return structuredFilter ? new RelationInputFilterParser(structuredFilter).parse() : undefined
}

/**
 * Convertit une ClauseWhere (ou un tableau de ClauseWhere, combinées par AND) en RelationInput.
 */
export function clauseWhereToRelationInput(clauseWhere: ClauseWhere | ClauseWhere[]): RelationInput {
	const clauses = Array.isArray(clauseWhere) ? clauseWhere : [clauseWhere]

	return clauses.reduce<RelationInput>((relations, clause) => {
		if (!clause) return relations

		relations[clause.table] = {
			attributes: clause.exportedAttributes,
			filters: ClauseWhereToFilter(clause),
		}
		return relations
	}, {})
}

/**
 * Convertit un RelationInput en tableau de ClauseWhere, pour hydrater le formulaire à partir
 * d'un modèle existant (ex : relance d'une extraction).
 */
export function relationInputToClauseWhere(relationInput: RelationInput): ClauseWhere[] {
	return Object.entries(relationInput).map(([table, relation]) => ({
		table,
		filter: relation.filters ? relationInputFilterToFilter(relation.filters) : undefined,
		exportedAttributes: relation.attributes ?? [],
	}))
}

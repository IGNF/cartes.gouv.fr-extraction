<script setup lang="ts">
import { useId } from 'vue'
import { DsfrButton, DsfrInput, DsfrInputGroup } from '@gouvminint/vue-dsfr'
import { parseSqlList } from '@/composables/sqlUtils'
import { getSqlDataTypeCategory, type dataTypes, type Operator, type SqlDataTypeCategory } from '@/types/sql.types'

const props = defineProps<{
	dataType?: dataTypes
	operator: Operator
	disabled?: boolean
}>()

const model = defineModel<string>({ default: '' })
const hasError = defineModel<boolean>('hasError', { default: false })
const hintId = `sql-input-hint-${useId()}`

const inputText = ref('')
const values = ref<string[]>([])

const isArray = computed(() => props.operator === 'IN' || props.operator === 'NOT IN')
const isLike = computed(() => props.operator === 'LIKE' || props.operator === 'NOT LIKE')
const isNumberComparison = computed(() => ['<', '<=', '>', '>='].includes(props.operator))
const category = computed(() => (props.dataType ? getSqlDataTypeCategory(props.dataType) : undefined))

const dateKind = computed<'date' | 'time' | 'timestamp' | 'interval' | undefined>(() => {
	if (category.value !== 'sqlDate') return undefined
	const type = props.dataType!.trim().toLowerCase()
	if (type.startsWith('interval')) return 'interval'
	if (type.startsWith('timestamp')) return 'timestamp'
	if (type.startsWith('time')) return 'time'
	return 'date'
})

const categoryHints: Record<SqlDataTypeCategory, string> = {
	sqlString: 'Texte libre (ex. : Paris).',
	sqlNumber: 'Nombre, avec un point comme séparateur décimal (ex. : 42 ou 3.14).',
	sqlDate: 'Date au format AAAA-MM-JJ (ex. : 2024-01-31).',
	sqlGeometry: 'Géométrie au format WKT (ex. : POINT(2.35 48.85)).',
	sqlBoolean: 'Saisissez true (vrai) ou false (faux).',
	sqlObject: 'Contenu JSON ou XML.',
	sqlBinary: 'Suite de 0 et de 1 (ex. : 1010).',
	sqlNetwork: 'Adresse réseau (ex. : 192.168.0.1 ou 08:00:2b:01:02:03).',
	sqlIdentifier: 'Identifiant UUID (ex. : 123e4567-e89b-12d3-a456-426614174000).',
	sqlSearch: 'Termes de recherche plein texte.',
	sqlSystem: 'Valeur système PostgreSQL.',
}

const dateHints = {
	date: categoryHints.sqlDate,
	time: 'Heure au format HH:MM ou HH:MM:SS (ex. : 14:30).',
	timestamp: 'Date et heure au format AAAA-MM-JJ HH:MM:SS (ex. : 2024-01-31 14:30:00).',
	interval: 'Durée (ex. : 3 days ou 2 hours).',
}

const hint = computed(() => {
	const messages: string[] = []
	if (dateKind.value) messages.push(dateHints[dateKind.value])
	else if (category.value) messages.push(categoryHints[category.value])
	if (isLike.value) messages.push('Utilisez % pour remplacer n\'importe quelle suite de caractères (ex. : Par%).')
	if (isArray.value) messages.push('Appuyez sur Entrée ou sur + pour ajouter chaque valeur.')
	return messages.join(' ')
})

const operatorError = computed(() => {
	if (!category.value) return undefined
	if (isLike.value && category.value !== 'sqlString') {
		return `L'opérateur ${props.operator} s'applique uniquement aux champs texte.`
	}
	if (isNumberComparison.value && !['sqlNumber', 'sqlDate', 'sqlString'].includes(category.value)) {
		return `L'opérateur ${props.operator} ne peut pas être utilisé avec ce type de champ.`
	}
	return undefined
})

function validateValue(rawValue: string): string | undefined {
	const value = rawValue.trim()
	if (!value) return undefined

	switch (category.value) {
		case 'sqlNumber':
			return /^-?(?:\d+\.?\d*|\.\d+)$/.test(value) ? undefined : 'Saisissez un nombre valide (ex. : 42 ou 3.14).'
		case 'sqlBoolean':
			return /^(?:true|false)$/i.test(value) ? undefined : 'Saisissez true ou false.'
		case 'sqlIdentifier':
			return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
				? undefined
				: 'Saisissez un identifiant UUID valide.'
		case 'sqlBinary':
			return /^[01]+$/.test(value) ? undefined : 'Saisissez uniquement des 0 et des 1.'
		case 'sqlDate':
			if (dateKind.value === 'date' && !(/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)))) {
				return 'Saisissez une date valide au format AAAA-MM-JJ.'
			}
			if (dateKind.value === 'time' && !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)) {
				return 'Saisissez une heure valide au format HH:MM ou HH:MM:SS.'
			}
			if (dateKind.value === 'timestamp' && !(/^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?)?$/.test(value) && !Number.isNaN(Date.parse(value.replace(' ', 'T'))))) {
				return 'Saisissez une date et heure valides au format AAAA-MM-JJ HH:MM:SS.'
			}
			return undefined
		default:
			return undefined
	}
}

const inputError = computed(() => {
	const error = validateValue(inputText.value)
	if (error) return error
	if (isArray.value && values.value.includes(inputText.value.trim())) return 'Cette valeur est déjà dans la liste.'
	return undefined
})

const errorMessage = computed(() => operatorError.value ?? inputError.value)

watch(
	errorMessage,
	(message) => {
		hasError.value = Boolean(message)
	},
	{ immediate: true, flush: 'sync' }
)

const canAdd = computed(() => Boolean(inputText.value.trim()) && !inputError.value)

function formatItem(value: string): string {
	return category.value === 'sqlString' ? `'${value.replace(/'/g, "''")}'` : value
}

const serialized = computed(() => {
	if (!isArray.value) return inputText.value
	return values.value.length ? `(${values.value.map(formatItem).join(', ')})` : ''
})

function addValue() {
	if (props.disabled || !canAdd.value) return
	values.value.push(inputText.value.trim())
	inputText.value = ''
}

function removeValue(index: number) {
	values.value.splice(index, 1)
}

function onEnter(event: KeyboardEvent) {
	if (!isArray.value) return
	event.preventDefault()
	addValue()
}

// Dernière valeur du modèle avec laquelle l'état local est synchronisé.
let syncedValue: string | undefined

watch(
	[isArray, () => model.value],
	([array, value], previous) => {
		const previousArray = previous?.[0]
		if (previousArray !== undefined && array !== previousArray && value === syncedValue) {
			// Changement d'opérateur par l'utilisateur : on conserve la saisie en cours.
			if (array) {
				values.value = inputText.value.trim() ? [inputText.value.trim()] : []
				inputText.value = ''
			} else {
				inputText.value = values.value[0] ?? ''
				values.value = []
			}
			return
		}
		if (value === serialized.value) return

		syncedValue = value
		if (array) {
			values.value = parseSqlList(value ?? '').map(String)
			inputText.value = ''
		} else {
			inputText.value = value ?? ''
			values.value = []
		}
	},
	{ immediate: true }
)

watch(serialized, (value) => {
	syncedValue = value
	if (value !== model.value) model.value = value
})
</script>

<template>
	<div class="sql-input" :class="{ 'sql-input--array': isArray }">
		<DsfrInputGroup :error-message="errorMessage" :disabled="disabled">
			<template #default="{ isInvalid, descriptionId }">
				<div class="sql-input__field">
					<DsfrInput
						v-model="inputText"
						label="Valeur"
						label-visible
						:is-invalid="isInvalid"
						:description-id="[hint ? hintId : undefined, descriptionId].filter(Boolean).join(' ') || undefined"
						:disabled="disabled"
						@keydown.enter="onEnter"
					/>
					<DsfrButton
						v-if="isArray"
						class="sql-input__add"
						icon="fr-icon-add-line"
						icon-only
						tertiary
						no-outline
						size="sm"
						label="Ajouter la valeur"
						:disabled="disabled || !canAdd"
						@click="addValue"
					/>
				</div>
				<p v-if="hint" :id="hintId" class="sql-input__hint fr-hint-text">{{ hint }}</p>
			</template>
		</DsfrInputGroup>

		<ul v-if="isArray && values.length" class="sql-input__values" aria-label="Valeurs ajoutées">
			<li v-for="(value, index) in values" :key="value" class="sql-input__value">
				<span class="fr-tag fr-tag--sm">
					{{ value }}
					<button
						type="button"
						class="sql-input__remove fr-icon-close-line fr-icon--xs"
						:title="`Retirer ${value}`"
						:aria-label="`Retirer ${value}`"
						:disabled="disabled"
						@click="removeValue(index)"
					/>
				</span>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.sql-input__field {
	position: relative;
}

.sql-input__hint {
	margin: 0.5rem 0 0;
}

.sql-input--array :deep(.fr-input) {
	padding-right: 2.5rem;
}

.sql-input__add {
	position: absolute;
	right: 0.25rem;
	bottom: 0.25rem;
}

.sql-input__values {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.sql-input__remove {
	margin-left: 0.25rem;
	padding: 0;
	background: none;
	border: none;
	cursor: pointer;
	opacity: 0;
	transition: opacity 0.15s;
}

.sql-input__value:hover .sql-input__remove,
.sql-input__value:focus-within .sql-input__remove {
	opacity: 1;
}
</style>

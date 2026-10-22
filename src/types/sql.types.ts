/** Paramètres entiers, avec ou sans espace avant les parenthèses. */
type ParameterizedType<Name extends string, Parameters extends string = `${bigint}`> =
  | Name
  | `${Name}${'' | ' '}(${Parameters})`;

type DateTimeType =
  | ParameterizedType<'time' | 'timestamp'>
  | `${ParameterizedType<'time' | 'timestamp'>} ${'with' | 'without'} time zone`
  | ParameterizedType<'timetz' | 'timestamptz'>;

type IntervalFields =
  | 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
  | 'year to month'
  | 'day to hour' | 'day to minute' | 'day to second'
  | 'hour to minute' | 'hour to second'
  | 'minute to second';

/** Types texte, y compris les alias et types paramétrés PostgreSQL. */
export type sqlString =
  | ParameterizedType<'character' | 'char' | 'character varying' | 'varchar'>
  | 'text';

/** Types numériques, y compris les alias entiers, flottants et sériels. */
export type sqlNumber =
  | 'bigint' | 'int8' | 'bigserial' | 'serial8'
  | 'integer' | 'int' | 'int4'
  | 'smallint' | 'int2' | 'smallserial' | 'serial2' | 'serial' | 'serial4'
  | 'double precision' | 'float8' | ParameterizedType<'float'>
  | 'real' | 'float4'
  | 'money'
  | ParameterizedType<'numeric' | 'decimal', `${bigint}` | `${bigint},${'' | ' '}${bigint}`>;

/** Date, heure, horodatage et intervalles. */
export type sqlDate =
  | 'date'
  | DateTimeType
  | ParameterizedType<'interval'>
  | `interval ${IntervalFields}`
  | ParameterizedType<`interval ${'second' | 'day to second' | 'hour to second' | 'minute to second'}`>;

/** Types géométriques PostgreSQL et types spatiaux PostGIS usuels. */
export type sqlGeometry =
  | 'box' | 'circle' | 'line' | 'lseg' | 'path' | 'point' | 'polygon'
  | 'geometry' | `geometry(${string})`
  | 'geography' | `geography(${string})`;

export type sqlBoolean = 'boolean' | 'bool';

/** Types structurés ou semi-structurés. */
export type sqlObject = 'json' | 'jsonb' | 'xml';

export type sqlBinary =
  | 'bytea'
  | ParameterizedType<'bit' | 'bit varying' | 'varbit'>;

export type sqlNetwork = 'cidr' | 'inet' | 'macaddr' | 'macaddr8';
export type sqlIdentifier = 'uuid';
export type sqlSearch = 'tsquery' | 'tsvector';
export type sqlSystem = 'pg_lsn' | 'pg_snapshot' | 'txid_snapshot';

/**
 * Catégories de types SQL utilisables par les formulaires et filtres de l'UI.
 * Les alias concrets PostgreSQL restent disponibles dans chaque catégorie.
 * @see https://www.postgresql.org/docs/current/datatype.html
 */
export type SqlDataTypeCategory =
  | 'sqlString'
  | 'sqlNumber'
  | 'sqlDate'
  | 'sqlGeometry'
  | 'sqlBoolean'
  | 'sqlObject'
  | 'sqlBinary'
  | 'sqlNetwork'
  | 'sqlIdentifier'
  | 'sqlSearch'
  | 'sqlSystem';

/** Union de tous les noms de types précis acceptés dans les métadonnées. */
export type dataTypes =
  | sqlString
  | sqlNumber
  | sqlDate
  | sqlGeometry
  | sqlBoolean
  | sqlObject
  | sqlBinary
  | sqlNetwork
  | sqlIdentifier
  | sqlSearch
  | sqlSystem;

/**
 * Classe un nom de type reçu des métadonnées pour faciliter le choix des
 * contrôles et opérateurs dans l'UI. Les paramètres de type sont ignorés.
 */
export function getSqlDataTypeCategory(type: string): SqlDataTypeCategory | undefined {
  const normalizedType = type.trim().toLowerCase();
  const baseType = normalizedType.replace(/\s*\([^)]*\)/g, '').trim();

  if (/^(character|char|character varying|varchar|text)$/.test(baseType)) return 'sqlString';
  if (/^(bigint|int8|bigserial|serial8|integer|int|int4|smallint|int2|smallserial|serial2|serial|serial4|double precision|float8|float|real|float4|money|numeric|decimal)$/.test(baseType)) return 'sqlNumber';
  if (/^(date|time|timetz|timestamp|timestamptz|interval)(\s|$)/.test(baseType)) return 'sqlDate';
  if (/^(box|circle|line|lseg|path|point|polygon|geometry|geography)$/.test(baseType)) return 'sqlGeometry';
  if (/^(boolean|bool)$/.test(baseType)) return 'sqlBoolean';
  if (/^(json|jsonb|xml)$/.test(baseType)) return 'sqlObject';
  if (/^(bytea|bit|bit varying|varbit)$/.test(baseType)) return 'sqlBinary';
  if (/^(cidr|inet|macaddr|macaddr8)$/.test(baseType)) return 'sqlNetwork';
  if (baseType === 'uuid') return 'sqlIdentifier';
  if (/^(tsquery|tsvector)$/.test(baseType)) return 'sqlSearch';
  if (/^(pg_lsn|pg_snapshot|txid_snapshot)$/.test(baseType)) return 'sqlSystem';

  return undefined;
}

// Map des types autorisés pour opérateurs SQL
type OperatorMap = {
  universalOperator: {
    operators: "=" | "!=";
    value: string | number | boolean;
  };

  numberOperator: {
    operators: "<" | "<=" | ">" | ">=";
    value: number;
  };

  stringOperator: {
    operators: "LIKE" | "NOT LIKE";
    value: string;
  };

  arrayOperator: {
    operators: "IN" | "NOT IN";
    value: (string | number | boolean)[];
  };

  nullOperator: {
    operators: "IS NULL" | "IS NOT NULL";
    value: null;
  };
};

export type Operator = OperatorMap[keyof OperatorMap]["operators"];

export type Filter = {
  [K in keyof OperatorMap]: {
    attribute: string;
    operator: OperatorMap[K]["operators"];
    value: OperatorMap[K]["value"];
  }
}[keyof OperatorMap] | undefined;
 
export type FilterGroup = {
    logicalOperator: logicalOperator;
    filters: (Filter | FilterGroup)[];
} | undefined;

export type ExportedAttributes = string[]

export type ClauseWhere = {
    table: string;
    filter : Filter | FilterGroup;
    exportedAttributes: ExportedAttributes;
} | undefined;

export type TableAttributes = {
    [tableName: string]: {
        attributes: string[];
    }
} |  {};

export type logicalOperator = 'AND' | 'OR';
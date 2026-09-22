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
};

export type Operator = OperatorMap[keyof OperatorMap]["operators"];

export type Filter = {
  [K in keyof OperatorMap]: {
    attribute: string;
    operator: OperatorMap[K]["operators"];
    value: OperatorMap[K]["value"];
  }
}[keyof OperatorMap];
 
export type FilterGroup = {
    logicalOperator: logicalOperator;
    filters: (Filter | FilterGroup)[];
}

export type ExportedAttributes = string[]

export type ClauseWhere = {
    table: string;
    filter : Filter | FilterGroup;
    exportedAttributes: ExportedAttributes;
}

export type TableAttributes = {
    [tableName: string]: {
        attributes: string[];
    }
}

export type logicalOperator = 'AND' | 'OR';
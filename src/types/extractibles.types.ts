/**
 * https://data.geopf.fr/extraction/processes?page=1&limit=10
 * Un process GPF est associé à une liste 
 * links[]
 * ProcessLink est le type de ces liens,
 * qui contiennent notamment un lien "describedby" vers les métadonnées de l'extractible
 *  
 */
export type ProcessLink = {
  rel: string;
  type: string;
  title: string;
  href: string;
};

/**
 * https://data.geopf.fr/api/users/me/stored_data/{stored_data_id}
 * les infos des tables sont contenus dans 
 * type_infos -> { relations: ExtractibleRelation[] };
 * 
 */
export type Extractible = {
    name: string;
    extent: any
    creation: string;
    srs: string;
    contact: string;
    size: number;
    status: string;
    type_infos: { relations: ExtractibleRelation[] };
    [key: string]: any;  // autres propriétés autorisées
}

export type ExtractibleRelation = {
    name: string;
    type: string;
    attributes: { [key: string]: any };
}

/**
 * https://data.geopf.fr/api/processes/{processID}/execution
 * le corps de la requête pour lancer une extraction :
 *  
 */
export type ExtractionRequestBody = {
    inputs : {
        [key: string]: any;
        relations?: RelationInput;
        format?: string;
        append?: boolean;
        srs?: string;
    },
    outputs : {
        logs?: Object;
        summary?: Object;
        extractedData: Object;
    }
}

export type createExtractionResponse = {
    jobID: string;
    status: string;
    message: string;
    created: string;
    finished: string;
    updated: string;
    links: ProcessLink[];
    started: string;
    processID: string;
    type: string;
}

export type createExtractionErrorResponse = {
    type: string;
    title: string;
    status: number;
    detail: string;
}

export type createExtractionUnauthorizedErrorResponse = {
    error: string;
    errorDescription: string[];
}

export type RelationInput = {
    [key: string]: {
    attributes: string[];
    filters: string;
}}

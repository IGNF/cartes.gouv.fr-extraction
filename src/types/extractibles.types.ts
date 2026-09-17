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
    _id: string; // ID de l'extractible
    // ajouté pour faciliter les requêtes d'extraction
    processID: string; // ID du process associé à l'extractible
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
        /** La compression de sortie */
        compression?: '7zip';
        /**
         * Détails des tables à extraire et filtres à appliquer sous la forme
         * {"nom_table" :{"attributes" :["champ1","champ2"],"filters" :"champ1 ='valeur_a_respecter'.."},
         *  "nom_table2" :{"attributes" :["champ1","champ2"],"filters" :"champ1='valeur_a_respecter'.."}...}.
         * La syntaxe du filtre est une clause WHERE POSTGRESQL/POSTGIS qui peut inclure
         * une ou plusieurs fonctions spatiales.
         */
        relations: RelationInput;
        /**
         * La projection de sortie des données géométrie sous la forme EPSG:xxxx
         * où xxxx est le code EPSG de la projection souhaitée.
         */
        srs?: string;
        /** Le format de sortie */
        format: 'PGDUMP' | 'ESRI SHAPEFILE' | 'GEOJSON' | 'GPKG' | 'GML' | 'PARQUET';
        /**
         * Indique pour les formats possible si un seul fichiers doit être produit
         * en sortie pour l'ensemble des relations.
         */
        append?: boolean;
        /**
         * Durée (en heures) du temps de conservation des données extraites à partir
         * de leur mise à disposition via l'API de résultats (par défaut : {DEFAULT_LIFETIME) heures).
         */
        retentionDuration?: number;
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



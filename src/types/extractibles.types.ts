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
 * type_infos -> Relation[]
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
    type_infos: Relation[];
    [key: string]: any;  // autres propriétés autorisées
}

export type Relation = {
    name: string;
    type: string;
    attributes: { [key: string]: any };
}
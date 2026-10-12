// cf. https://github.com/IGNF/cartes.gouv.fr/blob/main/assets/%40types/alert.ts
export interface IApiAlert {
  id: string;
  title: string;
  description?: string;
  link: { url?: string; label?: string };
  severity: "info" | "warning" | "alert";
  details?: string;
  date: string;
  visibility: {
    homepage: boolean;
    contact: boolean;
    map: boolean;
    serviceLevel: boolean;
    extraction: boolean;
  };
}

export interface IAlert extends Omit<IApiAlert, "date"> {
  date: Date;
}


// Types pour les extractions de l'utilisateur
export type ExtractionItem = {
  title: string
  status: string
  url: string
  launch_date: Date
  execution_url: string
}

export type Extraction = {
  status: string
  name: string
  url: string
  updated: Date
  jobID: string
}

export type RepositoryItem = {
  title: string
  description: string
  url_name: string
  extractions: ExtractionItem[]
}

// Type pour les liens dans les réponses API
export type Link = {
  rel: string
  type?: string
  title?: string
  href: string
}

// Type pour les jobs d'extraction
export type ExtractionJob = {
  jobID: string
  status: 'running' | 'successful' | 'failed' | 'dismissed'
  message?: string
  created: string
  finished?: string
  updated: string
  started?: string
  processID: string
  type: string
  links?: Link[]
}

// Type pour les fichiers téléchargeables dans les résultats
export type DownloadItem = {
  name: string
  href: string
  size?: number
  type?: string
}

// Type pour les résultats d'extraction d'un job
export type JobResult = {
  logs: string
  summary: Link
  extractData: Link
}

// Type pour la suppression d'un job d'extraction
export type DeleteExtractionResponse = {
  [key: string]: unknown
}

export type ExtractionErrorResponse = {
  type?: string
  title?: string
  status: number
  detail?: string
  [key: string]: unknown
}


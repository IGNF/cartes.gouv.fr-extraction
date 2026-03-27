export type ExtractionItem = {
  title: string
  status: string
  url: string
  launch_date: Date
  execution_url: string
}

export type RepositoryItem = {
  title: string
  description: string
  url_name: string
  extractions: ExtractionItem[]
}

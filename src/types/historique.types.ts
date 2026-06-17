import type { ExtractionRequestBody } from '@/types/extractibles.types'

export type DocumentListItem = {
    creation: string
    update: string
    name: string
    size: number
    _id: string
}

export type DocumentCreateRequestBody = {
	file: File
	name: string
	description?: string
	labels?: string[]
}

export type HistoricFileContent = {
    name: string
    params: ExtractionRequestBody
    jobID: string
    uuidStoredData: string
}

export type HistoricContentWithDocumentID = HistoricFileContent & {
    documentID: string
}
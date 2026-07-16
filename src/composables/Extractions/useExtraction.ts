import { useCreateExtractionRequest, useDeleteExtractionRequest } from "@/composables/Extractions/gpfRequests";
import type { DeleteExtractionResponse } from "@/types/my-extractions.types";
import type { ExtractionRequestBody, createExtractionResponse } from "@/types/extractibles.types";
import type { HistoricFileContent } from "@/types/historique.types";
import { isExtractionErrorResponse } from '@/composables/Extractions/gpfRequests'
import { useCreateHistoricDocument, useDeleteExtractionHistoricDocument } from "./historicRequests";
import { useCreateExtractionStore } from '@/stores/createExtractionStore'


export async function useCreateExtraction(
  requestBody: ExtractionRequestBody | undefined,
  processID: string | undefined,
  extractionName: string
): Promise<createExtractionResponse | Error> {
  console.log('Création de l\'extraction avec les paramètres suivants :', requestBody)

  if (!requestBody) return new Error('Aucun paramètre d\'extraction défini.')
  if (!processID) return new Error('Aucun processID défini.')

  let response: createExtractionResponse
  try {
    const createResult = await useCreateExtractionRequest(requestBody, processID)
    if (isExtractionErrorResponse(createResult)) {
      return new Error(createResult.detail || createResult.title || 'Erreur lors de la création du job d\'extraction.')
    }
    response = createResult
  } catch (error) {
    return error instanceof Error ? error : new Error('Erreur inconnue lors de la création du job d\'extraction.')
  }

  const historicContent: HistoricFileContent = {
    jobID: response.jobID,
    name: extractionName,
    params: requestBody,
    uuidStoredData: processID
  }

  try {
    await useCreateHistoricDocument(historicContent)
  } catch (error) {
    return error instanceof Error ? error : new Error('Erreur lors de la création du document historique.')
  }

  return response
}

export async function useDeleteExtraction(
  jobID: string,
  documentID: string,
  jobStatus?: string
): Promise<DeleteExtractionResponse | Error | null> {
  let deleteExtractionResponse: DeleteExtractionResponse | null

  if (jobStatus !== 'dismissed') {
    try {
      deleteExtractionResponse = await useDeleteExtractionRequest(jobID)
    } catch (error) {
      return error instanceof Error
        ? error
        : new Error('Erreur lors de la suppression du job d’extraction.')
    }
  }

  try {
    await useDeleteExtractionHistoricDocument(documentID)
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error('Erreur lors de la suppression du document historique.')
  }
 
  return deleteExtractionResponse
}

export async function useRelaunchExtraction(
  requestBody: ExtractionRequestBody | undefined,
  jobID: string,
  documentID: string,
  processID: string | undefined,
  extractionName: string,
  jobStatus?: string
): Promise<createExtractionResponse | Error> {
  console.log('Relance de l\'extraction avec les paramètres suivants :', requestBody)

  if (!requestBody) return new Error('Aucun paramètre d\'extraction défini.')
  if (!jobID) return new Error('Aucun jobID défini.')

  // 1) Suppression du job d'extraction existant et du document historique associé
  const deleteResponse = await useDeleteExtraction(jobID, documentID, jobStatus)
  if (deleteResponse instanceof Error) {
    return deleteResponse
  }

  // 2) Création ensuite
  const createResponse = await useCreateExtraction(requestBody, processID, extractionName)
  if (createResponse instanceof Error) {
    return createResponse
  }

  return createResponse
}

export function useRelaunchExtractionWithNewParams(
  requestBody: ExtractionRequestBody | undefined,
  processID: string | undefined,
): void {
  console.log('Relance de l\'extraction avec de nouveaux paramètres :', requestBody)
  const store = useCreateExtractionStore()
  store.selectedExtractibleID = processID ?? null
  store.requestBody = requestBody
}
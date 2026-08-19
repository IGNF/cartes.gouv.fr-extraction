/**
 * Ce fichier contient les fonctions de manipulation des fichiers d'historicisation des extractions
 * 
 * Chaque fonction fait des appels à l'API des document au sens GPF
 * Pour créer, supprimer, lister et récupérer le contenu des documents d'historique
 * 
 * Les documents sont stockés dans l'API GPF avec un label spécifique pour les extractions : "cartes.gouv.fr-extraction"
 * Le nom des fichiers est généré à partir du jobID de l'extraction : "EXTRACTION_{jobID}.json"
 * 
 * Le contenu des fichiers est de type HistoricFileContent, qui contient les informations nécessaires pour reconstituer l'extraction.
 */


import type { DocumentCreateRequestBody, HistoricFileContent, DocumentListItem, HistoricContentWithDocumentID } from '@/types/historique.types'
import { useAppStore } from '@/stores/appStore'

export function useGetHistoricFilename(jobID: string): string {
    return `EXTRACTION_${jobID}.json`
}

export async function useCreateHistoricDocument(historicContent: HistoricFileContent): Promise<void> {
    const appStore = useAppStore()
    const service = appStore.service
    const documentsApiBase = service?.api ?? 'https://data.geopf.fr/api'

    if (!service) {
        throw new Error('Service API non initialisé')
    }

    try {
        const documentPayload: DocumentCreateRequestBody = {
            file: new File(
                [JSON.stringify(historicContent)],
                useGetHistoricFilename(historicContent.jobID),
                { type: 'application/json' }
            ),
            name: useGetHistoricFilename(historicContent.jobID),
            description: `Job ID: ${historicContent.jobID}`,
            labels: ['extraction', historicContent.jobID],
        }

        const formData = new FormData()
        formData.append('file', documentPayload.file)
        formData.append('name', documentPayload.name)
        if (documentPayload.description) {
            formData.append('description', documentPayload.description)
        }
        let labels = ['cartes.gouv.fr-extraction']
        formData.append('labels', labels.join(','))

        const response = await service.getFetch()(`${documentsApiBase}/users/me/documents`, {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error(`Erreur lors de la création du document: ${response.status}`)
        }

        console.log('Document historique créé avec succès :', useGetHistoricFilename(historicContent.jobID))
    } catch (error: unknown) {
        console.error('Erreur lors de la création du document historique :', error)
        throw error
    }
}

export async function useGetHistoricDocumentContent(jobID: string): Promise<HistoricFileContent | null> {
    const appStore = useAppStore()
    const service = appStore.service
    const documentsApiBase = service?.api ?? 'https://data.geopf.fr/api'

    if (!service) {
        throw new Error('Service API non initialisé')
    }

    try {
        const query = new URLSearchParams({
            name: useGetHistoricFilename(jobID),
            labels: 'cartes.gouv.fr-extraction',
        })

        const listResponse = await service.getFetch()(`${documentsApiBase}/users/me/documents?${query.toString()}`, {
            method: 'GET',
        })

        if (!listResponse.ok) {
            if (listResponse.status === 404) {
                console.warn(`Document historique pour le job ID ${jobID} non trouvé.`)
                return null
            }
            throw new Error(`Erreur lors de la récupération de la liste des documents: ${listResponse.status}`)
        }

        const documents: DocumentListItem[] = await listResponse.json()
        const firstDocument = documents[0]
        if (!firstDocument) {
            return null
        }

        const contentResponse = await service.getFetch()(
            `${documentsApiBase}/users/me/documents/${firstDocument._id}/file`,
            {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    Accept: '*/*',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            }
        )

        if (!contentResponse.ok) {
            if (contentResponse.status === 404) {
                console.warn(`Contenu du document historique ${firstDocument.name} non trouvé.`)
                return null
            }
            const errorBody = await contentResponse.text()
            const contentType = contentResponse.headers.get('content-type')
            throw new Error(
                `Erreur lors de la récupération du contenu du document: ${contentResponse.status} (content-type: ${contentType ?? 'inconnu'}) - ${errorBody}`
            )
        }

        const historicContent: HistoricFileContent = await contentResponse.json()
        return historicContent
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération du document historique :', error)
        throw error
    }
}

export async function useGetHistoricDocumentList(): Promise<HistoricContentWithDocumentID[]> {
    const appStore = useAppStore()
    const service = appStore.service
    const documentsApiBase = service?.api ?? 'https://data.geopf.fr/api'

    if (!service) {
        throw new Error('Service API non initialisé')
    }

    try {
        const query = new URLSearchParams({
            labels: 'cartes.gouv.fr-extraction',
        })

        const listResponse = await service.getFetch()(`${documentsApiBase}/users/me/documents?${query.toString()}`, {
            method: 'GET',
        })

        if (!listResponse.ok) {
            if (listResponse.status === 404) {
                console.warn('Documents d\'historique non trouvés.')
                return []
            }
            throw new Error(`Erreur lors de la récupération de la liste des documents: ${listResponse.status}`)
        }

        const documents: DocumentListItem[] = await listResponse.json()

        return await Promise.all(
            documents.map(async (document) => {
                const contentResponse = await service.getFetch()(
                    `${documentsApiBase}/users/me/documents/${document._id}/file`,
                    {
                        method: 'GET',
                        cache: 'no-cache',
                        headers: {
                            Accept: '*/*',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    }
                )

                if (!contentResponse.ok) {
                    const errorBody = await contentResponse.text()
                    const contentType = contentResponse.headers.get('content-type')
                    throw new Error(
                        `Erreur lors de la récupération du contenu du document d'historique ${document.name}: ${contentResponse.status} (content-type: ${contentType ?? 'inconnu'}) - ${errorBody}`
                    )
                }
                let content: HistoricFileContent = await contentResponse.json()
                return { ...content, documentID: document._id } as HistoricContentWithDocumentID
            })
        )
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération des documents d\'historique :', error)
        throw error
    }
}

export async function useDeleteExtractionHistoricDocument(documentID: string): Promise<void> {
    const appStore = useAppStore()
    const service = appStore.service
    const documentsApiBase = service?.api ?? 'https://data.geopf.fr/api'

    if (!service) {
        throw new Error('Service API non initialisé')
    }

    try {
        const response = await service.getFetch()(`${documentsApiBase}/users/me/documents/${documentID}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error(`Erreur lors de la suppression du document d'historique: ${response.status}`)
        }

        console.log(`Document d'historique supprimé avec succès : ${documentID}`)
    } catch (error: unknown) {
        console.error('Erreur lors de la suppression du document d\'historique :', error)
        throw error
    }
}

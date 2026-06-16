import type {
    ExtractionRequestBody,
    createExtractionErrorResponse,
    createExtractionResponse,
    createExtractionUnauthorizedErrorResponse,
} from '@/types/extractibles.types';
import type {
    ExtractionJob,
    JobResult,
    Link,
    DownloadItem,
    DeleteExtractionResponse,
    ExtractionErrorResponse,
} from '@/types/my-extractions.types';
import { useAppStore } from '@/stores/appStore';
import JSZip from 'jszip';

export function isExtractionErrorResponse(value: unknown): value is ExtractionErrorResponse {
    return (
        typeof value === 'object'
        && value !== null
        && 'status' in value
        && typeof (value as ExtractionErrorResponse).status === 'number'
    );
}


export async function useCreateExtractionRequest(requestBody: ExtractionRequestBody, processID: string | undefined): Promise<createExtractionResponse | createExtractionErrorResponse | createExtractionUnauthorizedErrorResponse> {
    const appStore = useAppStore();
    const service = appStore.service;

    if (!service) {
        throw new Error('Service API non initialisé');
    }
        if (!processID) {
        throw new Error('Process ID non défini');
    }

    console.log('Lancement de l\'extraction avec les données suivantes :', requestBody);
    console.log('Service API utilisé :', service);
    try {
        const response = await service.getFetch()(`https://data.geopf.fr/extraction/processes/${processID}/execution`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

        const data = await response.json() as
            | createExtractionResponse
            | createExtractionErrorResponse
            | createExtractionUnauthorizedErrorResponse;

        if (!response.ok) {
            if (isExtractionErrorResponse(data)) {
                return data as ExtractionErrorResponse;
            }

            return {
                status: response.status,
                title: 'Erreur lors du lancement de l\'extraction',
                detail: 'Une erreur est survenue lors du lancement de l\'extraction.',
            } as ExtractionErrorResponse;
        }

        console.log('Extraction lancée avec succès :', data);
        return data as createExtractionResponse;
    } catch (error: unknown) {
        console.error('Erreur lors du lancement de l\'extraction :', error);

        if (isExtractionErrorResponse(error)) {
            return error as ExtractionErrorResponse;
        }

        return {
            status: 500,
            title: 'Erreur lors du lancement de l\'extraction',
            detail: 'Une erreur inattendue est survenue.',
        } as ExtractionErrorResponse;
    }
}

export async function useGetJobs(options?: {
    type?: 'PROCESS'
    processes?: string[]
    statuses?: ('RUNNING' | 'SUCCESSFUL' | 'FAILED' | 'DISMISSED')[]
    datetime?: string
    minDuration?: number
    maxDuration?: number
    page?: number
    limit?: number
}) {
    const appStore = useAppStore();
    const service = appStore.service;

    if (!service) {
        throw new Error('Service API non initialisé');
    }

    const searchParams = new URLSearchParams();
    
    if (options?.type) searchParams.append('type', options.type);
    if (options?.processes) {
        options.processes.forEach(process => searchParams.append('processes', process));
    }
    if (options?.statuses) {
        options.statuses.forEach(status => searchParams.append('statuses', status));
    }
    if (options?.datetime) searchParams.append('datetime', options.datetime);
    if (options?.minDuration !== undefined) searchParams.append('minDuration', options.minDuration.toString());
    if (options?.maxDuration !== undefined) searchParams.append('maxDuration', options.maxDuration.toString());
    if (options?.page !== undefined) searchParams.append('page', options.page.toString());
    if (options?.limit !== undefined) searchParams.append('limit', options.limit.toString());

    try {
        const url = `https://data.geopf.fr/extraction/jobs${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        const response = await service.getFetch()(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json() as {
            jobs: ExtractionJob[]
            links?: Link[]
        };

        if (!response.ok) {
            throw data;
        }

        console.log('Jobs récupérés avec succès :', data);
        return data.jobs;
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération des jobs :', error);
        throw error;
    }
}

export async function useGetJobByID(jobID: string) {
    const appStore = useAppStore();
    const service = appStore.service;

    if (!service) {
        throw new Error('Service API non initialisé');
    }

    try {
        const url = `https://data.geopf.fr/extraction/jobs/${jobID}`;
        const response = await service.getFetch()(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json() as ExtractionJob;

        if (!response.ok) {
            throw data;
        }

        console.log('Job récupéré avec succès :', data);
        return data;
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération du job :', error);
        throw error;
    }
}

export async function useGetExtractionResults(jobID: string) {
    const appStore = useAppStore();
    const service = appStore.service;

    if (!service) {
        throw new Error('Service API non initialisé');
    }

    try {
        const url = `https://data.geopf.fr/extraction/jobs/${jobID}/results`;
        const response = await service.getFetch()(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json() as JobResult;

        if (!response.ok) {
            throw data;
        }

        console.log('Résultats d\'extraction récupérés avec succès :', data);
        return data;
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération des résultats d\'extraction :', error);
        throw error;
    }
}

export async function useDeleteExtractionRequest(jobID: string): Promise<DeleteExtractionResponse | null> {
    const appStore = useAppStore();
    const service = appStore.service;

    if (!service) {
        throw new Error('Service API non initialisé');
    }

    try {
        const url = `https://data.geopf.fr/extraction/jobs/${jobID}`;
        const response = await service.getFetch()(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const rawBody = await response.text();
        const data = rawBody ? JSON.parse(rawBody) as DeleteExtractionResponse : null;

        if (!response.ok) {
            throw (data ?? { status: response.status, detail: 'Erreur lors de la suppression du job' }) as ExtractionErrorResponse;
        }

        console.log('Job supprimé avec succès :', { jobID, response: data });
        return data;
    } catch (error: unknown) {
        console.error('Erreur lors de la suppression du job :', error);
        throw error;
    }
}

export async function getResultDownloadList(jobResult: JobResult): Promise<DownloadItem[]> {
    try {
        const xmlUrl = jobResult.extractData.href;
        
        if (!xmlUrl) {
            throw new Error('URL du fichier extractData non disponible');
        }

        const response = await fetch(xmlUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/xml',
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération du fichier XML: ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // Vérifier les erreurs de parsing
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Erreur lors du parsing du fichier XML');
        }

        const downloadItems: DownloadItem[] = [];

        // Parser tous les éléments "entry" du feed Atom
        const entries = xmlDoc.getElementsByTagName('entry');
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            
            // Récupérer le lien de téléchargement
            const linkElement = entry.getElementsByTagName('link')[0];
            const href = linkElement?.getAttribute('href');
            const sizeText = linkElement?.getAttribute('gpf_dl:length');
            
            // Récupérer le type MIME
            const mimeTypeElement = entry.getElementsByTagName('gpf_dl:mime_type')[0];
            const type = mimeTypeElement?.textContent;

            if (href) {
                // Extraire le nom du fichier depuis l'URL
                const urlParts = href.split('/');
                const name = urlParts[urlParts.length - 1];

                downloadItems.push({
                    name,
                    href,
                    size: sizeText ? parseInt(sizeText, 10) : undefined,
                    type: type || undefined,
                });
            }
        }

        console.log('Liste de téléchargement récupérée avec succès :', downloadItems);
        return downloadItems;
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération de la liste de téléchargement :', error);
        throw error;
    }
}

export async function downloadAllItemsAsZip(downloadItems: DownloadItem[], archiveName = 'extraction-result.zip'): Promise<void> {
    if (!downloadItems.length) {
        throw new Error('La liste des fichiers à télécharger est vide');
    }

    const zip = new JSZip();

    for (const item of downloadItems) {
        const response = await fetch(item.href, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Erreur lors du téléchargement du fichier ${item.name}: ${response.status}`);
        }

        const fileBlob = await response.blob();
        const fileNameFromHref = item.href.split('/').pop() || 'fichier';
        const fileName = item.name || fileNameFromHref;

        zip.file(fileName, fileBlob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);

    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = archiveName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(zipUrl);
}
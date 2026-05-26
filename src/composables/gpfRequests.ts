import type {
    ExtractionRequestBody,
    createExtractionErrorResponse,
    createExtractionResponse,
    createExtractionUnauthorizedErrorResponse,
} from '@/types/extractibles.types';
import { useAppStore } from '@/stores/appStore';

export async function useCreateExtraction(requestBody: ExtractionRequestBody, processID: string) {
    const appStore = useAppStore();
    const service = appStore.service;

    if (!service) {
        throw new Error('Service API non initialisé');
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
            throw data;
        }

        console.log('Extraction lancée avec succès :', data);
        return data as createExtractionResponse;
    } catch (error: unknown) {
        console.error('Erreur lors du lancement de l\'extraction :', error);
        // Gérez les erreurs ici, comme afficher un message d'erreur à l'utilisateur
    }
}
import type { RepositoryItem } from '@/types/my-extractions.types'

const repoExtractionListData: RepositoryItem[] = [
  {
    title: 'Dossier d\'extraction 1',
    description: 'Description du dossier d\'extraction 1',
    url_name: 'dossier-extraction-1',
    extractions: [
      { title: 'Dossier d\'extraction 1 - Extraction A', status: 'En cours', url: '', launch_date: new Date('2024-01-01'), execution_url: '' },
      { title: 'Dossier d\'extraction 1 - Extraction B', status: 'Terminée', url: '', launch_date: new Date('2024-01-08'), execution_url: '' },
      { title: 'Dossier d\'extraction 1 - Extraction C', status: 'Échouée', url: '', launch_date: new Date('2024-01-15'), execution_url: '' },
    ],
  },
  {
    title: 'Dossier d\'extraction 2',
    description: 'Description du dossier d\'extraction 2',
    url_name: 'dossier-extraction-2',
    extractions: [
      { title: 'Dossier d\'extraction 2 - Extraction A', status: 'Terminée', url: '', launch_date: new Date('2024-01-02'), execution_url: '' },
      { title: 'Dossier d\'extraction 2 - Extraction B', status: 'Échouée', url: '', launch_date: new Date('2024-01-09'), execution_url: '' },
      { title: 'Dossier d\'extraction 2 - Extraction C', status: 'En cours', url: '', launch_date: new Date('2024-01-16'), execution_url: '' },
    ],
  },
  {
    title: 'Dossier d\'extraction 3',
    description: 'Description du dossier d\'extraction 3',
    url_name: 'dossier-extraction-3',
    extractions: [
      { title: 'Dossier d\'extraction 3 - Extraction A', status: 'Échouée', url: '', launch_date: new Date('2024-01-03'), execution_url: '' },
      { title: 'Dossier d\'extraction 3 - Extraction B', status: 'En cours', url: '', launch_date: new Date('2024-01-10'), execution_url: '' },
      { title: 'Dossier d\'extraction 3 - Extraction C', status: 'Terminée', url: '', launch_date: new Date('2024-01-17'), execution_url: '' },
    ],
  },
  {
    title: 'Dossier d\'extraction 4',
    description: 'Description du dossier d\'extraction 4',
    url_name: 'dossier-extraction-4',
    extractions: [
      { title: 'Dossier d\'extraction 4 - Extraction A', status: 'En cours', url: '', launch_date: new Date('2024-01-04'), execution_url: '' },
      { title: 'Dossier d\'extraction 4 - Extraction B', status: 'Terminée', url: '', launch_date: new Date('2024-01-11'), execution_url: '' },
      { title: 'Dossier d\'extraction 4 - Extraction C', status: 'Échouée', url: '', launch_date: new Date('2024-01-18'), execution_url: '' },
    ],
  },
  {
    title: 'Dossier d\'extraction 5',
    description: 'Description du dossier d\'extraction 5',
    url_name: 'dossier-extraction-5',
    extractions: [
      { title: 'Dossier d\'extraction 5 - Extraction A', status: 'Terminée', url: '', launch_date: new Date('2024-01-05'), execution_url: '' },
      { title: 'Dossier d\'extraction 5 - Extraction B', status: 'Échouée', url: '', launch_date: new Date('2024-01-12'), execution_url: '' },
      { title: 'Dossier d\'extraction 5 - Extraction C', status: 'En cours', url: '', launch_date: new Date('2024-01-19'), execution_url: '' },
    ],
  },
  {
    title: 'Périmètre urbain Nord',
    description: 'Extraction des données bâtimentaires de la zone urbaine Nord',
    url_name: 'perimetre-urbain-nord',
    extractions: [
      { title: 'Périmètre urbain Nord - Extraction A', status: 'Échouée', url: '', launch_date: new Date('2024-01-06'), execution_url: '' },
      { title: 'Périmètre urbain Nord - Extraction B', status: 'En cours', url: '', launch_date: new Date('2024-01-13'), execution_url: '' },
      { title: 'Périmètre urbain Nord - Extraction C', status: 'Terminée', url: '', launch_date: new Date('2024-01-20'), execution_url: '' },
    ],
  },
  {
    title: 'Zone industrielle Est',
    description: 'Données cadastrales et parcellaires du secteur industriel Est',
    url_name: 'zone-industrielle-est',
    extractions: [
      { title: 'Zone industrielle Est - Extraction A', status: 'En cours', url: '', launch_date: new Date('2024-01-07'), execution_url: '' },
      { title: 'Zone industrielle Est - Extraction B', status: 'Terminée', url: '', launch_date: new Date('2024-01-14'), execution_url: '' },
      { title: 'Zone industrielle Est - Extraction C', status: 'Échouée', url: '', launch_date: new Date('2024-01-21'), execution_url: '' },
    ],
  },
  {
    title: 'Réseau hydrographique',
    description: 'Extraction du réseau hydrographique et zones inondables',
    url_name: 'reseau-hydrographique',
    extractions: [
      { title: 'Réseau hydrographique - Extraction A', status: 'Terminée', url: '', launch_date: new Date('2024-01-08'), execution_url: '' },
      { title: 'Réseau hydrographique - Extraction B', status: 'Échouée', url: '', launch_date: new Date('2024-01-15'), execution_url: '' },
      { title: 'Réseau hydrographique - Extraction C', status: 'En cours', url: '', launch_date: new Date('2024-01-22'), execution_url: '' },
    ],
  },
  {
    title: 'Occupation des sols 2024',
    description: 'Cartographie de l\'occupation des sols pour l\'année 2024',
    url_name: 'occupation-sols-2024',
    extractions: [
      { title: 'Occupation des sols 2024 - Extraction A', status: 'Échouée', url: '', launch_date: new Date('2024-01-09'), execution_url: '' },
      { title: 'Occupation des sols 2024 - Extraction B', status: 'En cours', url: '', launch_date: new Date('2024-01-16'), execution_url: '' },
      { title: 'Occupation des sols 2024 - Extraction C', status: 'Terminée', url: '', launch_date: new Date('2024-01-23'), execution_url: '' },
    ],
  },
  {
    title: 'Voirie communale',
    description: 'Extraction du réseau de voirie communale et intercommunale',
    url_name: 'voirie-communale',
    extractions: [
      { title: 'Voirie communale - Extraction A', status: 'En cours', url: '', launch_date: new Date('2024-01-10'), execution_url: '' },
      { title: 'Voirie communale - Extraction B', status: 'Terminée', url: '', launch_date: new Date('2024-01-17'), execution_url: '' },
      { title: 'Voirie communale - Extraction C', status: 'Échouée', url: '', launch_date: new Date('2024-01-24'), execution_url: '' },
    ],
  },
  {
    title: 'Espaces naturels protégés',
    description: 'Données relatives aux espaces naturels et zones Natura 2000',
    url_name: 'espaces-naturels-proteges',
    extractions: [
      { title: 'Espaces naturels protégés - Extraction A', status: 'Terminée', url: '', launch_date: new Date('2024-01-11'), execution_url: '' },
      { title: 'Espaces naturels protégés - Extraction B', status: 'Échouée', url: '', launch_date: new Date('2024-01-18'), execution_url: '' },
      { title: 'Espaces naturels protégés - Extraction C', status: 'En cours', url: '', launch_date: new Date('2024-01-25'), execution_url: '' },
    ],
  },
  {
    title: 'PLU secteur Sud',
    description: 'Données du Plan Local d\'Urbanisme pour le secteur Sud',
    url_name: 'plu-secteur-sud',
    extractions: [
      { title: 'PLU secteur Sud - Extraction A', status: 'Échouée', url: '', launch_date: new Date('2024-01-12'), execution_url: '' },
      { title: 'PLU secteur Sud - Extraction B', status: 'En cours', url: '', launch_date: new Date('2024-01-19'), execution_url: '' },
      { title: 'PLU secteur Sud - Extraction C', status: 'Terminée', url: '', launch_date: new Date('2024-01-26'), execution_url: '' },
    ],
  },
  {
    title: 'Risques naturels',
    description: 'Extraction des zonages de risques naturels et technologiques',
    url_name: 'risques-naturels',
    extractions: [
      { title: 'Risques naturels - Extraction A', status: 'En cours', url: '', launch_date: new Date('2024-01-13'), execution_url: '' },
      { title: 'Risques naturels - Extraction B', status: 'Terminée', url: '', launch_date: new Date('2024-01-20'), execution_url: '' },
      { title: 'Risques naturels - Extraction C', status: 'Échouée', url: '', launch_date: new Date('2024-01-27'), execution_url: '' },
    ],
  },
  {
    title: 'Patrimoine historique',
    description: 'Inventaire des monuments et sites classés au patrimoine historique',
    url_name: 'patrimoine-historique',
    extractions: [
      { title: 'Patrimoine historique - Extraction A', status: 'Terminée', url: '', launch_date: new Date('2024-01-14'), execution_url: '' },
      { title: 'Patrimoine historique - Extraction B', status: 'Échouée', url: '', launch_date: new Date('2024-01-21'), execution_url: '' },
      { title: 'Patrimoine historique - Extraction C', status: 'En cours', url: '', launch_date: new Date('2024-01-28'), execution_url: '' },
    ],
  },
  {
    title: 'Infrastructures transport',
    description: 'Réseau de transport en commun et infrastructures routières majeures',
    url_name: 'infrastructures-transport',
    extractions: [
      { title: 'Infrastructures transport - Extraction A', status: 'Échouée', url: '', launch_date: new Date('2024-01-15'), execution_url: '' },
      { title: 'Infrastructures transport - Extraction B', status: 'En cours', url: '', launch_date: new Date('2024-01-22'), execution_url: '' },
      { title: 'Infrastructures transport - Extraction C', status: 'Terminée', url: '', launch_date: new Date('2024-01-29'), execution_url: '' },
    ],
  },
]

export function useGetMyExtractions() {
  const repoExtractionList = computed<RepositoryItem[]>(() => repoExtractionListData)

  return {
    repoExtractionList,
  }
}

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createAuthFetch } from 'authentification-vue-oidc'
import type { Extractible, ProcessLink } from '@/types/extractibles.types'
import { getRuntimeConfig } from '@/config/configService'

import { useLogger } from 'vue-logger-plugin'


export const useDataStore = defineStore('data', () => {

    const extractible = ref<Extractible[]>([])
    const log = useLogger()

    function getExtractible() {
        return extractible.value
    }

    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)
    let generation = 0

    function resetData() {
        generation++
        extractible.value = []
        loading.value = false
        error.value = null
    }

    async function fetchData() {
        const currentGeneration = ++generation
        loading.value = true
        error.value = null
          log.debug("Fetching data... extraction")
        const extractionApiBaseUrl = getRuntimeConfig().IAM_API_EXTRACTION_URL

        try {
        if (!extractionApiBaseUrl) throw new Error('Service API non initialisé')
        const authFetch = createAuthFetch()
        const response = await authFetch(
          `${extractionApiBaseUrl}/processes?page=1&limit=10`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`)
        }

        const data = await response.json()
        const results = await Promise.all(
          data.processes.map(async (p: { id: string; links: ProcessLink[] }) => {
            const href = p.links.find((link: ProcessLink) => link.rel === "describedby")?.href;
            if (!href) return null;
              const res = await authFetch(href,      {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if (!res.ok) throw new Error(`Erreur ${res.status}`)
            const json = await res.json();
            // on ajoute le processID à l'extractible pour faciliter les requêtes d'extraction
            return { ...json, processID: p.id }
          })
        );
          if (currentGeneration !== generation) return
          extractible.value = results.filter((r): r is Extractible => r !== null);
        } 
        catch (err) {
          if (currentGeneration !== generation) return
          error.value = 'Impossible de charger les données extractibles.'
            if (err instanceof Error) {
              log.error(err.message);
            } else {
              log.error("Erreur inconnue", err);
            }
        } 
        finally {
          if (currentGeneration === generation) loading.value = false
        }
    }


    return { 
        extractible,
        loading,
        error,
        fetchData,
        resetData,
        getExtractible
    }
})
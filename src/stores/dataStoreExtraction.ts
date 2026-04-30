import { defineStore } from 'pinia'
import type { Extractible, ProcessLink } from '@/types/extractibles.types'

import { useLogger } from 'vue-logger-plugin'


export const useDataStore = defineStore('data', () => {

    const extractible = ref<Extractible[]>([])
    const log = useLogger()

    function getExtractible() {
        return extractible.value
    }

    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)

    async function fetchData(service: any) {
          log.debug("Fetching data... extraction")
          log.debug("API URL:", service)
        try {
        const response = await service.getFetch()(
          // `${appStore.service.api}/extraction/processes?page=1&limit=10`,
          'https://data.geopf.fr/extraction/processes?page=1&limit=10',
          {
            headers: {
              // 'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`)
        }

        const data = await response.json()
        const results = await Promise.all(
        data.processes.map(async (p) => {
          const href = p.links.find((link: ProcessLink) => link.rel === "describedby")?.href;
          if (!href) return null;
            const res = await service.getFetch()(href,      {
            headers: {
              'Content-Type': 'application/json'
            }
          });
            return res.json();
          })
        );
          extractible.value = results.filter((r): r is Extractible => r !== null);
        } 
        catch (err) {
            if (err instanceof Error) {
              log.error(err.message);
            } else {
              log.error("Erreur inconnue", err);
            }
        } 
        finally {
          loading.value = false
        }
    }


    return { 
        extractible,
        loading,
        error,
        fetchData,
        getExtractible
    }
})
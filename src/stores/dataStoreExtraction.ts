import { defineStore } from 'pinia'
import type { Extractible, ProcessLink } from '@/types/extractibles.types'

export const useDataStore = defineStore('data', () => {
    const extractible = ref<Extractible[]>([])

    function getExtractible() {
        return extractible.value
    }

    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)

    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJuQTM1bFJNeWVEMnU3WGJDTk9UbTRORjE0eTNoYlBMcGw4TXQtVzR3STJnIn0.eyJleHAiOjE3NzQ0ODExMTUsImlhdCI6MTc3NDQzNzkxNSwianRpIjoidHJydGNjOjE3NDQ1MmVlLTQ5NTgtNDVkNS05YjNmLTkwYmNlYjIxOWQ3OCIsImlzcyI6Imh0dHBzOi8vc3NvLmdlb3BmLmZyL3JlYWxtcy9nZW9wbGF0ZWZvcm1lIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImEyOGEwYmQxLWQ2MjktNDg2NS04M2E2LTg4NDIyZTFkY2E4ZSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImNhcnRlcy5nb3V2LWVudHJlZS1jYXJ0byIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9jYXJ0ZXMuZ291di5mciJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1nZW9wbGF0ZWZvcm1lIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsImRlbGV0ZS1hY2NvdW50Iiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiY2xpZW50SG9zdCI6IjEwLjIuODUuMCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWNhcnRlcy5nb3V2LWVudHJlZS1jYXJ0byIsImNsaWVudEFkZHJlc3MiOiIxMC4yLjg1LjAiLCJjbGllbnRfaWQiOiJjYXJ0ZXMuZ291di1lbnRyZWUtY2FydG8ifQ.ybfAX_3ZQ2Y80ASqcP09iC1EhoVmzlEWZB7MZ26oSQDXeE9fepK3GQl6rZYTt2YWLVtocLXOGCrejw7COkOC4m2JeAGDpkMFGejr4dN_ZlZyvG8pZY_D0-zJXUq1RT7NbNDOUHoafokyoCDP6RjaFaoeRdKPKOLRdb0r8uHTXptt5mJXfzX-uPJzN24dnfe4Eb--J27_zXn6FvrSXmLOjmnjU45tpm76ZPVsubPmPp-P_wKpw4i9p5YYwk8P3nevaJqH5P6dqUmN02use0acWQRIbssaFsaxmF1tWiSM4GVu6bg11HaIdbJW2vYnr6eYocCkMuIzXQ011fV3zgbKCg' // récupéré via ton SSO

    async function fetchData() {
        try {
        const response = await fetch(
          'https://data.geopf.fr/extraction/processes?page=1&limit=10',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
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
            const res = await fetch(href,      {
            headers: {
              'Authorization': `Bearer ${token}`,
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
              console.log(err.message);
            } else {
              console.log("Erreur inconnue", err);
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
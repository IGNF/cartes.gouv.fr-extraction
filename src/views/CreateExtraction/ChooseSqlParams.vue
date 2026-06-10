<script setup lang="ts">
import type { Extractible, ExtractionRequestBody, RelationInput } from '@/types/extractibles.types';
import { CgfrSqlEditor } from 'cartes.gouv.fr-vue-components'
import ChooseSqlParamsMap from '../Cartes/ChooseSqlParamsMap.vue';

const props = defineProps<{
    extractible: Extractible | null
}>()

const model = defineModel<ExtractionRequestBody>()

const code = ref()
const format = ref<ExtractionRequestBody['inputs']['format']>('GPKG')
const projection = ref('EPSG:4326')
const encoding = ref('UTF-8')
const relations = ref<RelationInput>({})

const tables = computed(() => {
    if (!props.extractible) return []
    return props.extractible.type_infos.relations.map(rel => rel.name)
})

onMounted(() => {
    console.log('Extractible reçu dans ChooseSqlParams :', props.extractible);
})

const requestBody = computed((): ExtractionRequestBody => {
    return {
        inputs: {
            format: format.value, 
            srs: projection.value,
            relations: relations.value,
        },
        outputs: {
            logs : {},
            summary : {},
            extractedData : {}
        },
    }
})

watch(requestBody, (newValue) => {
    model.value = newValue
}, { deep: true })

</script>
<template>
    <ExtractibleGrid icon-class="fr-icon-equalizer-line" title="Paramètres d'extraction">
        <div class="fr-container--fluid">
            <div class="fr-grid-row">
                <div class="fr-mr-16v"><span class="fr-icon-database-fill fr-mr-2v"></span>{{ extractible?.name }}</div>
                <span class="fr-mr-4v text-secondary">|</span>
                <div class="fr-mr-8v text-secondary"><span class="fr-icon-home-4-fill fr-mr-2v"></span>{{ extractible?.contact || 'Producteur inconnu' }}</div>
                <span class="fr-mr-4v text-secondary">|</span>
                <div class="fr-mr-8v text-secondary"><span class="fr-icon-calendar-2-fill fr-mr-2v"></span>{{ extractible?.creation ? new Date(extractible.creation).toLocaleDateString('fr-FR') : '' }}</div>
            </div>
            <br>
            <hr>
            <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col">
                    <div class="fr-container--fluid">
                        <div class="fr-grid-row fr-grid-row--gutters">
                            <div class="fr-col ">
                                <DsfrSelect
                                    label="Format"
                                    :options="['GPKG', 'PGDUMP', 'ESRI SHAPEFILE', 'GEOJSON', 'GML', 'PARQUET']"
                                    v-model="format"
                                />
                                <!-- <DsfrSelect
                                    label="Tables"
                                    :options="tables"
                                /> -->
                            </div>
                            <div class="fr-col">
                                <DsfrSelect
                                    label="Projection"
                                    :options="['EPSG:4326', 'EPSG:3857', 'EPSG:2154']"
                                    v-model="projection"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="fr-container--fluid fr-mt-10v">
                        <div class="fr-grid-row">
                            <!-- <CgfrSqlEditor 
                                v-model="code" 
                                title="Requête SQL" 
                                placeholder=" Saisissez ici vos requêtes SQL selon vos besoins"
                                min-height="300px">
                              <template #right>
                                <DsfrButton 
                                  secondary 
                                  size="sm"
                                  icon="ri-import-line" 
                                  label="Importer un fichier SQL" 
                                  @click="() => console.log('Exécuter la requête SQL')"
                                />
                              </template>
                            </CgfrSqlEditor>  -->
                            <RequestBuilder 
                                :relations="extractible?.type_infos.relations || []"
                                v-model="relations"
                                />
                        </div>
                    </div>
                </div>
                <div class="fr-col">
                    <ChooseSqlParamsMap />
                </div>
            </div>
        </div>
    </ExtractibleGrid>
</template>
<style scoped> 
.map {
  width: 100%;
  height: 100%;
  position: relative;
}
.text-secondary {
  color: var(--text-mention-grey);
}

</style>
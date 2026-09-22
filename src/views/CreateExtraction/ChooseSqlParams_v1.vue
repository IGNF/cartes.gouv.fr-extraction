<script setup lang="ts">
import type { Extractible, ExtractionRequestBody, RelationInput } from '@/types/extractibles.types';
import { CgfrSqlEditor } from 'cartes.gouv.fr-vue-components'
import ChooseSqlParamsMap from '../Cartes/ChooseSqlParamsMap.vue';
import { DsfrToggleSwitch } from '@gouvminint/vue-dsfr';
import { storeToRefs } from 'pinia'
import { createIntersectSQL } from '@/composables/Extractions/useExtractionExtentUtils'
import { DEFAULT_MAP_SRID } from '@/composables/useMapConstants'
import { useCreateExtractionStore } from '@/stores/createExtractionStore'
import type { ClauseWhere } from '@/types/sql.types.js';
import { clauseWhereToString } from '@/composables/sqlUtils.js';

const props = defineProps<{
    extractible: Extractible | null
}>()

const model = defineModel<ExtractionRequestBody>()
const initModel = ref<ExtractionRequestBody | undefined>(model.value)
const isHydrating = ref(false)

const code = ref()
const format = ref<ExtractionRequestBody['inputs']['format']>('GPKG')
const projection = ref('EPSG:4326')
const encoding = ref('UTF-8')
const relations = ref<RelationInput>({})
const clauseWhere = ref<ClauseWhere[]>([{ table: '', filter: { attribute: '', operator: '=', value: '' }, exportedAttributes: [] }])
const createExtractionStore = useCreateExtractionStore()
const { extentLayer } = storeToRefs(createExtractionStore)

const tables = computed(() => {
    if (!props.extractible) return []
    return props.extractible.type_infos.relations.map(rel => rel.name)
})

const title1 = ref('Emprise')
const activeAccordion = ref<number>(0)
const inExtent = ref(true)
const advancedSettings = ref(false)

const destinationSrid = computed(() => {
    const match = props.extractible?.srs?.match(/(\d+)/)
    if (!match) return DEFAULT_MAP_SRID

    const srid = Number.parseInt(match[1], 10)
    return Number.isNaN(srid) ? DEFAULT_MAP_SRID : srid
})

const extentFilter = computed(() => {
    if (!extentLayer.value || !inExtent.value) return ''
    return createIntersectSQL(extentLayer.value, destinationSrid.value)
})

const withExtentFilter = (filter: string) => {
    if (!extentFilter.value) return filter
    if (filter.includes(extentFilter.value)) return filter
    if (!filter) return extentFilter.value

    return `(${filter}) AND (${extentFilter.value})`
}

const relationsWithExtentFilter = computed<RelationInput>(() => {
    return Object.entries(relations.value).reduce<RelationInput>((accumulator, [tableName, relation]) => {
        accumulator[tableName] = {
            ...relation,
            filters: withExtentFilter(relation.filters),
        }

        return accumulator
    }, {})
})

onMounted(() => {
    console.log('Extractible reçu dans ChooseSqlParams :', props.extractible);
    
})

watch(
  initModel,
  async (newModel) => {
    if (!newModel) return
    console.log("Nouveau modèle reçu dans ChooseSqlParams :", newModel);

    isHydrating.value = true
    console.log("Hydratation du modèle avec les valeurs reçues :", {
      format: newModel.inputs?.format,
      projection: newModel.inputs?.srs,
      relations: newModel.inputs?.relations,
    });
    format.value = newModel.inputs?.format ?? 'GPKG'
    projection.value = newModel.inputs?.srs ?? 'EPSG:4326'
    relations.value = newModel.inputs?.relations ?? {}

    await nextTick()
    model.value = requestBody.value
    isHydrating.value = false
  },
  { deep: true, immediate: true }
)

const requestBody = computed((): ExtractionRequestBody => {
    return {
        inputs: {
            format: format.value, 
            srs: projection.value,
            relations: relationsWithExtentFilter.value,
            append: true
        },
        outputs: {
            logs : {},
            summary : {},
            extractedData : {}
        },
    }
})

watch(requestBody, (newValue) => {
    if (isHydrating.value) return
    console.log("Nouveau requestBody dans ChooseSqlParams :", newValue);
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
            <div class="fr-col gap-24">
                <div class="fr-grid-row fr-grid-row--gutters">
                    <div class="fr-col">
                        <DsfrSelect
                            label="Projection"
                            :options="['EPSG:4326', 'EPSG:3857', 'EPSG:2154']"
                            v-model="projection"
                        />
                    </div>
                    <div class="fr-col ">
                        <DsfrSelect
                            label="Format"
                            :options="['GPKG', 'PGDUMP', 'ESRI SHAPEFILE', 'GEOJSON', 'GML', 'PARQUET']"
                            v-model="format"
                        />
                    </div>
                </div>
                <div class="fr-grid-row fr-grid-row--gutters">
                    <div class="fr-col">
                      <DsfrCheckbox 
                        label="Ne conserver que les objets situés dans l'emprise. "
                        v-model="inExtent"
                        name="inExtent"
                        value="inExtent"/>
                    </div>
                </div>
                <div class="fr-grid-row">
                    <DsfrAccordionsGroup v-model="activeAccordion" class="w-100">
                        <DsfrAccordion
                          id="accordion-1"
                          :title="title1"
                          class="w-100"
                        >
                            <ChooseSqlParamsMap />
                        </DsfrAccordion>
                    </DsfrAccordionsGroup>
                </div>
                <div class="fr-grid-row align-right">
                    <DsfrToggleSwitch
                        label="Paramètres avancés"
                        v-model="advancedSettings"
                        no-text
                    />
                </div>
                <div class="fr-grid-row">
                    <RequestBuilder
                        v-if="!advancedSettings"
                        :relations="extractible?.type_infos.relations || []"
                        v-model="relations"
                    />
                    <AdvancedRequestBuilder
	                	v-else
	                	:relations="extractible?.type_infos.relations || []"
	                	v-model="clauseWhere"
	                />
                    {{ clauseWhere }}
                    <br />
                    {{ clauseWhereToString(clauseWhere) }}
	                <!-- <ExpertRequestBuilder
	                	v-else
	                	:relations="extractible?.type_infos.relations || []"
	                	v-model="relations"
	                /> -->
                </div>
            </div>
        </div>
    </ExtractibleGrid>
</template>
<style scoped> 
.map {
  width: 100%;
  height: 30vh;
  position: relative;
}
.text-secondary {
  color: var(--text-mention-grey);
}

.w-100 {
  width: 100%;
}
:deep(.fr-toggle__label) {
  width: 100%;
}

.align-right {
    justify-content: flex-end;
}

.gap-24 {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
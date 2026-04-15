<script setup lang="ts">
import type { Extractible } from '@/types/extractibles.types';
import { CgfrSqlEditor } from 'cartes.gouv.fr-vue-components'


import { sqlMap } from "@/composables/mapkeys.js";
import { useMapStore } from "@/stores/mapStore";
import { useLogger } from "vue-logger-plugin";

const mapStore = useMapStore()

const props = defineProps<{
    extractible: Extractible | null
}>()

const DEFAULT_LAYER = {
  name: "ORTHOIMAGERY.ORTHOPHOTOS",
  service: "WMTS", // issu de serviceParams.id = "OGC:WMTS" -> split(":")[1]
  key: "ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS",
  position: -1,
  opacity: 1,
  visible: true,
  grayscale: false
};

const code = ref()


</script>
<template>
    <ExtractibleGrid icon-class="fr-icon-equalizer-line" title="Paramètres d'extraction">
        <div class="fr-container--fluid">
            <div class="fr-grid-row">
                <div><span class="fr-icon-database-line fr-mr-2v"></span>Nom de la donnée</div>
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
                                    :options="['CSV', 'GPKG', 'SHP']"
                                />
                                <DsfrSelect
                                    label="Tables"
                                    :options="['Table1', 'Table2', 'Table3']"
                                />
                            </div>
                            <div class="fr-col">
                                <DsfrSelect
                                    label="Projection"
                                    :options="['EPSG:4326', 'EPSG:3857', 'EPSG:2154']"
                                />
                                <DsfrSelect
                                    label="Encodage"
                                    :options="['UTF-8', 'ISO-8859-1', 'ASCII']"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="fr-container--fluid fr-mt-10v">
                        <div class="fr-grid-row">
                            <CgfrSqlEditor 
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
                            </CgfrSqlEditor> 
                        </div>
                    </div>
                </div>
                <div class="fr-col">
                    <Map 
                        class="map" 
                        :map-id="sqlMap">
                        <View
                          :map-id="sqlMap"
                          :center="mapStore.center"
                          :zoom="mapStore.zoom"
                        />
                        <Layer  
                            :map-id="sqlMap" 
                            :layerOptions="DEFAULT_LAYER"
                        />
                        <Controls
                            :map-id="sqlMap" 
                        />
                    </Map>
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
</style>
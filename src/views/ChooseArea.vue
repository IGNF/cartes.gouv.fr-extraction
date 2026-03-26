<script setup lang="ts">
import { useNormalizeString } from '@/composables/utils'

const props = defineProps<{
    extractibles: Extractible[] // props à définir si nécessaire
}>()

const headerRows = [
          { label: 'Nom', key: 'name' },
          { label: 'Création', key: 'creation' },
          { label: 'Tag', key: 'tag' }
        ]

const rows = computed(() => {
    return props.extractibles.filter(o => useNormalizeString(o.name).includes(useNormalizeString(searchedString.value)))  
})

const selection = ref<string[]>([])
const currentPage = ref<number>(0)
const selectedRow = ref<string[]>([])
const searchedString = ref<string>("")
// function selectRow(e : Event)  {
//     console.log(e)
// }
onMounted(() => {
  console.log('ChooseExtraction component mounted');
  console.log('Extractible data:', props.extractibles);
});
</script>
<template>
    <div class="extract-list-container">
        <!-- <Carto/> -->
    </div> 
</template>
<style scoped> 
.extract-list-header {
    background-color: var(--background-alt-grey);
    align-items: center;
    height: 4rem;
}
.extract-list-header h3 {
    margin: 0 0 0 1rem;
}
.extract-list-container {
  margin-top: 2rem;
  border: 1px solid var(--light-decisions-border-border-default-grey, #DDD);
  width: 100%;
}

.tag-name {
  background-color: var(--background-alt-blue-france);
  color: var(--text-action-high-blue-france);
  border-radius: 25px;
  margin-right: 4px;
  font-size: 0.875rem;
}
.check-cell {
    display: inline-flex;
}
</style>
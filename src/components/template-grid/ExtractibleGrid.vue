<script setup lang="ts">
const props = defineProps<{
    iconClass: string
    title: string
}>()
</script>
<template>
    <div class="extract-list-container">
        <div class="extract-list-header fr-grid-row fr-mb-8v fr-pl-3v ">
            <span v-if="iconClass":class="iconClass" aria-hidden="true"></span>
            <h3>{{ props.title }}</h3>
        </div>
        <div class="fr-container fr-mb-6v">
            <slot></slot>
        </div>
    </div> 
</template>
<style scoped> 
.extract-list-header {
    background: var(--background-alt-grey-hover);
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
  height: fit-content;
}
</style>
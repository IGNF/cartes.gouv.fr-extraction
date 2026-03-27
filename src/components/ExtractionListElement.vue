<script setup lang="ts">
const props = defineProps<{
    extraction: {
        status: string
        title: string
        url: string
        launch_date: Date
        execution_url: string
    }
}>()

const formattedDate = computed(() =>
    new Date(props.extraction.launch_date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
)

</script>
<template>
    <div class="fr-container execution-card  execution-card fr-mb-10v w-100 fr-p-10v">
        <div class="row">
            <div class="status">{{ extraction.status.toUpperCase() }}</div>
            <DsfrButton
                secondary
            >
                <span class="fr-icon-delete-bin-line fr-ml-auto"></span>
            </DsfrButton>
        </div>
        <h4 class="fr-mt-4v">{{ extraction.title }}</h4>
        <div class="row">
            <div>
                <p>Dernier lancement le {{ formattedDate }}</p>
            </div>
            <div>
                <DsfrButton
                    class="fr-mr-2v"
                >
                    Relancer l'extraction
                </DsfrButton>
                <DsfrButton
                    secondary
                >
                    Télécharger les données
                </DsfrButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
.execution-card {
    border : 1px solid var(--border-default-grey);
}

h4 {
    color: var(--text-action-high-blue-france);
}

.status {
    background-color: var(--background-action-low-blue-france);
}

.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.row p {
    margin: 0;
}
</style>
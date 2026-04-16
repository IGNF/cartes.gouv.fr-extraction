<script setup lang="ts">
import { DsfrCard } from '@gouvminint/vue-dsfr';

type CardItem = {
	description: string
	title: string
	url_name: string
}

const props = withDefaults(defineProps<{
	items: CardItem[]
}>(), {
})


</script>

<template>
	<div class="fr-grid-row gap-2">
		<DsfrCard
			v-for="item in items"
			:key="item.url_name"
			class="fr-col-12 fr-col-md-6 fr-col-lg-4 fr-mb-2w card-uniform"
			:title="item.title"
			description=""
			img-src="https://loremflickr.com/300/200/cat?random=1"
			img-ratio="medium"
			:horizontal="false"
			:no-arrow="false"
			:link="`/myextractions/${item.url_name}`"
			size="sm"
		/>
	</div>
</template>

<style scoped>
.gap-2 {
	gap: 1rem;
}

.card-uniform {
	--card-body-fixed-height: 9rem;
}

:deep(.card-uniform .fr-card__body) {
	min-height: var(--card-body-fixed-height);
	height: var(--card-body-fixed-height);
	max-height: var(--card-body-fixed-height);
	overflow: hidden;
}

:deep(.card-uniform .fr-card__title) {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>

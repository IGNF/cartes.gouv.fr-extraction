<script setup lang="ts">
import { DsfrButton, DsfrCard } from '@gouvminint/vue-dsfr'

const router = useRouter()
</script>

<template>
	<section class="home-page">
		<div class="background-layer" aria-hidden="true">
			<div class="background-left" />
			<div class="background-right" />
		</div>

		<div class="card-layer">
			<DsfrCard
				class="home-card"
				title="Extraire une donnée"
				description="Un service pour filtrer, sélectionner et extraire précisément les données géographiques dont vous avez besoin."
				:horizontal="false"
				:no-arrow="true"
			>
				<template #end-details>
					<div class="home-card-actions">
						<DsfrButton
							secondary
							label="Mes extractions"
							@click="() => router.push('/myextractions')"
						/>
						<DsfrButton
							label="Créer une extraction"
							icon="fr-icon-arrow-right-line"
							icon-right
							@click="() => router.push('/new-extraction')"
						/>
					</div>
				</template>
			</DsfrCard>
		</div>
	</section>
</template>

<style scoped>
.home-page {
	position: relative;
	width: 100%;
	min-height: 75vh;
	overflow: hidden;
}

.background-layer {
	position: absolute;
	inset: 0;
	display: flex;
}

.background-left {
	width: 33.3333%;
	background: transparent;
}

.background-right {
	width: 66.6667%;
	background-image: url('https://picsum.photos/1600/1000?random=7');
	background-size: cover;
	background-position: center;
}

.card-layer {
	position: relative;
	z-index: 1;
	min-height: 75vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem 1rem;
}

.home-card {
	width: min(32rem, 100%);
}

.home-card-actions {
	display: flex;
	gap: 0.75rem;
	flex-wrap: wrap;
}
</style>

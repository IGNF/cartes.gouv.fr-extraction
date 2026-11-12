<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'authentification-vue-oidc';
import { useStartNewExtraction } from '@/composables/Extractions/Requests/useExtraction';
import background800 from '@/assets/images/publish/background-800.webp';
import background1200 from '@/assets/images/publish/background-1200.webp';
import background1600 from '@/assets/images/publish/background-1600.webp';
import background2160 from '@/assets/images/publish/background-2160.webp';

const { isAuthenticated, status, login } = useAuth();
const pending = ref(false);
const connectionError = ref('');
const connectionDisabled = computed(() => pending.value || ['initializing', 'authenticating'].includes(status.value));
const router = useRouter();
const startNewExtraction = useStartNewExtraction();

const onConnect = async () => {
	if (connectionDisabled.value) return;
	pending.value = true;
	connectionError.value = '';
	try {
		await login({ returnTo: '/' });
	} catch {
		connectionError.value = 'Impossible de vous connecter. Veuillez réessayer.';
	} finally {
		pending.value = false;
	}
}

</script>

<template>
	<section class="home-page">
		<div class="background-layer" aria-hidden="true">
			<div class="background-left" />
			<img
				class="background-right"
				:src="background1600"
				:srcset="`${background800} 800w, ${background1200} 1200w, ${background1600} 1600w, ${background2160} 2160w`"
				sizes="66.667vw"
				alt=""
				fetchpriority="high"
			/>
		</div>
		<div class="card-layer">
			<div class="icon-container">
				<span class="extraction-icon" aria-hidden="true" />
			</div>
			<div>
				<h1>
					Extraire une donnée
				</h1>
				<div class="fr-text--lead">
					Filtrez, téléchargez et exploitez
				</div>
			</div>
			<div class="description">
				Un service pour filtrer, sélectionner et extraire précisément les données géographiques dont vous avez besoin.
			</div>
			<div>
				<template name="connected" v-if="isAuthenticated">
					<DsfrButton
						secondary
						label="Mes extractions"
						@click="() => router.push({ name: 'repositories' })"
					/>
					<DsfrButton
						class="fr-ml-2v"
						label="Créer une extraction"
						icon="fr-icon-arrow-right-line"
						icon-right
						@click="startNewExtraction"
					/>
				</template>
				<template name="not-connected" v-else>
					<DsfrButton
						label="Connectez-vous pour commencer"
						:disabled="connectionDisabled"
						icon="fr-icon-arrow-right-line"
						icon-right
						@click="onConnect"
					/>
				</template>
				<p v-if="connectionError" role="alert">{{ connectionError }}</p>
			</div>

		</div>
	</section>
</template>

<style scoped>
.home-page {
	position: relative;
	display: flex;
	align-items: center;
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
	height: 100%;
	object-fit: cover;
	object-position: center;
}

.card-layer {
	position: relative;
	display: flex;
	width: 480px;
	max-width: 100%;
	box-sizing: border-box;
	padding: 40px;
	flex-direction: column;
	align-items: flex-start;
	gap: 40px;
	flex-shrink: 0;
	background-color: var(--background-default-grey);
	z-index: 1;
	box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
}

.description {
	text-align: justify;
	text-justify: auto;
}

.icon-container {
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--light-options-illustration-color-925-default-pink-macaron-925, #FDDFDA);
	border-radius: 500px;
	width: 6rem;
	height: 6rem;
	.extraction-icon {
		display: block;
		width: 3rem;
		height: 3rem;
		background-color: #000091;
		-webkit-mask: url('../assets/extraction-line.svg') no-repeat center / contain;
		mask: url('../assets/extraction-line.svg') no-repeat center / contain;
	}
}
</style>

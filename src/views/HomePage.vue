<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { getService } from 'cartes.gouv.fr-service';

const appStore = useAppStore();
const router = useRouter();

const createNewAuthService = () => {
	if (appStore.service) {
		return appStore.service;
	}

	const newAuthService = getService({ mode: 'local' });
	appStore.setService(newAuthService); // sauvegarde du service dans le store
	return newAuthService;
};

const onConnect = () => {
  // création d'une nouvelle instance du service d'authentification
	const service = createNewAuthService();

	service.getAccessLogin()
		.then((url: string) => {
			window.location.href = url;
		});
}

// si authentifié, on récupère l'utilisateur depuis le store 
// pour l'afficher dans la page d'accueil
const user = computed(() => appStore.service?.getUser()); // String

onMounted(() => {
  console.log('HomePage mounted');
  console.log('User:', user);
  console.log('Service:', appStore.service);
});
</script>

<template>
	<section class="home-page">
		<div class="background-layer" aria-hidden="true">
			<div class="background-left" />
			<div class="background-right" />
		</div>
		[DEBUG] HOME PAGE.VUE
		{{ appStore.service?.authenticated }}
		{{ user }}
		<div class="card-layer">
			<div class="icon-container">
			<span class="fr-icon-inbox-unarchive-line"></span>
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
				<template name="connected" v-if="appStore.service?.authenticated">
					<DsfrButton
						secondary
						label="Mes extractions"
						@click="() => router.push('/myextractions')"
					/>
					<DsfrButton
						class="fr-ml-2v"
						label="Créer une extraction"
						icon="fr-icon-arrow-right-line"
						icon-right
						@click="() => router.push('/new-extraction')"
					/>
				</template>
				<template name="not-connected" v-else>
					<DsfrButton
						label="Connectez-vous pour commencer"
						icon="fr-icon-arrow-right-line"
						icon-right
						@click="onConnect"
					/>
				</template>
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
	background-image: url('https://picsum.photos/1600/1000?random=7');
	background-size: cover;
	background-position: center;
}

.card-layer {
	position: relative;
	display: flex;
	width: 480px;
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
	span {
		scale: 2;
	}
}
</style>

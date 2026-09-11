# Service d’extraction de données cartes.gouv.fr

Cette application est une des briques fonctionnelles du portail cartes.gouv.fr. Elle offre une interface graphique permettant de lancer des extractions de données géographiques avec le [service d'extraction de la Géoplateforme](https://cartes.gouv.fr/aide/fr/guides-utilisateur/utiliser-les-services-de-la-geoplateforme/extraction/).

Elle propose un paramètrage de l'emprise géographique, du contenu et des critères de filtrage des extractions puis un suivi des extractions demandées.

---

## Stack technique

- [Vue 3](https://vuejs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/) et [Pinia](https://pinia.vuejs.org/)
- [Vue DSFR](https://vue-ds.fr/) (`@gouvminint/vue-dsfr`) + DSFR (`@gouvfr/dsfr`) s'agissant d'un site utilisant le système de design de l'Etat.
- [OpenLayers](https://openlayers.org/) et [IGNF/geopf-extensions-openlayers](https://github.com/IGNF/geopf-extensions-openlayers) pour la cartographie
- [Vitest](https://vitest.dev/) et [Playwright](https://playwright.dev/) pour les tests

## Prérequis

`Node.js` (>20) et `npm` installés

## Installation

```sh
npm install
```

## Lancer le projet en local

### Développement (mode par défaut)

```sh
npm run dev
```

### Développement avec mode spécifique

```sh
npm run dev:qua
npm run dev:prod
```

## Vérification de la qualité

### Lint

```sh
npm run lint
```

### Formatage automatique

```sh
npm run format
```

### Vérification de types

```sh
npm run type-check
```

## Build et aperçu de production

### Build complet (type-check + build Vite)

```sh
npm run build
```

### Build Vite uniquement

```sh
npm run build-only
```

### Prévisualisation du build

```sh
npm run preview
```

## Configuration

La configuration runtime est injectée via `public/config/config-template.json`.
Les variables concernent notamment le `BASE_URL`, le mode (`MODE`) et la configuration IAM/SSO (Keycloak).

## Docker

Les commandes utiles sont détaillées dans [Docker.md](docs/developper/Docker.md).

Exemple rapide :

```bash
docker build --no-cache -f .docker/Dockerfile -t extraction:latest .
docker run -p 8080:8080 extraction:latest
```

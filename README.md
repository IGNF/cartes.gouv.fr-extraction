# Service d’extraction de données cartes.gouv.fr

Cette application Vue 3 / Vue DSFR permet de lancer des extractions de données géographiques de la Géoplateforme sur une étendue.
Elle propose un paramètrage puis un suivi des extractions lancées.

---

## Stack technique

- [Vue 3](https://vuejs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/) et [Pinia](https://pinia.vuejs.org/)
- [Vue DSFR](https://vue-ds.fr/) (`@gouvminint/vue-dsfr`) + DSFR (`@gouvfr/dsfr`)
- [OpenLayers](https://openlayers.org/) pour la cartographie
- [Vitest](https://vitest.dev/) et [Playwright](https://playwright.dev/) pour les tests

## Prérequis

- Node.js 20+ recommandé
- npm

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

Les commandes utiles sont détaillées dans [Docker.md](Docker.md).

Exemple rapide :

```bash
docker build --no-cache -f .docker/Dockerfile -t extraction:latest .
docker run -p 8080:8080 extraction:latest
```
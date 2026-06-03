## 1. **Construire l'image Docker**
```bash
cd /home/HCaillaud/DEV/extraction
docker build --no-cache -f .docker/Dockerfile -t extraction:latest .

docker compose -f .docker/compose.dev.yml watch
```

## 2. **Vérifier que l'image s'est bien construite**
```bash
docker images | grep extraction
```

## 3. **Exécuter un conteneur pour tester**
```bash
docker run -p 8080:8080 extraction:latest
```

Puis ouvrez votre navigateur sur `http://localhost:8080`

## 4. **Tester avec des variables d'environnement** (si nécessaire)
```bash
docker run -p 8080:8080 \
  -e BASE_URL="/extraction" \
  -e IAM_CHECK_SSO_DISABLE="1" \
  -e IAM_CHECK_SSO_AUTO_AUTH="1" \
  -e IAM_CHECK_SSO_TYPE="keycloak" \
  -e IAM_CHECK_SSO_TIMEOUT="5000" \
  -e IAM_CHECK_SSO_CLIENT_ID="cartes-gouv-public" \
  -e IAM_DISABLE="0" \
  -e IAM_AUTH_MODE="local" \
  -e IAM_URL="https://sso.geopf.fr" \
  -e IAM_REALM="geoplateforme" \
  -e IAM_CLIENT_ID="cartes-gouv-public" \
  -e IAM_CLIENT_SECRET="" \
  -e IAM_ENTREPOT_API_URL="https://data.geopf.fr/api" \
  -e IAM_REDIRECT_REMOTE="https://cartes.gouv.fr" \
  -e IAM_ENTREPOT_API_URL_REMOTE="https://cartes.gouv.fr/api" \
  extraction:latest | grep IAM_URL
```

## 5. **Accéder au shell du conteneur pour déboguer**
```bash
docker run -it -p 8080:8080 --entrypoint /bin/sh extraction:latest
```

## 6. **Vérifier les logs**
```bash
docker logs <CONTAINER_ID>
```

## 7. **Test complet : build local d'abord**
```bash
# Assurez-vous que le build local fonctionne
npm run build-only

# Vérifiez que les fichiers sont générés
ls -la dist/
```

**Conseil** : Si le build Docker échoue, vérifiez :
- ✅ Que `npm run build-only` fonctionne en local
- ✅ Que tous les fichiers source sont inclus
- ✅ Que le `entrypoint.sh` existe et est exécutable
- ✅ Que le fichier .dockerignore n'exclut pas les fichiers nécessaires

Avez-vous des erreurs spécifiques lors du build ?
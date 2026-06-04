FROM node:24-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Vérifier que les dépendances sont installées
RUN npm list --depth=0

# Copie du reste du code
COPY . .

# Construction de l'application avec Vite
RUN npm run build-only

# Vérification du contenu du répertoire de construction
RUN ls -l /app/dist

# Copie des fichiers de configuration et scripts
COPY /public/config/config-template.json /app/dist/config/config-template.json
COPY .docker/nginx-default.conf /app/nginx-default.conf
COPY --chmod=0755 .docker/entrypoint.sh /app/entrypoint.sh

# Ajuster les permissions du répertoire config
RUN chmod -R 777 /app/dist/config


#----------------------------------------------------------------------
# cartesgouvfr-extraction : Config d'un serveur statique avec nginx
#----------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:stable-alpine AS production

# Copie de la configuration Nginx
COPY --from=builder /app/nginx-default.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers construits dans un sous-dossier /extraction
# pour correspondre au base path Vite (/extraction)
COPY --from=builder /app/dist /usr/share/nginx/html/extraction

# On prevoit de monter un volume sous k8s 
# pour écriture du fichier d'environnement de la webapp
VOLUME ["/usr/share/nginx/html/extraction/config"]

COPY --from=builder /app/dist/config /usr/share/nginx/html/extraction/config

# Copie du script d'entrypoint avec permissions d'exécution
COPY --from=builder /app/entrypoint.sh /entrypoint.sh

# Définir le répertoire de travail
WORKDIR /usr/share/nginx/html/extraction

# Exposer le port 8080
EXPOSE 8080

# Vérification du contenu du répertoire de production
RUN ls -l /usr/share/nginx/html

# Utiliser l'entrypoint pour substituer les variables
ENTRYPOINT ["/entrypoint.sh"]

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
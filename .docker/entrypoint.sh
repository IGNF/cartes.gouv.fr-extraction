#!/bin/sh

# Substituer les variables d'environnement dans le config template
envsubst < /usr/share/nginx/html/config/config-template.json > /usr/share/nginx/html/config/config.json

# Exécuter la commande passée en argument
exec "$@"

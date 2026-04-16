
## déployer image Docker générée :
https://gitlab.gpf-tech.ign.fr/ign-mut/cartes/cartes-deploiement
 
Créer un Chart helm  extraction (juste première fois)

Values.yml : indiquer le repository ou se trouve l'image (récupérer sur github)
on ne modifie que le tag de l'image dans values.yml

### Dasn chaque ENV :
dans dossier ign-mut-env
Param pour activer ou pas l'environnement
```yaml
enabled : true
```




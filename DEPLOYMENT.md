## Créer une release avec un tag
lance le build dans les actions

## déployer image Docker générée :
https://gitlab.gpf-tech.ign.fr/ign-mut/cartes/cartes-deploiement

### la 1ère fois
Créer un Chart helm  extraction (juste première fois)

### toutes les autres fois
dans config on modifie l'environnement souhaité
Values.yml : indiquer le repository ou se trouve l'image (récupérer sur github)
on ne modifie que le tag de l'image dans values.yml

message de commit : 
```
feat(extraction):déploiement maquette
```

### Dasn chaque ENV :
dans dossier ign-mut-env
Param pour activer ou pas l'environnement
```yaml
enabled : true
```




<script setup lang="ts">
import { CgfrFooter, CgfrHeader } from 'cartes.gouv.fr-vue-components'
</script>

<template>
  <CgfrHeader
    class="CgfrHeader"
    badge-text="Extraction"
    badge-icon="fr-icon-road-map-fill"
    badge-color="pink-macaron"
  />

  <div class="Alerts" />

  <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w Content">
    <router-view />
  </div>

  <CgfrFooter />

  <Modals />
</template>

<style lang="scss">
body {
  min-height: 100vh;
}
#app {
  display: grid;
  // on définit 4 lignes (attention, il faut bien 4 enfants dans #app)
  // [nom] taille
  grid-template-rows:
    [header] auto
    [alerts] auto
    [content] 1fr
    [footer] auto;
  min-height: 100vh;
}
// on place les éléments
.CgfrHeader {
  grid-row: header;
}
.Alerts {
  grid-row: alerts;
}
.Content {
  grid-row: content;
}
.CgfrFooter {
  grid-row: footer;
}
</style>

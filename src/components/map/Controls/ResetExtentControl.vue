<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import { useMapStore } from '@/stores/mapStore'
import { useCreateExtractionStore } from '@/stores/createExtractionStore'
// ControlExtended n'est pas exporté par l'index de la lib
import ControlExtended from 'geopf-extensions-openlayers/src/packages/Controls/Control'

const props = defineProps({
  mapId: {
    type: String,
    default: 'mainMap'
  },
  visibility: Boolean,
  position: {
    type: String,
    default: 'top-right'
  },
  gutter: {
    type: Boolean,
    default: true
  }
})

const log = useLogger()
const mapStore = useMapStore()
const createExtractionStore = useCreateExtractionStore()
const map = computed(() => mapStore.getMapRef(props.mapId))

function createControl () {
  const element = document.createElement('div')
  element.id = 'GPresetExtent-' + props.mapId
  element.classList.add('GPwidget', 'gpf-widget', 'gpf-widget-button')
  if (!props.gutter) {
    element.classList.add('gpf-button-no-gutter')
  }

  const button = document.createElement('button')
  button.type = 'button'
  button.classList.add('gpf-btn-icon-reset-extent', 'fr-btn', 'fr-btn--tertiary', 'gpf-btn', 'gpf-btn--tertiary', 'gpf-btn-icon')
  button.setAttribute('aria-label', 'Supprimer toutes les emprises')
  button.addEventListener('click', onClick)
  element.appendChild(button)

  watch(
    () => createExtractionStore.extentLayer,
    (extentLayer) => {
      button.disabled = !extentLayer
    },
    { immediate: true }
  )

  return new ControlExtended({ element })
}

const control = createControl()

function onClick () {
  log.debug('Reset extent')
  createExtractionStore.removeExtentLayer(() => map.value?.value)
}

onMounted(() => {
  watch(
    () => map.value,
    (currentMap) => {
      if (currentMap && props.visibility) {
        log.debug('add ResetExtent Control')
        currentMap.value.addControl(control)
        control.setPosition(props.position)
      }
    },
    { immediate: true }
  )
})

onUnmounted(() => {
  map.value?.value?.removeControl(control)
})
</script>

<template>
  <div />
</template>

<style lang="scss">
// icone "delete-bin-line" (Remix Icon, utilisée par le DSFR)
.gpf-btn-icon-reset-extent {
  position: relative;
}

// Conserve un fond opaque sur la carte malgré le style tertiaire disabled du DSFR.
.gpf-widget > .gpf-btn-icon-reset-extent:disabled {
  background-color: var(--background-disabled-grey);
}

.gpf-btn-icon-reset-extent::after {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 24px;
  height: 24px;
  margin: 0;
  transform: translate(-50%, -50%);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z'/></svg>") center / contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z'/></svg>") center / contain no-repeat;
}
</style>

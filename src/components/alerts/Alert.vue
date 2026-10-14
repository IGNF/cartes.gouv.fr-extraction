<script setup lang="ts">
import type { DsfrAlertType } from "@gouvminint/vue-dsfr";

withDefaults(defineProps<{
  type: DsfrAlertType;
  title: string;
  small?: boolean;
  dismissible?: boolean;
}>(), {
  small: false,
  dismissible: false,
});

const emit = defineEmits<{ dismiss: [] }>();

const closed = ref(false);
const askDismiss = ref(false);

const onCloseAlert = () => {
  closed.value = true;
  if (askDismiss.value) {
    emit("dismiss");
  }
};
</script>

<template>
  <DsfrAlert
    :class="{ 'fr-alert--dismissible': dismissible }"
    :type="type"
    :title="title"
    :small="small"
    closeable
    :closed="closed"
    @close="onCloseAlert"
  >
    <div class="content">
      <slot />
    </div>

    <div
      v-if="dismissible"
      class="checkbox-container fr-mt-2v"
    >
      <DsfrCheckbox
        v-model="askDismiss"
        name="alert-dismiss"
        value="dismiss"
        label="Ne plus afficher"
        small
        inline
      />
    </div>
  </DsfrAlert>
</template>

<style scoped lang="scss">
@use "@/assets/variables" as *;

.fr-alert {
  background-color: var(--background-default-grey);
  margin-top: 0;
}
@include max(md) {
  .fr-alert--dismissible {
    padding-top: 3rem;
  }
}
@include min(md) {
  .fr-alert--dismissible .content {
    width: calc(100% - 12rem);
  }
}
.checkbox-container {
  position: absolute;
  top: 0;
  right: 2.5rem;
}
</style>

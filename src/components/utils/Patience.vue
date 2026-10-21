<script setup lang="ts">
</script>

<template>
  <div class="patience-container" role="status" aria-label="Chargement en cours">
    <span class="patience-spinner" aria-hidden="true" />
  </div>
</template>

<style scoped>
.patience-container{
  display: flex;
  width: 100%;
  min-height: 160px;
  justify-content: center;
  align-items: center;
}
.patience-spinner {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border: 5px solid var(--text-action-high-blue-france, #000091);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
</style>
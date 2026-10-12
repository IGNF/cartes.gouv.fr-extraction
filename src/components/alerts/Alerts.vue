<script setup lang="ts">
import type { DsfrAlertType } from "@gouvminint/vue-dsfr";
import { useLogger } from "vue-logger-plugin";
import Alert from "@/components/alerts/Alert.vue";
import { getRuntimeConfig } from "@/config/configService";
import type { IAlert, IApiAlert } from "@/types/alert.types";

const STORAGE_KEY = "extraction:alerts";

const log = useLogger();

const severityToType: Record<IApiAlert["severity"], DsfrAlertType> = {
  info: "info",
  warning: "warning",
  alert: "error",
};

const alerts = ref<(IAlert & { url?: string })[]>([]);
const dismissedIds = ref<string[]>(readDismissed());

function readDismissed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

// Les liens relatifs pointent vers cartes.gouv.fr ; seuls http(s) sont acceptés
function resolveUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const resolved = new URL(url, window.location.origin);
    return ["http:", "https:"].includes(resolved.protocol) ? resolved.href : undefined;
  } catch {
    return undefined;
  }
}

const visibleAlerts = computed(() =>
  alerts.value.filter((alert) => !dismissedIds.value.includes(alert.id))
);

const setDismissed = (alertId: string) => {
  const ids = readDismissed();
  // on supprime les 2 plus anciennes quand la taille dépasse 5
  if (ids.length > 5) {
    ids.splice(0, 2);
  }
  ids.push(alertId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

onMounted(async () => {
  const alertsUrl = getRuntimeConfig().ALERTS_URL;
  if (!alertsUrl) return;
  try {
    const response = await fetch(alertsUrl);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const data: IApiAlert[] = await response.json();
    alerts.value = data
      .filter((alert) => alert.visibility?.extraction)
      .map((alert) => ({
        ...alert,
        date: new Date(alert.date),
        url: resolveUrl(alert.link?.url),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    log.warn("[Alerts] Impossible de charger les alertes :", error);
  }
});
</script>

<template>
  <div class="alerts">
    <Alert
      v-for="alert in visibleAlerts"
      :key="`alert-${alert.id}`"
      :type="severityToType[alert.severity] ?? 'info'"
      :title="alert.title"
      dismissible
      @dismiss="setDismissed(alert.id)"
    >
      <p>
        <strong v-if="alert.description">{{ alert.description }}</strong>
        <template v-if="alert.details"> - {{ alert.details }}</template>
        <a
          v-if="alert.url"
          :href="alert.url"
          title="ouvre une nouvelle fenêtre"
          target="_blank"
          rel="noopener noreferrer"
          class="fr-notice__link"
        >
          {{ alert.link.label ?? "En savoir plus" }}
        </a>
      </p>
    </Alert>
  </div>
</template>

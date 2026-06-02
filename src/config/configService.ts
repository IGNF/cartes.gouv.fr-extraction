/**
 * Service de configuration
 *
 * En développement : lit les variables depuis import.meta.env
 * En production : charge /config/config.json monté via un ConfigMap Kubernetes
 */

type Config = Record<string, string>;

let configInstance: Config | null = null;
let configLoaded = false;
let configError: Error | null = null;

// Charge la configuration depuis un fichier JSON (typiquement monté via ConfigMap)
async function loadConfigFromFile(configPath = '/config/config.json'): Promise<Config> {
  const response = await fetch(configPath);
  if (!response.ok) {
    throw new Error(`Impossible de charger la configuration depuis ${configPath} : ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data as Config;
}

// Charge la configuration depuis les variables d'environnement Vite
function loadConfigFromEnv(): Config {
  return Object.fromEntries(
    Object.entries(import.meta.env).filter(([, v]) => v !== undefined)
  ) as Config;
}

/**
 * Initialise le service de configuration.
 * Doit être appelé avant tout appel à getRuntimeConfig().
 * 
 * En production : charge obligatoirement depuis le fichier config.json
 * En développement : utilise les variables d'environnement
 */
export async function initializeConfig(options: { configPath?: string } = {}): Promise<void> {
  const { configPath = '/config/config.json' } = options;

  try {
    // Variable présente au moment du build
    const mode = import.meta.env.MODE || 'development';

    if (mode === 'production') {
      // En production : le fichier est obligatoire, pas de fallback sur les env
      configInstance = await loadConfigFromFile(configPath);
      configLoaded = true;
    } else {
      // Mode développement : on utilise les variables d'environnement
      configInstance = loadConfigFromEnv();
      configLoaded = true;
      console.log('[Config] Variables d\'environnement utilisées (mode développement)');
    }
  } catch (error) {
    configError = error instanceof Error ? error : new Error(String(error));
    configLoaded = true;
    throw configError;
  }
}

/**
 * Retourne la configuration courante.
 * Nécessite qu'initializeConfig() ait été appelé au préalable dans main.ts.
 */
export function getRuntimeConfig(): Config {
  if (!configLoaded) {
    throw new Error('Configuration non initialisée. Appelez initializeConfig() dans main.ts avant d\'utiliser getRuntimeConfig().');
  }
  if (configError) throw configError;
  if (!configInstance) throw new Error('La configuration est nulle');
  return configInstance;
}

/** Indique si l'application tourne en mode production */
export function isProduction(): boolean {
  return getRuntimeConfig().MODE === 'production';
}

/** Indique si l'application tourne en mode développement */
export function isDevelopment(): boolean {
  return getRuntimeConfig().MODE === 'development';
}

/** Retourne l'URL de base de l'application */
export function getBaseUrl(): string {
  return getRuntimeConfig().BASE_URL;
}

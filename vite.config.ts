import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import { vueDsfrAutoimportPreset, vueDsfrComponentResolver } from '@gouvminint/vue-dsfr'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        // @ts-expect-error TS2322
        'vue',
        // @ts-expect-error TS2322
        'vue-router',
        // @ts-expect-error TS2322
        'pinia',
        // @ts-expect-error TS2322
        'vitest',
        // @ts-expect-error TS2322
        vueDsfrAutoimportPreset,
      ],
      vueTemplate: true,
      dts: './src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({
      extensions: ['vue'],
      dirs: ['src/components'], // Autoimport de vos composants qui sont dans le dossier `src/components`
      include: [/\.vue$/, /\.vue\?vue/],
      dts: './src/components.d.ts',
      resolvers: [
        vueDsfrComponentResolver, // Autoimport des composants de VueDsfr dans les templates
      ],
    }),
  ],
  base: process.env.BASE_URL || '/extraction',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['vue'],
  },
})

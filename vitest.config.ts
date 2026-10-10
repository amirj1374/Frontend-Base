import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    server: { deps: { inline: ['vuetify'] } },
    include: ['src/**/*.{test,spec}.{ts,js}']
  }
});

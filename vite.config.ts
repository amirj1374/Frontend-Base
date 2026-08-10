import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag: string) => ['v-list-recognize-title'].includes(tag)
          }
        }
      }),
      vuetify({
        autoImport: true
      }),
      // Development-only echo endpoint for inspecting the UI Kit customizer
      // payload before a consumer project connects its real backend API.
      mode === 'dev' && {
        name: 'dev-customizer-payload-preview',
        configureServer(server) {
          server.middlewares.use('/__dev/customizer-preview', (request, response, next) => {
            if (request.method !== 'POST') return next();
            let body = '';
            request.on('data', (chunk) => { body += chunk; });
            request.on('end', () => {
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ received: body, developmentOnly: true }));
            });
          });
        }
      }
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // SheetJS (xlsx) references these Node builtins but never uses them in the
        // browser. Shim them to an empty module to silence Vite's
        // "Module … has been externalized for browser compatibility" warnings.
        stream: path.resolve(__dirname, './src/shims/empty.ts'),
        fs: path.resolve(__dirname, './src/shims/empty.ts')
      }
    },
    build: {
      chunkSizeWarningLimit: 1024, // 1 MB (option is in kB). Restores the diagnostic so a
      // future >1 MB chunk is flagged; no current chunk exceeds this, so no new noise.
      // Skip gzip-size reporting of every emitted chunk: it does not affect the
      // produced bundles (output is byte-identical) and noticeably speeds up the build.
      reportCompressedSize: false,
      rollupOptions: {
        // Silence three known-benign Rolldown advisories (all other checks stay on, so
        // genuine issues such as circular deps still surface):
        //  - eval: lottie-web (a transitive dep of vue3-lottie) uses direct eval in its
        //    expression engine. It is third-party code we cannot patch; it built and ran
        //    fine under Vite 5/Rollup too.
        //  - largeBarrelModules: @amirjalili1374/ui-kit imports the @tabler/icons-vue
        //    barrel; the output is already tree-shaken to size parity (see treeshake below),
        //    so this is only a build-speed hint about a dependency we do not control.
        //  - pluginTimings: an informational timing breakdown, not a correctness signal.
        checks: {
          eval: false,
          largeBarrelModules: false,
          pluginTimings: false
        },
        // @amirjalili1374/ui-kit and our own code both import from the @tabler/icons-vue
        // barrel, whose ESM entry has an `import * as index` line that Rolldown does not
        // prune — pulling the entire ~5000-icon library (~2 MB). Declaring this one
        // package side-effect-free (scoped to it only; every other module keeps default
        // behavior, so CSS/polyfill side effects are untouched) lets tree-shaking keep
        // only the icons actually used, matching the Vite 5 output size. No source changes.
        treeshake: {
          moduleSideEffects: (id: string) => !id.includes('@tabler/icons-vue')
        },
        output: {
          // Rolldown (Vite 8) requires `manualChunks` as a function. This preserves the
          // exact same three logical vendor chunks as the previous object form
          // (vendor = vue/vue-router/pinia, vuetify, charts = apexcharts) by matching on
          // node_modules package boundaries.
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return;
            if (id.includes('/vuetify/')) return 'vuetify';
            if (id.includes('/apexcharts/') || id.includes('/vue3-apexcharts/')) return 'charts';
            if (/[\\/]node_modules[\\/](vue|vue-router|pinia|@vue|vue-demi)[\\/]/.test(id)) return 'vendor';
          }
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: env.VITE_DEBUG !== 'true',
          drop_debugger: env.VITE_DEBUG !== 'true'
        }
      }
    },
    optimizeDeps: {
      exclude: ['vuetify'],
      entries: ['./src/**/*.vue']
    },
    server: {
      host: true, // Allow external connections (same as --host)
      port: parseInt(env.VITE_PORT) || 5050, // Use env port or fallback to 5050
      headers: {
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
        'Cross-Origin-Opener-Policy': 'unsafe-none'
      }
    },
    // Dynamic base URL based on environment
    base: env.VITE_BASE_URL || '/',
  };
});

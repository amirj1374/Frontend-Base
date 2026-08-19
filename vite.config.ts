import { defineConfig, loadEnv, type ViteDevServer } from 'vite';
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
        configureServer(server: ViteDevServer) {
          server.middlewares.use('/__dev/customizer-preview', (request, response, next) => {
            if (request.method !== 'POST') return next();
            let body = '';
            request.on('data', (chunk: string | Buffer) => { body += chunk; });
            request.on('end', () => {
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ received: body, developmentOnly: true }));
            });
          });
        }
      }
    ].filter(Boolean),
    resolve: {
      // A locally linked UI Kit must share these runtime singletons with the
      // consumer; otherwise Pinia sees a different active instance at startup.
      dedupe: ['vue', 'pinia', 'vuetify'],
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
        // Silence known third-party Rolldown advisories while preserving all
        // correctness checks. This avoids editor/build noise from lottie-web
        // and the linked UI Kit without changing generated output.
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
          },
          // Use Vite's native Oxc minifier. It preserves the previous production
          // stripping policy without Terser's JavaScript dependency and shortens builds.
          minify: {
            compress: {
              dropConsole: env.VITE_DEBUG !== 'true',
              dropDebugger: env.VITE_DEBUG !== 'true'
            },
            mangle: true
          }
        }
      },
      minify: 'oxc'
    },
    optimizeDeps: {
      exclude: ['vuetify', '@amirjalili1374/ui-kit'],
      entries: ['./src/**/*.vue']
    },
    server: {
      host: true, // Allow external connections (same as --host)
      port: parseInt(env.VITE_PORT) || 5050, // Use env port or fallback to 5050
      headers: {
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
        'Cross-Origin-Opener-Policy': 'unsafe-none'
      },
      proxy: env.VITE_API_PROXY_TARGET
        ? {
            '/backend': {
              target: env.VITE_API_PROXY_TARGET,
              changeOrigin: true,
              rewrite: (requestPath: string) => requestPath.replace(/^\/backend/, '')
            }
          }
        : undefined
    },
    // Dynamic base URL based on environment
    base: env.VITE_BASE_URL || '/',
  };
});

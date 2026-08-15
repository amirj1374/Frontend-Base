import type { App, Plugin } from 'vue';
import type { Pinia } from 'pinia';
import BaseApexChart from '@/components/common/BaseApexChart.vue';
import DigitLimit from '@/directives/v-digit-limit';
import { vPermission } from '@/directives/v-permission';
import VCan from '@/directives/v-can';
import vuetify from '@/plugins/vuetify';
import { router } from '@/router';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker';
import print from 'vue3-print-nb';
import { i18n } from '@/i18n';
import { UiKitPlugin } from '@amirjalili1374/ui-kit';

export function registerStatePlugin(app: App, pinia: Pinia): void {
  // Pinia is a Vue plugin at runtime. The cast keeps local `npm link` builds
  // type-safe when the linked UI Kit resolves Vue's plugin type separately.
  app.use(pinia as unknown as Plugin);
}

export function registerApplicationPlugins(app: App): void {
  // A single app-level UI Kit context is required so the Customizer and every
  // UI Kit component observe the same reactive locale and direction.
  app.use(UiKitPlugin, { locale: 'fa-IR', direction: 'rtl' });
  app.use(i18n);
  app.use(router);
  app.use(PerfectScrollbarPlugin);
  app.use(print);
  app.use(vuetify);
  app.component('apexchart', BaseApexChart);
  app.component('Vue3PersianDatetimePicker', Vue3PersianDatetimePicker);
  app.directive('digit-limit', DigitLimit);
  app.directive('permission', vPermission);
  app.directive('can', VCan);
}

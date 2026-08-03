import type { App } from 'vue';
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

export function registerStatePlugin(app: App, pinia: Pinia): void {
  app.use(pinia);
}

export function registerApplicationPlugins(app: App): void {
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

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import vuetify from '@/plugins/vuetify';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { api } from '@/services/api';

type CallReportItemDTO = {
  numbers: number;
  percentages: number;
  labels: string;
  type: string;
};

const customizerStore = ref(useCustomizerStore());
const currentTheme = ref(vuetify.theme.themes.value[customizerStore.value.getActTheme]);

const labels = ref<string[]>([]);
const percentages = ref<number[]>([]);
const numbers = ref<number[]>([]);
const isLoading = ref(false);
const loadError = ref<string | null>(null);

watch(
  () => customizerStore.value.getActTheme,
  (newTheme) => {
    currentTheme.value = vuetify.theme.themes.value[newTheme];
  }
);

const fetchChartData = async () => {
  isLoading.value = true;
  loadError.value = null;

  try {
    const res = await api.base.fetchCallReportRequest();

    if (res?.status === 200) {
      const data = res.data as CallReportItemDTO[];

      labels.value = data.map((item) => item.labels);
      percentages.value = data.map((item) => Number(item.percentages));
      numbers.value = data.map((item) => Number(item.numbers));
    }
  } catch (err: unknown) {
    const message = (err as { message?: string })?.message || 'خطا در دریافت داده ها';
    loadError.value = message;
    labels.value = [];
    percentages.value = [];
    numbers.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchChartData();
});

const series = computed(() => percentages.value);

const chartOptions = computed(() => ({
  chart: {
    type: 'radialBar',
    height: 380,
    fontFamily: 'inherit',
    foreColor: currentTheme.value.colors.secondary
  },
  colors: [
    currentTheme.value.colors.primary,
    currentTheme.value.colors.secondary,
    currentTheme.value.colors.secondary200,
    currentTheme.value.colors.success
  ],
  labels: labels.value,
  plotOptions: {
    radialBar: {
      hollow: {
        size: '58%'
      },
      track: {
        background: currentTheme.value.colors.primary100 || '#f2f2f2'
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '12px',
          fontFamily: 'vazir, sans-serif'
        },
        value: {
          show: true,
          fontSize: '18px',
          fontFamily: 'vazir, sans-serif',
          formatter: (val: number) => `${Math.round(val)}%`
        },
        total: {
          show: true,
          label: 'کل سوابق مکاتبات پرونده',
          fontFamily: 'vazir, sans-serif',
          formatter: () => {
            const total = numbers.value.reduce((sum, item) => sum + item, 0);
            return `${total}`;
          }
        }
      }
    }
  },
  stroke: {
    lineCap: 'round'
  },
  tooltip: {
    theme: 'dark'
  }
}));
</script>

<template>
  <v-card elevation="0" class="h-100 d-flex flex-column">
    <v-card class="flex-grow-1">
      <v-card-text>
        <h3 class="text-h3 mt-1">نمونه</h3>
        <div class="mt-4">
          <template v-if="isLoading">
            <div class="d-flex justify-center py-8">
              <v-progress-circular indeterminate color="primary" size="40" />
            </div>
          </template>
          <template v-else>
            <apexchart
              type="radialBar"
              height="380"
              :options="chartOptions"
              :series="series"
              :key="`chart-${percentages.length}-${labels.length}`"
            ></apexchart>
            <v-alert v-if="loadError" type="warning" class="mt-4" :text="loadError" variant="tonal" />
          </template>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

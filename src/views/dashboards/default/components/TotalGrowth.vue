<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import vuetify from '@/plugins/vuetify';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { api } from '@/services/api';
import { useI18n } from 'vue-i18n';

const customizerStore = ref(useCustomizerStore());
const { t, locale } = useI18n();
const currentTheme = ref(vuetify.theme.themes.value[customizerStore.value.getActTheme]);
const requestTypeLabels = computed<Record<string, string>>(() => locale.value === 'fa'
  ? { LetterOfCredit: 'اعتبار اسنادی', ContractCode: 'تسهیلات', GuaranteeTypeRial: 'ضمانت‌نامه ریالی', GuaranteeType: 'ضمانت‌نامه ارزی' }
  : { LetterOfCredit: 'Letter of credit', ContractCode: 'Facilities', GuaranteeTypeRial: 'Rial guarantee', GuaranteeType: 'Foreign-currency guarantee' });
const groupName = ref<string[]>([]);
const seriesData = ref<Array<{ name: string; data: number[] }>>([]);
const isLoading = ref<boolean>(true);
const loadError = ref<string | null>(null);
const chartRenderKey = ref(0);

type ConsignmentSeriesDTO = {
  name: string;
  persianName?: string;
  data: number[];
};

type ConsignmentInfoDTO = {
  requestType: string[];
  series: ConsignmentSeriesDTO[];
};

const select = ref({ state: '', abbr: 'ONE_DAY' });

const items = computed(() => [
  { state: t('dashboard.daily'), abbr: 'ONE_DAY' }, { state: t('dashboard.previousMonth'), abbr: 'ONE_MONTH' },
  { state: t('dashboard.previousTwoMonths'), abbr: 'TWO_MONTH' }, { state: t('dashboard.previousThreeMonths'), abbr: 'THREE_MONTH' }
]);

const seriesLabels = computed<Record<string, string>>(() => ({
  '1': t('dashboard.requestReceived'), '2': t('dashboard.postalAssigned'), '3': t('dashboard.successfulVisit'), '4': t('dashboard.unsuccessfulVisit'),
  '200': t('dashboard.registered'), '201': t('dashboard.invalidSerial'), '202': t('dashboard.duplicateSerial'), '204': t('dashboard.invalidDestination'),
  '205': t('dashboard.invalidRecipientAddress'), '206': t('dashboard.duplicateTracking'), '207': t('dashboard.invalidRecipient'), '208': t('dashboard.unknownCommitment'),
  '209': t('dashboard.unknownError'), Ready: t('dashboard.readyToSend'), NonAuthoritativeInformation: t('dashboard.invalidUserCode'), NotAcceptable: t('dashboard.invalidData')
}));

watch(
  () => customizerStore.value.getActTheme,
  (newTheme) => {
    currentTheme.value = vuetify.theme.themes.value[newTheme];
    chartRenderKey.value++;
  }
);

const fetchConsignmentInfo = async () => {
  isLoading.value = true;
  loadError.value = null;

  try {
    const res = await api.base.fetchConsignmentInfo(select.value.abbr);

    if (res?.status === 200) {
      const data = res.data as ConsignmentInfoDTO;

      groupName.value = data.requestType.map((item) => {
        return requestTypeLabels.value[item] ?? item;
      });

      const categoriesCount = groupName.value.length || 1;

      seriesData.value = Object.keys(seriesLabels.value).map((key) => {
        const apiSeries = data.series?.find((s) => s.name.toString() === key);

        return {
          name: seriesLabels.value[key],
          data: apiSeries ? apiSeries.data.map((n) => Number(n) || 0) : Array(categoriesCount).fill(0)
        };
      });

      if (!seriesData.value.length) {
        seriesData.value = [{ name: t('dashboard.noData'), data: [0] }];
      }
    } else {
      groupName.value = ['—'];
      seriesData.value = [{ name: t('dashboard.noData'), data: [0] }];
      loadError.value = t('dashboard.dataLoadIssue');
    }
  } catch (err) {
    groupName.value = ['—'];
    seriesData.value = [{ name: t('dashboard.noData'), data: [0] }];
    loadError.value = t('dashboard.dataLoadError');
  } finally {
    chartRenderKey.value++;
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchConsignmentInfo();
});

watch(
  () => select.value.abbr,
  async (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      await fetchConsignmentInfo();
    }
  }
);
watch(locale, () => { select.value = { state: items.value.find(item => item.abbr === select.value.abbr)?.state ?? '', abbr: select.value.abbr }; fetchConsignmentInfo(); });

const chartOptions1 = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 380,
      fontFamily: `inherit`,
      foreColor: currentTheme.value.colors.darkText,
      stacked: true,
      toolbar: {
        show: false
      }

    },
    colors: [
      currentTheme.value.colors.chartColor1,
      currentTheme.value.colors.chartColor2,
      currentTheme.value.colors.chartColor3,
      currentTheme.value.colors.chartColor4,
      currentTheme.value.colors.chartColor5,
      currentTheme.value.colors.chartColor6,
      currentTheme.value.colors.chartColor7,
      currentTheme.value.colors.chartColor8,
      currentTheme.value.colors.chartColor9,
      currentTheme.value.colors.chartColor10,
      currentTheme.value.colors.chartColor11,
      currentTheme.value.colors.chartColor12,
      currentTheme.value.colors.chartColor13,
      currentTheme.value.colors.chartColor14,
      currentTheme.value.colors.chartColor15,
      currentTheme.value.colors.chartColor16,
      currentTheme.value.colors.chartColor17,
      currentTheme.value.colors.chartColor18,
      currentTheme.value.colors.chartColor19,
      currentTheme.value.colors.chartColor20
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      type: 'category',
      categories: groupName.value
    },
    legend: {
      show: true,
      fontFamily: `'vazir', sans-serif`,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      markers: {
        width: 12,
        height: 12,
        radius: 4
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    fill: {
      type: 'solid'
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: true
    },
    tooltip: {
      theme: 'dark'
    }
  };
});

const lineChart1 = computed(() => ({
  series: seriesData.value
}));
</script>

<template>
  <v-card elevation="0" class="h-100 d-flex flex-column">
    <v-card class="flex-grow-1">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="9">
            <h3 class="text-h3 mt-1">{{ t('dashboard.chart') }}</h3>
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              color="primary"
              variant="outlined"
              hide-details
              v-model="select"
              :items="items"
              item-title="state"
              item-value="abbr"
              :label="t('dashboard.period')"
              persistent-hint
              return-object
              single-line
            >
            </v-select>
          </v-col>
        </v-row>
        <div class="mt-4 chart-container">
          <template v-if="isLoading">
            <div class="d-flex justify-center py-8">
              <v-progress-circular indeterminate color="primary" size="40" />
            </div>
          </template>
          <template v-else>
            <apexchart
              type="bar"
              height="380"
              :options="chartOptions1"
              :series="lineChart1.series"
              :key="chartRenderKey"
              class="chart-wrapper"
            ></apexchart>
            <v-alert v-if="loadError" type="warning" class="mt-4" :text="loadError" variant="tonal" />
          </template>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style lang="scss" scoped>
.chart-container {
  padding: 8px;

  .chart-wrapper {
    margin-bottom: 16px;
  }
}

// Enhanced legend styling
:deep(.apexcharts-legend) {
  padding: 16px 8px !important;

  .apexcharts-legend-series {
    margin: 8px 12px !important;

    .apexcharts-legend-marker {
      margin-right: 8px !important;
    }

    .apexcharts-legend-text {
      padding: 4px 8px !important;
      font-size: 13px !important;
      line-height: 1.4 !important;
    }
  }
}

// Better spacing for chart elements
:deep(.apexcharts-chart) {
  padding: 8px;
}

:deep(.apexcharts-xaxis) {
  padding-top: 12px;
}

:deep(.apexcharts-yaxis) {
  padding-right: 8px;
}
</style>

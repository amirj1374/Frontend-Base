<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { BaseBreadcrumb, CustomDataTable } from '@amirjalili1374/ui-kit';
import Settings from '@/components/sections/settings/settings.vue';
import axiosInstance from '@/services/axiosInstance';
// Use dynamic imports for heavy components
const localAxiosInstance = axiosInstance;

const { t } = useI18n();
const page = computed(() => ({ title: t('settings.title') }));
const error = ref<string | null>(null);
const showError = ref(false);
const breadcrumbs = computed(() => [
  {
    title: t('settings.title'),
    disabled: false,
    href: '#'
  }
]);

const headers = computed(() => [
  {
    title: t('settings.name'),
    key: 'name',
    sortable: true,
    width: 150
  },
  {
    title: t('settings.description'),
    key: 'description',
    sortable: true,
    width: 150
  },
  {
    title: t('settings.value'),
    key: 'value',
    sortable: true,
    width: 300
  }
]);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <div class="primary-section">
    <CustomDataTable
      ref="dataTableRef"
      :headers="headers"
      api-resource="services/postservice/api/post-configuration"
      :auto-fetch="false"
      :show-pagination="true"
      :height="540"
      :filter-component="Settings"
      :actions="['filter']"
      :global-fetch="true"
      :axiosInstance="localAxiosInstance"
    />
  </div>
  <v-snackbar v-model="showError" color="error" timeout="5500">
    {{ error }}
  </v-snackbar>
</template>

<style lang="scss" scoped>
@media (forced-colors: active) {
  .v-btn {
    forced-color-adjust: none;
  }

  .v-text-field {
    forced-color-adjust: none;
  }
}
</style>

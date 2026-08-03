<script lang="ts" setup>
import { ref } from 'vue';
import { BaseBreadcrumb, CustomDataTable } from '@amirjalili1374/ui-kit';
import Settings from '@/components/sections/settings/settings.vue';
import axiosInstance from '@/services/axiosInstance';
// Use dynamic imports for heavy components
const localAxiosInstance = axiosInstance;

const page = ref({ title: 'مدیریت سیستم' });
const error = ref<string | null>(null);
const showError = ref(false);
const breadcrumbs = ref([
  {
    title: 'مدیریت سیستم',
    disabled: false,
    href: '#'
  }
]);

const headers = [
  {
    title: 'نام',
    key: 'name',
    sortable: true,
    width: 150
  },
  {
    title: 'توضیحات',
    key: 'description',
    sortable: true,
    width: 150
  },
  {
    title: 'مقدار',
    key: 'value',
    sortable: true,
    width: 300
  }
];
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

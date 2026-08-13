<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  AppConfirmAction,
  AppEmptyState,
  AppFilePreview,
  AppFilterBar,
  AppFormSection,
  AppNotificationCenter,
  AppPageHeader,
  AppStatusBadge,
  type AppNotification,
  type PreviewFile
} from '@amirjalili1374/ui-kit';

const showFilters = ref(true);
const showConfirmation = ref(false);
const showNotifications = ref(false);
const { t } = useI18n();
const files = computed<PreviewFile[]>(() => [{ id: 1, name: t('showcase.guide'), type: 'PDF', size: '1.2 MB' }, { id: 2, name: t('showcase.sampleImage'), type: 'PNG', size: '420 KB' }]);
const notifications = ref<AppNotification[]>([]);
const localizedNotifications = computed<AppNotification[]>(() => notifications.value.length ? notifications.value : [
  { id: 1, title: t('showcase.saved'), description: t('showcase.savedDescription'), time: t('showcase.now'), read: false },
  { id: 2, title: t('showcase.ready'), description: t('showcase.readyDescription'), time: t('showcase.minutesAgo'), read: true }
]);
</script>

<template>
  <main class="showcase">
    <AppPageHeader :title="t('showcase.title')" :subtitle="t('showcase.subtitle')">
      <template #actions>
        <AppNotificationCenter v-model="showNotifications" :notifications="localizedNotifications" @read-all="notifications = localizedNotifications.map(item => ({ ...item, read: true }))" />
        <v-btn color="primary" @click="showConfirmation = true">{{ t('showcase.action') }}</v-btn>
      </template>
    </AppPageHeader>

    <AppFilterBar v-model="showFilters" :title="t('showcase.filters')" @reset="undefined" @submit="undefined">
      <v-text-field :label="t('showcase.search')" hide-details />
      <v-select :label="t('showcase.status')" :items="[t('showcase.all'), t('showcase.active'), t('showcase.inactive')]" hide-details />
      <v-text-field :label="t('showcase.date')" hide-details readonly prepend-inner-icon="$calendar" />
    </AppFilterBar>

    <section class="showcase__grid">
      <AppFormSection :title="t('showcase.sampleInfo')" :description="t('showcase.formDescription')">
        <v-text-field :label="t('showcase.fullName')" hide-details />
        <v-text-field :label="t('showcase.phone')" hide-details />
        <v-text-field :label="t('showcase.email')" hide-details />
        <v-select :label="t('showcase.category')" :items="[t('showcase.optionOne'), t('showcase.optionTwo')]" hide-details />
      </AppFormSection>

      <v-card class="showcase__card">
        <v-card-title>{{ t('showcase.states') }}</v-card-title>
        <v-card-text class="d-flex flex-wrap ga-3">
          <AppStatusBadge :label="t('showcase.reviewing')" color="warning" />
          <AppStatusBadge :label="t('showcase.approved')" color="success" icon="$success" />
          <AppStatusBadge :label="t('showcase.needsAction')" color="error" />
          <AppStatusBadge :label="t('showcase.draft')" color="secondary" />
        </v-card-text>
      </v-card>

      <v-card class="showcase__card">
        <v-card-title>{{ t('showcase.files') }}</v-card-title>
        <v-card-text><AppFilePreview :files="files" removable downloadable @remove="file => files = files.filter(item => item.id !== file.id)" @download="undefined" /></v-card-text>
      </v-card>

      <v-card class="showcase__card"><AppEmptyState :title="t('showcase.emptyTitle')" :description="t('showcase.emptyDescription')" :action-text="t('showcase.create')" @action="showConfirmation = true" /></v-card>
    </section>

    <AppConfirmAction v-model="showConfirmation" :title="t('showcase.confirmTitle')" :description="t('showcase.confirmDescription')" :confirm-text="t('showcase.confirm')" @confirm="showConfirmation = false" />
  </main>
</template>

<style scoped>
.showcase{display:grid;gap:20px;padding:16px;max-width:1400px;margin:auto}.showcase__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.showcase__grid>:first-child{grid-column:1/-1}.showcase__card{border-radius:var(--app-text-field-radius,12px)}@media(max-width:800px){.showcase{padding:8px}.showcase__grid{grid-template-columns:1fr}}
</style>

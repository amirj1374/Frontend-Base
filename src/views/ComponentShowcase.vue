<script setup lang="ts">
import { ref } from 'vue';
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
const files = ref<PreviewFile[]>([
  { id: 1, name: 'راهنمای استفاده.pdf', type: 'PDF', size: '1.2 MB' },
  { id: 2, name: 'تصویر نمونه.png', type: 'PNG', size: '420 KB' }
]);
const notifications = ref<AppNotification[]>([
  { id: 1, title: 'تغییرات ذخیره شد', description: 'تنظیمات نمایشی با موفقیت ثبت شد.', time: 'اکنون', read: false },
  { id: 2, title: 'نمونهٔ آماده', description: 'کامپوننت‌های عمومی برای بررسی آماده‌اند.', time: '۵ دقیقه قبل', read: true }
]);
</script>

<template>
  <main class="showcase">
    <AppPageHeader title="نمونهٔ کامپوننت‌های UI Kit" subtitle="همهٔ اجزا با رنگ، فونت، radius و حالت روشن/تاریک فعلی هماهنگ هستند.">
      <template #actions>
        <AppNotificationCenter v-model="showNotifications" :notifications="notifications" @read-all="notifications = notifications.map(item => ({ ...item, read: true }))" />
        <v-btn color="primary" @click="showConfirmation = true">عملیات نمونه</v-btn>
      </template>
    </AppPageHeader>

    <AppFilterBar v-model="showFilters" title="فیلتر و جستجو" @reset="undefined" @submit="undefined">
      <v-text-field label="عبارت جستجو" hide-details />
      <v-select label="وضعیت" :items="['همه', 'فعال', 'غیرفعال']" hide-details />
      <v-text-field label="تاریخ ثبت" hide-details readonly prepend-inner-icon="$calendar" />
    </AppFilterBar>

    <section class="showcase__grid">
      <AppFormSection title="اطلاعات نمونه" description="چینش فرم به‌صورت واکنش‌گرا از دو ستون به یک ستون تبدیل می‌شود.">
        <v-text-field label="نام و نام خانوادگی" hide-details />
        <v-text-field label="شماره تماس" hide-details />
        <v-text-field label="پست الکترونیک" hide-details />
        <v-select label="دسته‌بندی" :items="['گزینهٔ اول', 'گزینهٔ دوم']" hide-details />
      </AppFormSection>

      <v-card class="showcase__card">
        <v-card-title>وضعیت‌ها</v-card-title>
        <v-card-text class="d-flex flex-wrap ga-3">
          <AppStatusBadge label="در حال بررسی" color="warning" />
          <AppStatusBadge label="تأیید شده" color="success" icon="$success" />
          <AppStatusBadge label="نیازمند اقدام" color="error" />
          <AppStatusBadge label="پیش‌نویس" color="secondary" />
        </v-card-text>
      </v-card>

      <v-card class="showcase__card">
        <v-card-title>فایل‌های انتخاب‌شده</v-card-title>
        <v-card-text><AppFilePreview :files="files" removable downloadable @remove="file => files = files.filter(item => item.id !== file.id)" @download="undefined" /></v-card-text>
      </v-card>

      <v-card class="showcase__card"><AppEmptyState title="داده‌ای برای نمایش وجود ندارد" description="برای شروع، یک مورد جدید ایجاد کنید." action-text="ایجاد مورد" @action="showConfirmation = true" /></v-card>
    </section>

    <AppConfirmAction v-model="showConfirmation" title="انجام عملیات نمونه؟" description="این دیالوگ تنها رفتار و ظاهر تأیید عملیات را نمایش می‌دهد." confirm-text="تأیید" @confirm="showConfirmation = false" />
  </main>
</template>

<style scoped>
.showcase{display:grid;gap:20px;padding:16px;max-width:1400px;margin:auto}.showcase__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.showcase__grid>:first-child{grid-column:1/-1}.showcase__card{border-radius:var(--app-text-field-radius,12px)}@media(max-width:800px){.showcase{padding:8px}.showcase__grid{grid-template-columns:1fr}}
</style>

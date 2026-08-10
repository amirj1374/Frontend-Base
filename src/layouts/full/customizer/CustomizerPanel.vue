<script setup lang="ts">
import { AppCustomizer } from '@amirjalili1374/ui-kit';
import { api } from '@/services/api';
import { ref } from 'vue';

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

/** Consumer adapter: UI Kit emits the whole preference string; only this app owns its API URL. */
async function saveCustomizer(payload: string) {
  try {
    const response = await api.user.setCustomizer(payload);
    const echoedPayload = response?.data?.received;
    snackbarMessage.value = echoedPayload
      ? `رشتهٔ ارسال‌شده: ${echoedPayload}`
      : 'تنظیمات با موفقیت ذخیره شد';
    snackbarColor.value = 'success';
  } catch {
    snackbarMessage.value = 'خطا در ذخیره تنظیمات';
    snackbarColor.value = 'error';
  } finally {
    snackbar.value = true;
  }
}
</script>

<template>
  <AppCustomizer @save="saveCustomizer" />
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="2500">{{ snackbarMessage }}</v-snackbar>
</template>

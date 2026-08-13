<script setup lang="ts">
import { AppCustomizer, type AppLanguage } from '@amirjalili1374/ui-kit';
import { api } from '@/services/api';
import { ref } from 'vue';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { useI18n } from 'vue-i18n';
import { IconSettings } from '@tabler/icons-vue';

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const languageSuggestion = ref<AppLanguage | null>(null);
const customizer = useCustomizerStore();
const { t } = useI18n();

function suggestLanguageChange(language: AppLanguage) {
  // The UI Kit is the single source of truth for whether a direction change
  // merits a suggestion. The consuming app only renders that suggestion and
  // owns the actual language change.
  languageSuggestion.value = language;
}

function setLanguage(language: AppLanguage) {
  customizer.SET_LANGUAGE(language);
  languageSuggestion.value = null;
}

/** Consumer adapter: UI Kit emits the whole preference string; only this app owns its API URL. */
async function saveCustomizer(payload: string) {
  try {
    const response = await api.user.setCustomizer(payload);
    const echoedPayload = response?.data?.received;
    snackbarMessage.value = echoedPayload
      ? t('common.sentPayload', { payload: echoedPayload })
      : t('common.saveSuccess');
    snackbarColor.value = 'success';
  } catch {
    snackbarMessage.value = t('common.saveError');
    snackbarColor.value = 'error';
  } finally {
    snackbar.value = true;
  }
}
</script>

<template>
  <AppCustomizer @save="saveCustomizer" @suggest-language-change="suggestLanguageChange" />
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="2500">{{ snackbarMessage }}</v-snackbar>
  <v-snackbar :model-value="languageSuggestion !== null" class="language-suggestion" color="surface" elevation="12" timeout="8000" location="bottom" @update:model-value="languageSuggestion = null">
    <div class="d-flex align-center ga-3">
      <v-avatar color="primary" size="36"><IconSettings :size="20" /></v-avatar>
      <div><div class="font-weight-bold">{{ t('customizer.switchLanguage') }}</div><div class="text-body-2 text-medium-emphasis">{{ t(languageSuggestion === 'en' ? 'customizer.switchToEnglish' : 'customizer.switchToPersian') }}</div></div>
    </div>
    <template #actions>
      <v-btn variant="text" @click="languageSuggestion = null">{{ t('common.no') }}</v-btn>
      <v-btn variant="flat" color="primary" @click="languageSuggestion && setLanguage(languageSuggestion)">{{ t(languageSuggestion === 'en' ? 'customizer.confirmEnglish' : 'customizer.confirmPersian') }}</v-btn>
    </template>
  </v-snackbar>
</template>
<style scoped>.language-suggestion :deep(.v-snackbar__wrapper){max-width:560px;border:1px solid rgba(var(--v-theme-primary),.18);border-radius:var(--design-card-radius,12px)}</style>

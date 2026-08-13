<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { RouterView } from 'vue-router';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { i18n } from '@/i18n';

const customizer = useCustomizerStore();
watch(
  () => [customizer.language, customizer.direction] as const,
  ([language, direction]) => {
    i18n.global.locale.value = language as 'fa' | 'en';
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  },
  { immediate: true }
);
</script>

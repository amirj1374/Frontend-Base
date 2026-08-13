<template>
  <v-locale-provider :rtl="customizer.direction === 'rtl'">
    <RouterView />
  </v-locale-provider>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';

const customizer = useCustomizerStore();
</script>

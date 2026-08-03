<script setup lang="ts">
import {
  AppCustomizerControls,
  AppCustomizerSubmit,
  type TextFieldHeight,
  type TextFieldVariant
} from '@amirjalili1374/ui-kit';
import { ref } from 'vue';

// Reference-only component. It is intentionally not registered as an app route.
const radius = ref(10);
const variant = ref<TextFieldVariant>('outlined');
const height = ref<TextFieldHeight>('default');
const textScale = ref(100);

function apply() {
  // Persist only fields supported by the consuming application's API contract.
}
</script>

<template>
  <section class="pa-6">
    <AppCustomizerControls
      v-model:text-field-border-radius="radius"
      v-model:text-field-variant="variant"
      v-model:text-field-height="height"
      v-model:text-scale="textScale"
      :show-actions="false"
    />
    <AppCustomizerSubmit class="mt-6" @apply="apply" />
  </section>
</template>

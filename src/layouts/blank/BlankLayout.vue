<template>
  <v-locale-provider :rtl="true">
    <RouterView />
  </v-locale-provider>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

/**
 * Safe wrapper around vue3-apexcharts.
 *
 * vue3-apexcharts (current versions) reads the chart's DOM element from
 * `proxy.$el` inside its own onMounted, while also watching `options`/`series`.
 * Under Vue 3.5 a prop watcher can fire `new ApexCharts($el)` before `$el` is
 * assigned, throwing "Cannot read properties of null (reading 'nodeType')".
 *
 * By only rendering the real chart one tick after this wrapper has mounted, the
 * underlying chart is always created against a real, stable DOM element with
 * settled props. Registered globally as `apexchart`, so existing
 * `<apexchart .../>` usages are transparently made safe.
 */
defineOptions({ inheritAttrs: false });

const ready = ref(false);

onMounted(async () => {
  await nextTick();
  ready.value = true;
});
</script>

<template>
  <VueApexCharts v-if="ready" v-bind="$attrs" />
</template>

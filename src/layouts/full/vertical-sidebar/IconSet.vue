<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: [Object, Function],
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
});

const IconComponent = computed(() => {
  return props.item;
});
</script>

<template>
  <template v-if="props.level > 0">
    <component :is="IconComponent" size="5" fill="currentColor" stroke-width="1.5" class="iconClass"></component>
  </template>
  <template v-else>
    <component :is="IconComponent" size="20" stroke-width="1.5" class="iconClass"></component>
  </template>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { MarkerType } from '@vue-flow/core';
import { useIsasErdStore } from '../../stores/erd.store';

const store = useIsasErdStore();
const sourceColumn = ref('');
const targetColumn = ref('');

const sourceNode = computed(() => store.nodes.find((node) => node.id === store.pendingSource));
const targetNode = computed(() => store.nodes.find((node) => node.id === store.pendingTarget));
const sourceColumns = computed(() => sourceNode.value?.data.columns || []);
const targetColumns = computed(() => targetNode.value?.data.columns || []);

watch(() => store.relationOpen, (open) => {
  if (!open) return;
  const edge = store.edges.find((item) => item.id === store.selectedEdgeId);
  sourceColumn.value = String(edge?.data?.sourceColumn || '').split(' ')[0];
  targetColumn.value = String(edge?.data?.targetColumn || '').split(' ')[0];
});

function saveRelation() {
  if (!sourceColumn.value || !targetColumn.value) return;
  const id = store.selectedEdgeId || `e-${store.pendingSource}-${store.pendingTarget}-${crypto.randomUUID()}`;
  const edge = {
    id,
    source: store.pendingSource,
    target: store.pendingTarget,
    type: 'default',
    label: `[JOIN] ${sourceColumn.value} → ${targetColumn.value}`,
    markerEnd: MarkerType.ArrowClosed,
    style: { stroke: '#f27d24', strokeWidth: 2 },
    data: { sourceColumn: sourceColumn.value, targetColumn: targetColumn.value }
  };
  const index = store.edges.findIndex((item) => item.id === id);
  if (index >= 0) store.edges.splice(index, 1, edge);
  else store.edges.push(edge);
  store.selectedEdgeId = id;
  store.relationOpen = false;
}
</script>

<template>
  <v-dialog v-model="store.relationOpen" max-width="700">
    <v-card title="مشخص‌کردن ارتباط ستون‌ها">
      <v-card-text>
        <div class="mapping-grid">
          <div><strong>مبدأ: {{ sourceNode?.data.label }}</strong><v-select v-model="sourceColumn" class="mt-3" :items="sourceColumns" item-title="name" item-value="name" label="ستون مبدأ" /></div>
          <div><strong>مقصد: {{ targetNode?.data.label }}</strong><v-select v-model="targetColumn" class="mt-3" :items="targetColumns" item-title="name" item-value="name" label="ستون مقصد" /></div>
        </div>
      </v-card-text>
      <v-card-actions><v-spacer /><v-btn @click="store.relationOpen = false">انصراف</v-btn><v-btn color="primary" :disabled="!sourceColumn || !targetColumn" @click="saveRelation">تأیید</v-btn></v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>.mapping-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; } @media (max-width: 600px) { .mapping-grid { grid-template-columns: 1fr; } }</style>

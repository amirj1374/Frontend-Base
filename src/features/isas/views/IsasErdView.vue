<script setup lang="ts">
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import dagre from '@dagrejs/dagre';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { MarkerType, VueFlow, useVueFlow, type Connection, type EdgeMouseEvent } from '@vue-flow/core';
import { IconAdjustmentsHorizontal, IconDatabase, IconDeviceFloppy, IconRefresh, IconTrash } from '@tabler/icons-vue';
import { normalizeAppError } from '@/errors/appError';
import { useAccess } from '@/composables/useAccess';
import { isasApi } from '../services/isasApi';
import { useIsasErdStore } from '../stores/erd.store';
import type { ErdEdge, ErdNode } from '../types/erd';
import type { EntityOption } from '../types/chat';
import CatalogInfoDialog from '../components/erd/CatalogInfoDialog.vue';
import ErdTableNode from '../components/erd/ErdTableNode.vue';
import RelationMappingDialog from '../components/erd/RelationMappingDialog.vue';
import type { ErdRelationChange } from '../types/erd';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

const store = useIsasErdStore();
const entityOptions = ref<EntityOption[]>([]);
const entitySearch = ref('');
const loadingEntities = ref(false);
const savingChanges = ref(false);
const saveNotice = ref('');
const saveNoticeOpen = ref(false);
const { fitView } = useVueFlow();
const { can } = useAccess();
const canEdit = can('isas:data:edit');
let activeRequest: AbortController | null = null;
let entityRequest: AbortController | null = null;
let entitySearchTimer: number | null = null;
let entityRequestId = 0;

function layoutGraph(nodes: ErdNode[], edges: ErdEdge[]): { nodes: ErdNode[]; edges: ErdEdge[] } {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 180, marginx: 40, marginy: 40 });
  nodes.forEach((node) => graph.setNode(node.id, { width: 290, height: 90 }));
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  dagre.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const position = graph.node(node.id);
      return { ...node, data: markRaw(node.data), type: 'erdTable', position: { x: position.x - 145, y: position.y - 45 } };
    }),
    edges: edges.map((edge) => ({
      ...edge,
      markerEnd: edge.markerEnd || MarkerType.ArrowClosed,
      style: edge.style || { stroke: '#7c3aed', strokeWidth: 2 }
    }))
  };
}

async function loadEntities(filter = '') {
  const normalizedFilter = filter.trim();
  if (normalizedFilter.length < 2) {
    entityRequest?.abort();
    entityOptions.value = [];
    loadingEntities.value = false;
    return;
  }
  entityRequest?.abort();
  const requestController = new AbortController();
  entityRequest = requestController;
  const requestId = ++entityRequestId;
  loadingEntities.value = true;
  try {
    const entities = await isasApi.searchErdEntities(normalizedFilter, requestController.signal);
    if (requestId === entityRequestId) {
      entityOptions.value = entities.slice(0, 80);
      store.errorMessage = '';
    }
  } catch (error) {
    if (requestController.signal.aborted) return;
    if (requestId === entityRequestId) {
      entityOptions.value = [];
      store.errorMessage = normalizeAppError(error).message;
    }
  } finally {
    if (requestId === entityRequestId) {
      loadingEntities.value = false;
      entityRequest = null;
    }
  }
}

watch(entitySearch, (filter) => {
  const selectedTitle = entityOptions.value.find((item) => item.value === store.selectedEntity)?.title;
  if (selectedTitle && filter === selectedTitle) return;
  if (entitySearchTimer !== null) window.clearTimeout(entitySearchTimer);
  if ((filter || '').trim().length < 2) {
    void loadEntities(filter || '');
    return;
  }
  entitySearchTimer = window.setTimeout(() => void loadEntities(filter || ''), 350);
});

async function loadGraph() {
  if (!store.selectedEntity) return;
  activeRequest?.abort();
  activeRequest = new AbortController();
  store.loading = true;
  store.errorMessage = '';
  store.statusMessage = 'ثبت درخواست';
  store.settingsOpen = false;

  const [table = '', entityName = ''] = store.selectedEntity.split('|');
  const nodeMap = new Map<string, ErdNode>();
  const edgeMap = new Map<string, ErdEdge>();

  try {
    await isasApi.streamErd(
      { table, entityName, depth: store.relationDepth },
      {
        onNode: (node) => nodeMap.set(node.id, node),
        onEdge: (edge) => edgeMap.set(edge.id, edge),
        onStatus: (message) => { store.statusMessage = message; }
      },
      activeRequest.signal
    );
    const graph = layoutGraph([...nodeMap.values()], [...edgeMap.values()]);
    store.replaceGraph(graph.nodes, graph.edges);
    await nextTick();
    await fitView({ padding: 0.15, duration: 500 });
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      store.errorMessage = normalizeAppError(error).message;
    }
  } finally {
    store.loading = false;
    store.statusMessage = '';
    activeRequest = null;
  }
}

function connectRelation(connection: Connection) {
  if (!canEdit || !connection.source || !connection.target) return;
  store.openRelation(connection.source, connection.target);
}

function selectEdge({ edge }: EdgeMouseEvent) {
  store.selectedEdgeId = edge.id;
  if (canEdit) store.openRelation(edge.source, edge.target, edge.id);
}

function buildChanges(): ErdRelationChange[] {
  const changes: ErdRelationChange[] = [];
  for (const edge of store.originalEdges) {
    const current = store.edges.find((item) => item.id === edge.id);
    if (!current) {
      changes.push({ operation: 'removed', source: normalizeRelationNodeId(edge.source), target: normalizeRelationNodeId(edge.target), sourceColumn: String(edge.data?.sourceColumn || ''), targetColumn: String(edge.data?.targetColumn || ''), edgeType: edge.type });
    } else if (JSON.stringify(current.data) !== JSON.stringify(edge.data) || current.source !== edge.source || current.target !== edge.target) {
      changes.push({ operation: 'modified', source: normalizeRelationNodeId(current.source), target: normalizeRelationNodeId(current.target), sourceColumn: String(current.data?.sourceColumn || ''), targetColumn: String(current.data?.targetColumn || ''), edgeType: current.type });
    }
  }
  for (const edge of store.edges.filter((item) => !store.originalEdges.some((original) => original.id === item.id))) {
    changes.push({ operation: 'added', source: normalizeRelationNodeId(edge.source), target: normalizeRelationNodeId(edge.target), sourceColumn: String(edge.data?.sourceColumn || ''), targetColumn: String(edge.data?.targetColumn || ''), edgeType: edge.type });
  }
  return changes;
}

function normalizeRelationNodeId(nodeId: string) {
  return nodeId.includes('/') ? nodeId.slice(nodeId.indexOf('/') + 1) : nodeId;
}

const pendingChanges = computed(() => buildChanges());
const largeGraph = computed(() => store.nodes.length > 150 || store.edges.length > 250);

async function saveChanges() {
  const changes = pendingChanges.value;
  if (!changes.length) return;
  savingChanges.value = true;
  store.errorMessage = '';
  try {
    await isasApi.saveErdChanges(changes);
    store.markSaved();
    saveNotice.value = 'تغییرات ERD با موفقیت ذخیره شد.';
    saveNoticeOpen.value = true;
  } catch (error) {
    store.errorMessage = normalizeAppError(error).message;
  } finally {
    savingChanges.value = false;
  }
}

onMounted(async () => {
  store.settingsOpen = true;
});
onBeforeUnmount(() => {
  activeRequest?.abort();
  entityRequest?.abort();
  if (entitySearchTimer !== null) window.clearTimeout(entitySearchTimer);
});
</script>

<template>
  <section class="erd-page">
    <div class="erd-header">
      <div><div class="title-row"><h1>دانشنامه داده</h1></div><p>نمایش روابط Entityها و جداول لوتوس</p></div>
      <div class="d-flex ga-2">
        <v-btn v-if="canEdit && store.selectedEdgeId" :prepend-icon="IconTrash" color="error" variant="tonal" @click="store.removeSelectedEdge()">حذف رابطه</v-btn>
        <v-btn v-if="canEdit && store.nodes.length" :prepend-icon="IconDeviceFloppy" color="success" variant="tonal" :loading="savingChanges" :disabled="!pendingChanges.length" @click="saveChanges">ذخیره تغییرات <v-chip v-if="pendingChanges.length" size="x-small" class="ms-2">{{ pendingChanges.length }}</v-chip></v-btn>
        <v-btn :prepend-icon="IconRefresh" variant="tonal" :disabled="!store.selectedEntity" @click="loadGraph">بارگذاری مجدد</v-btn>
        <v-btn :prepend-icon="IconAdjustmentsHorizontal" color="primary" @click="store.settingsOpen = true">تنظیمات گراف</v-btn>
      </div>
    </div>

    <v-alert v-if="store.errorMessage" type="error" variant="tonal" closable @click:close="store.errorMessage = ''">{{ store.errorMessage }}</v-alert>

    <div class="flow-shell">
      <VueFlow v-model:nodes="store.nodes" v-model:edges="store.edges" :min-zoom="0.1" :max-zoom="4" :only-render-visible-elements="true" fit-view-on-init @connect="connectRelation" @edge-click="selectEdge">
        <template #node-erdTable="nodeProps"><ErdTableNode v-bind="nodeProps" /></template>
        <Background pattern-color="#64748b" :gap="20" />
        <Controls />
        <MiniMap v-if="store.nodes.length && !largeGraph" pannable zoomable />
      </VueFlow>

      <div v-if="!store.nodes.length && !store.loading" class="empty-state">
        <IconDatabase :size="48" />
        <h2>گرافی برای نمایش وجود ندارد</h2>
        <p>برای شروع، موجودیت و عمق روابط را از تنظیمات انتخاب کنید.</p>
        <v-btn color="primary" @click="store.settingsOpen = true">انتخاب موجودیت</v-btn>
      </div>
      <div v-if="store.loading" class="loading-overlay">
        <v-progress-circular indeterminate color="primary" size="52" />
        <strong>{{ store.statusMessage }}</strong>
      </div>
    </div>

    <v-dialog v-model="store.settingsOpen" max-width="560">
      <v-card title="تنظیمات دانشنامه داده">
        <v-card-text>
          <v-autocomplete v-model="store.selectedEntity" v-model:search="entitySearch" :items="entityOptions" item-title="title" item-value="value" :loading="loadingEntities" label="موجودیت" hint="برای جستجو حداقل دو کاراکتر وارد کنید." no-data-text="نتیجه‌ای پیدا نشد" persistent-hint no-filter clearable />
          <v-slider v-model="store.relationDepth" class="mt-5" label="عمق روابط" :min="1" :max="10" :step="1" thumb-label />
        </v-card-text>
        <v-card-actions><v-spacer /><v-btn @click="store.settingsOpen = false">انصراف</v-btn><v-btn color="primary" :disabled="!store.selectedEntity" @click="loadGraph">نمایش گراف</v-btn></v-card-actions>
      </v-card>
    </v-dialog>

    <CatalogInfoDialog />
    <RelationMappingDialog />
    <v-snackbar v-model="saveNoticeOpen" color="success" timeout="3000">{{ saveNotice }}</v-snackbar>
  </section>
</template>

<style scoped>
.erd-page { height: calc(100vh - 128px); min-height: 600px; display: flex; flex-direction: column; gap: 0.75rem; }
.erd-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.erd-header h1 { margin: 0; font-size: 1.3rem; }
.title-row { display: flex; align-items: center; gap: 0.65rem; }
.erd-header p { margin: 0.2rem 0 0; opacity: 0.65; font-size: 0.82rem; }
.flow-shell { position: relative; flex: 1 1 auto; min-height: 0; overflow: hidden; border-radius: 18px; border: 1px solid rgb(var(--v-theme-borderColor)); background: rgb(var(--v-theme-background)); }
.empty-state, .loading-overlay { position: absolute; inset: 0; z-index: 5; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.8rem; text-align: center; background: rgb(var(--v-theme-background) / 88%); }
.empty-state p { opacity: 0.7; }
@media (max-width: 700px) { .erd-header { align-items: flex-start; flex-direction: column; } }
</style>

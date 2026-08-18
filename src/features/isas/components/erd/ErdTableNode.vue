<script setup lang="ts">
import { ref } from 'vue';
import { Handle, Position, type NodeProps } from '@vue-flow/core';
import { IconChevronDown, IconDatabase, IconMessageQuestion } from '@tabler/icons-vue';
import type { ErdTableData } from '../../types/erd';
import { useIsasErdStore } from '../../stores/erd.store';

defineProps<NodeProps<ErdTableData>>();
const expanded = ref(false);
const store = useIsasErdStore();
</script>

<template>
  <article :class="['erd-table-node', { 'erd-table-node--selected': selected }]">
    <header>
      <IconDatabase :size="18" />
      <strong>{{ data.label }}</strong>
      <button v-if="data.catalogLabel || data.description" type="button" @click.stop="store.openCatalog(data)">
        <IconMessageQuestion :size="18" />
      </button>
      <button type="button" class="expand" @click.stop="expanded = !expanded">
        <IconChevronDown :class="{ rotated: expanded }" :size="18" />
      </button>
    </header>
    <div v-if="expanded" class="columns">
      <div v-for="column in data.columns" :key="column.name" class="column">
        <span :class="{ 'key-column': column.isPrimary || column.isForeign }">{{ column.name }}</span>
        <code>{{ column.type }}</code>
      </div>
    </div>
    <Handle id="right" type="source" :position="Position.Right" />
    <Handle id="left" type="target" :position="Position.Left" />
    <Handle id="bottom" type="source" :position="Position.Bottom" />
    <Handle id="top" type="target" :position="Position.Top" />
  </article>
</template>

<style scoped>
.erd-table-node { width: 290px; overflow: hidden; border-radius: 14px; border: 2px solid rgb(var(--v-theme-borderColor)); background: rgb(var(--v-theme-surface)); box-shadow: 0 8px 24px rgb(0 0 0 / 10%); }
.erd-table-node--selected { border-color: rgb(var(--v-theme-primary)); box-shadow: 0 0 0 4px rgb(var(--v-theme-primary) / 12%); }
header { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 0.9rem; color: rgb(var(--v-theme-on-primary)); background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary))); }
header strong { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
header button { display: grid; place-items: center; color: inherit; border: 0; background: transparent; cursor: pointer; }
.rotated { transform: rotate(180deg); }
.columns { max-height: 360px; overflow-y: auto; }
.column { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.55rem 0.85rem; border-bottom: 1px solid rgb(var(--v-theme-borderColor)); }
.column span { display: flex; align-items: center; gap: 0.35rem; }
.column code { font-size: 0.72rem; opacity: 0.7; }
</style>

<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@vue-flow/core';
import { IconBuildingStore, IconMailbox, IconTableShare, IconUser, IconUserCircle } from '@tabler/icons-vue';
import type { OrganizationNodeData } from '../../types/organization';

const props = defineProps<NodeProps<OrganizationNodeData>>();
const icons = { company: IconBuildingStore, deputy: IconBuildingStore, module: IconTableShare, manager: IconUserCircle, expert: IconUser };
const levelLabels = { company: 'شرکت', deputy: 'معاونت', module: 'ماژول', manager: 'مدیر ماژول', expert: 'کارشناس' };
</script>

<template>
  <article :class="['organization-node', `organization-node--${data.level}`, { 'organization-node--selected': props.selected }]">
    <Handle id="top" type="target" :position="Position.Top" />
    <div class="node-icon"><component :is="icons[data.level]" :size="20" /></div>
    <div class="node-copy">
      <small>{{ levelLabels[data.level] }}</small>
      <strong>{{ data.label }}</strong>
      <span>{{ data.subtitle }}</span>
      <span v-if="data.level === 'module' && data.description" class="node-description">{{ data.description }}</span>
      <span v-else-if="data.email" class="node-email"><IconMailbox :size="12" />{{ data.email }}</span>
    </div>
    <span v-if="data.memberCount !== undefined" class="member-count">{{ data.memberCount }} {{ data.memberLabel || 'زیرمجموعه' }}</span>
    <Handle id="bottom" type="source" :position="Position.Bottom" />
  </article>
</template>

<style scoped>
.organization-node { position: relative; width: 230px; min-height: 74px; display: flex; align-items: center; gap: 0.7rem; padding: 0.7rem 0.8rem; border: 2px solid rgb(var(--v-theme-borderColor)); border-radius: 16px; background: rgb(var(--v-theme-surface)); box-shadow: 0 9px 24px rgba(var(--v-theme-on-surface), 0.1); transition: transform 150ms ease, box-shadow 150ms ease; }
.organization-node:hover { transform: translateY(-2px); box-shadow: 0 13px 30px rgba(var(--v-theme-on-surface), 0.14); }
.organization-node--selected { box-shadow: 0 0 0 4px rgba(var(--v-theme-primary), 0.14), 0 13px 30px rgba(var(--v-theme-on-surface), 0.14); }
.node-icon { flex: 0 0 38px; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; }
.node-copy { min-width: 0; flex: 1; }.node-copy small,.node-copy strong,.node-copy span { display: block; }.node-copy small { margin-bottom: 0.1rem; font-size: 0.58rem; opacity: 0.55; }.node-copy strong { overflow: hidden; font-size: 0.78rem; text-overflow: ellipsis; white-space: nowrap; }.node-copy span { margin-top: 0.15rem; overflow: hidden; font-size: 0.62rem; opacity: 0.64; text-overflow: ellipsis; white-space: nowrap; }
.organization-node--company { width: 370px; min-height: 96px; color: rgb(var(--v-theme-on-primary)); border-color: transparent; background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary))); }.organization-node--company .node-icon { background: rgba(255,255,255,.16); }.organization-node--company .node-copy small,.organization-node--company .node-copy span { opacity: 0.84; }
.organization-node--deputy { width: 310px; min-height: 88px; border-color: rgba(var(--v-theme-primary), 0.42); }.organization-node--deputy .node-icon { color: rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-primary), 0.12); }
.organization-node--module { width: 270px; border-color: rgba(var(--v-theme-primary), 0.34); }.organization-node--module .node-icon { color: rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-primary), 0.1); }
.organization-node--manager { border-color: rgba(var(--v-theme-info), 0.3); }.organization-node--manager .node-icon { color: rgb(var(--v-theme-info)); background: rgba(var(--v-theme-info), 0.1); }
.organization-node--expert { width: 190px; min-height: 68px; border-width: 1px; border-color: rgba(var(--v-theme-success), 0.3); }.organization-node--expert .node-icon { color: rgb(var(--v-theme-success)); background: rgba(var(--v-theme-success), 0.1); }
.member-count { position: absolute; top: 0.5rem; inset-inline-end: 0.55rem; padding: 0.12rem 0.35rem; border-radius: 999px; color: rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-primary), 0.09); font-size: 0.55rem; }
.node-email { direction: ltr; unicode-bidi: isolate; display: flex !important; align-items: center; gap: 0.25rem; color: rgb(var(--v-theme-primary)); font-family: Consolas, monospace; font-size: 0.56rem !important; opacity: 0.9 !important; }.organization-node--company .node-email { color: inherit; }.node-description { white-space: normal !important; line-height: 1.5; }
:deep(.vue-flow__handle) { width: 8px; height: 8px; border: 2px solid rgb(var(--v-theme-surface)); background: rgb(var(--v-theme-primary)); }
</style>

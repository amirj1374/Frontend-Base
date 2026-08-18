<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { MarkerType, VueFlow, useVueFlow, type Edge, type Node } from '@vue-flow/core';
import { IconAdjustmentsHorizontal, IconChevronLeft, IconChevronRight, IconRefresh, IconSearch } from '@tabler/icons-vue';
import OrganizationNode from '../components/organization/OrganizationNode.vue';
import type { OrganizationLevel, OrganizationNodeData } from '../types/organization';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

type OrgNode = Node<OrganizationNodeData>;
const depth = ref(2);
const selectedNodeId = ref<string | null>(null);
const filterPanelOpen = ref(true);
const { fitView, setCenter } = useVueFlow();
const levelNumber: Record<OrganizationLevel, number> = { company: 1, deputy: 2, module: 3, manager: 4, expert: 5 };

const deputyNames = ['معاونت فناوری و زیرساخت', 'معاونت بانکداری دیجیتال', 'معاونت داده و نوآوری'];
const deputyPeople = ['محمدرضا فرهمند', 'سمیرا کیانی', 'کامران صبوری'];
const moduleNames = ['زیرساخت ابری','شبکه و ارتباطات','امنیت اطلاعات','مرکز داده','پشتیبانی شعب','مدیریت سرویس','اعتبارات','سپرده‌ها','پرداخت','کارت','بانکداری باز','تجربه مشتری','سکوی داده','انبار داده','هوش تجاری','هوش مصنوعی','حاکمیت داده','کیفیت داده','مبارزه با تقلب','مدیریت ریسک','تطبیق مقررات','خزانه‌داری','بازار سرمایه','ارز','عملیات متمرکز','مدیریت اسناد','اتوماسیون فرایند','مدیریت API','مدیریت هویت','اطلاع‌رسانی','باشگاه مشتریان','تحلیل رفتار','توسعه محصول','تضمین کیفیت','معماری سازمانی','مدیریت پروژه'];
const managerNames = ['سارا احمدی','رضا کاظمی','نگار شریفی','پویان امینی','آرمان توکلی','لیلا رستگار','بهرام نادری','مینا یوسفی','فرهاد مرادی','نسترن کریمی'];
const expertFirstNames = ['مریم','علی','الهام','امیر','حسین','زهرا','نرگس','محمد','سمیه','مجید','نیما','فاطمه','آیدا'];
const expertLastNames = ['رضایی','محمدی','مرادی','حسینی','کریمی','اکبری','زمانی','نادری','عباسی','حیدری','صادقی','جعفری','توکلی'];
const managerExpertCounts = [7, 7, 7, 7, 7, 6, 6, 6, 6, 6];
const deputyManagerGroups = [[0, 1, 2, 3], [4, 5, 6], [7, 8, 9]];
const rawNodes: OrgNode[] = [{ id: 'company', position: { x: 0, y: 0 }, data: { label: 'شرکت فناوری اطلاعات پارسیان', subtitle: 'شرکت مادر', level: 'company', email: 'info@parsian-tech.ir', memberCount: 3 } }];
const pairs: string[][] = [];

deputyNames.forEach((name, index) => {
  const id = `deputy-${index + 1}`;
  rawNodes.push({ id, position: { x: 0, y: 0 }, data: { label: deputyPeople[index], subtitle: name, level: 'deputy', email: `deputy${index + 1}@parsian-tech.ir`, memberCount: 12 } });
  pairs.push(['company', id]);
});

moduleNames.forEach((name, index) => {
  const id = `module-${index + 1}`;
  const deputyId = `deputy-${Math.floor(index / 12) + 1}`;
  const localIndex = index % 12;
  const managerGroup = deputyManagerGroups[Math.floor(index / 12)];
  const managerIndex = managerGroup[Math.min(managerGroup.length - 1, Math.floor(localIndex * managerGroup.length / 12))];
  const managerId = `manager-${managerIndex + 1}`;
  rawNodes.push({ id, position: { x: 0, y: 0 }, data: { label: `ماژول ${name}`, subtitle: `زیرمجموعه ${deputyNames[Math.floor(index / 12)]}`, description: `مسئول توسعه و پشتیبانی خدمات ${name}`, level: 'module', memberCount: 1 } });
  pairs.push([deputyId, id], [id, managerId]);
});

managerNames.forEach((name, index) => rawNodes.push({ id: `manager-${index + 1}`, position: { x: 0, y: 0 }, data: { label: name, subtitle: 'مدیر ماژول', level: 'manager', email: `manager${index + 1}@parsian-tech.ir`, memberCount: managerExpertCounts[index] } }));

let expertIndex = 0;
managerExpertCounts.forEach((count, managerIndex) => {
  for (let offset = 0; offset < count; offset += 1) {
    expertIndex += 1;
    const first = expertFirstNames[(expertIndex - 1) % expertFirstNames.length];
    const last = expertLastNames[(expertIndex * 3) % expertLastNames.length];
    const id = `expert-${expertIndex}`;
    rawNodes.push({ id, position: { x: 0, y: 0 }, data: { label: `${first} ${last}`, subtitle: `کارشناس ${moduleNames[(expertIndex - 1) % moduleNames.length]}`, level: 'expert', email: `expert${expertIndex}@parsian-tech.ir`, memberCount: 0 } });
    pairs.push([`manager-${managerIndex + 1}`, id]);
  }
});
const rawEdges: Edge[] = pairs.map(([source,target]) => ({ id: `${source}-${target}`, source, target, markerEnd: MarkerType.ArrowClosed, style: { stroke: '#8b5cf6', strokeWidth: 1.7 } }));

function nodeSize(level: OrganizationLevel) {
  return { width: level === 'company' ? 370 : level === 'deputy' ? 310 : level === 'module' ? 270 : level === 'expert' ? 210 : 230, height: level === 'company' ? 96 : level === 'module' ? 96 : 88 };
}

function radialPosition(node: OrgNode) {
  const level = node.data!.level;
  if (level === 'company') return { x: 0, y: 0 };
  const radii: Record<Exclude<OrganizationLevel, 'company'>, number> = { deputy: 420, module: 980, manager: 1480, expert: 2150 };
  const index = Number(node.id.split('-').at(-1)) - 1;
  const count = level === 'deputy' ? 3 : level === 'module' ? 36 : level === 'manager' ? 10 : 65;
  const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
  const size = nodeSize(level);
  return { x: Math.cos(angle) * radii[level] - size.width / 2, y: Math.sin(angle) * radii[level] - size.height / 2 };
}

function layout(nodes: OrgNode[]): OrgNode[] {
  return nodes.map((node) => ({ ...node, type: 'organization', selected: node.id === selectedNodeId.value, position: radialPosition(node) }));
}

const visibleIds = computed(() => new Set(rawNodes.filter((node) => levelNumber[node.data!.level] <= depth.value).map((node) => node.id)));
const visibleEdges = computed(() => rawEdges.filter((edge) => visibleIds.value.has(edge.source) && visibleIds.value.has(edge.target)).map((edge) => ({ ...edge, animated: Boolean(selectedNodeId.value && (edge.source === selectedNodeId.value || edge.target === selectedNodeId.value)) })));
const visibleNodes = computed(() => layout(rawNodes.filter((node) => visibleIds.value.has(node.id))));
const searchItems = computed(() => rawNodes.map((node) => ({
  value: node.id,
  title: `${node.data!.label} — ${node.data!.subtitle}`,
  searchText: `${node.data!.label} ${node.data!.subtitle} ${node.data!.email || ''} ${node.data!.description || ''}`
})));
async function refit() { await nextTick(); await fitView({ padding: 0.14, duration: 350 }); }
async function focusNode(nodeId: string | null) {
  if (!nodeId) { selectedNodeId.value = null; await refit(); return; }
  const node = rawNodes.find((item) => item.id === nodeId);
  if (!node) return;
  const requiredDepth = levelNumber[node.data!.level];
  if (depth.value < requiredDepth) { depth.value = requiredDepth; await nextTick(); }
  selectedNodeId.value = nodeId;
  await nextTick();
  const position = radialPosition(node);
  const size = nodeSize(node.data!.level);
  await setCenter(position.x + size.width / 2, position.y + size.height / 2, { zoom: 1.15, duration: 450 });
}
watch(depth, () => { selectedNodeId.value = null; void refit(); }); onMounted(() => void refit());
</script>

<template>
  <section class="organization-page">
    <header class="organization-header">
      <div><h1>مدل سازمانی معاونت فناوری</h1><p>نمایش روابط لایه‌های سازمانی در قالب گراف تعاملی</p></div>
    </header>
    <div class="level-strip"><span><i class="company" />۱ شرکت</span><span><i class="deputy" />۳ معاونت</span><span><i class="module" />۳۶ ماژول</span><span><i class="manager" />۱۰ مدیر</span><span><i class="expert" />۶۵ کارشناس</span></div>
    <div class="organization-workspace">
      <aside class="filter-panel" :class="{ 'filter-panel--collapsed': !filterPanelOpen }">
        <div class="filter-panel__heading">
          <v-avatar color="lightprimary" size="38"><IconAdjustmentsHorizontal :size="20" /></v-avatar>
          <div class="filter-panel__title"><strong>کنترل نمایش</strong><span>جستجو و تنظیم نمودار</span></div>
          <v-btn :icon="filterPanelOpen ? IconChevronRight : IconChevronLeft" variant="text" size="small" :aria-label="filterPanelOpen ? 'بستن فیلترها' : 'باز کردن فیلترها'" @click="filterPanelOpen = !filterPanelOpen" />
        </div>
        <div v-show="filterPanelOpen" class="filter-panel__body">
          <div class="filter-group"><label>دسترسی سریع</label><v-autocomplete v-model="selectedNodeId" :items="searchItems" :filter-keys="['title', 'searchText']" item-title="title" item-value="value" :prepend-inner-icon="IconSearch" label="نام، سمت یا ایمیل" hide-details clearable @update:model-value="focusNode" /><small>در تمام لایه‌های سازمان جستجو می‌شود.</small></div>
          <v-divider />
          <div class="filter-group"><label>جزئیات نمودار</label><v-select v-model="depth" :items="[{title:'معاونت‌ها',value:2},{title:'ماژول‌ها',value:3},{title:'مدیران',value:4},{title:'کارشناسان',value:5}]" item-title="title" item-value="value" label="نمایش تا سطح" hide-details /></div>
        </div>
        <v-btn v-show="filterPanelOpen" :prepend-icon="IconRefresh" variant="tonal" block @click="refit">مرکزچین نمودار</v-btn>
      </aside>
      <div class="organization-flow">
        <VueFlow :nodes="visibleNodes" :edges="visibleEdges" :min-zoom="0.15" :max-zoom="2.5" fit-view-on-init>
          <template #node-organization="nodeProps"><OrganizationNode v-bind="nodeProps" /></template>
          <Background pattern-color="#8b5cf6" :gap="24" :size="1" />
          <Controls /><MiniMap pannable zoomable />
        </VueFlow>
      </div>
    </div>
  </section>
</template>

<style scoped>
.organization-page { height: calc(100vh - 128px); min-height: 600px; display: flex; flex-direction: column; gap: 0.75rem; }.organization-header h1 { margin: 0; font-size: 1.3rem; }.organization-header p { margin: 0.2rem 0 0; font-size: 0.82rem; opacity: 0.64; }.level-strip { display: flex; align-items: center; gap: 1.2rem; padding: 0.65rem 0.9rem; border: 1px solid rgb(var(--v-theme-borderColor)); border-radius: 12px; background: rgb(var(--v-theme-surface)); font-size: 0.7rem; }.level-strip span { display: flex; align-items: center; gap: 0.35rem; }.level-strip i { width: 9px; height: 9px; border-radius: 50%; }.level-strip .company { background: rgb(var(--v-theme-primary)); }.level-strip .deputy { background: rgb(var(--v-theme-warning)); }.level-strip .module { background: rgb(var(--v-theme-secondary)); }.level-strip .manager { background: rgb(var(--v-theme-info)); }.level-strip .expert { background: rgb(var(--v-theme-success)); }.organization-workspace { display: flex; align-items: flex-start; flex: 1; min-height: 0; gap: 0.75rem; }.filter-panel { width: 270px; flex: 0 0 270px; order: -1; display: flex; flex-direction: column; gap: 1rem; padding: 1rem; border: 1px solid rgb(var(--v-theme-borderColor)); border-radius: var(--design-card-radius, 16px); background: rgb(var(--v-theme-surface)); box-shadow: 0 10px 28px rgba(var(--v-theme-dark), 0.06); transition: width .22s ease, flex-basis .22s ease, padding .22s ease; }.filter-panel--collapsed { width: 64px; flex-basis: 64px; padding: 0.75rem; }.filter-panel__heading { display: flex; align-items: center; gap: 0.7rem; }.filter-panel:not(.filter-panel--collapsed) .filter-panel__heading { padding-bottom: 0.9rem; border-bottom: 1px solid rgb(var(--v-theme-borderColor)); }.filter-panel__title { display: flex; flex: 1; min-width: 0; flex-direction: column; }.filter-panel__heading strong { font-size: 0.9rem; }.filter-panel__heading span { margin-top: 0.15rem; font-size: 0.7rem; opacity: 0.58; }.filter-panel--collapsed .filter-panel__heading { flex-direction: column; gap: 0.45rem; }.filter-panel--collapsed .filter-panel__title { display: none; }.filter-panel__body { display: flex; flex-direction: column; gap: 1rem; }.filter-group { display: flex; flex-direction: column; gap: 0.55rem; }.filter-group label { font-size: 0.75rem; font-weight: 700; }.filter-group small { font-size: 0.65rem; line-height: 1.6; opacity: 0.55; }.filter-panel :deep(.v-field) { border-radius: var(--design-input-radius, 10px); }.organization-flow { align-self: stretch; flex: 1; min-width: 0; min-height: 0; overflow: hidden; border: 1px solid rgb(var(--v-theme-borderColor)); border-radius: 18px; background: color-mix(in srgb, rgb(var(--v-theme-lightprimary)) 24%, rgb(var(--v-theme-background))); }.organization-flow :deep(.vue-flow__edge-path) { stroke: rgba(var(--v-theme-primary), 0.62) !important; }.organization-flow :deep(.vue-flow__edge.animated .vue-flow__edge-path) { stroke: rgb(var(--v-theme-success)) !important; stroke-width: 3 !important; }.organization-flow :deep(.vue-flow__minimap) { border: 1px solid rgb(var(--v-theme-borderColor)); border-radius: 12px; overflow: hidden; }
@media (max-width:900px){.level-strip{overflow-x:auto;white-space:nowrap}.organization-workspace{flex-direction:column}.filter-panel{width:100%;flex:0 0 auto}.filter-panel--collapsed{width:64px;align-self:flex-end}.filter-panel__body{display:grid;grid-template-columns:1.4fr 1fr}.filter-panel__body .v-divider{display:none}}
</style>

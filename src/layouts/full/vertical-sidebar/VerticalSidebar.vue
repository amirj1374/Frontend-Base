<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { IconChevronUp, IconClock, IconDatabase, IconPencil, IconPlus, IconTrash } from '@tabler/icons-vue';
import { getFilteredSidebarItems, type menu } from './sidebarItem';
import { useIsasChatStore } from '@/features/isas/stores/chat.store';
import { isasApi } from '@/features/isas/services/isasApi';
import type { ChatSession } from '@/features/isas/types/chat';

import LogoDark from '../logo/LogoDark.vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const customizer = useCustomizerStore();
const route = useRoute();
const router = useRouter();
const chatStore = useIsasChatStore();
const sessionToDelete = ref<ChatSession | null>(null);
const deletingSessionId = ref('');
const deleteError = ref('');
const sessionToRename = ref<ChatSession | null>(null);
const renamedSummary = ref('');
const renamingSessionId = ref('');
const renameError = ref('');
const { width: viewportWidth } = useDisplay();
const isMobileDrawer = computed(() => viewportWidth.value < 1280);
const mobileDrawerWidth = computed(() => Math.max(0, Math.min(viewportWidth.value - 16, 400)));

function closeMobileDrawer() {
  if (isMobileDrawer.value) customizer.SET_SIDEBAR_DRAWER(false);
}

// Menu is filtered by API access (token-derived). getFilteredSidebarItems reads
// the access store, so this recomputes once the token is processed.
const rawMenu = computed<menu[]>(() => getFilteredSidebarItems());

const canShowChat = computed(() => rawMenu.value.some((item) => item.to === '/isas'));
const dataToolItems = computed(() => rawMenu.value.filter((item) => item.to && item.to !== '/isas'));
const historySessions = computed(() => chatStore.sessions.slice(0, 12));

async function loadHistory() {
  try {
    chatStore.sessions = await isasApi.getSessions();
  } catch {
    chatStore.sessions = [];
  }
}

async function startNewChat() {
  chatStore.reset();
  await router.push('/isas');
  closeMobileDrawer();
}

async function openSession(sessionId: string) {
  chatStore.currentSessionId = sessionId;
  try { chatStore.setMessages(await isasApi.getSessionMessages(sessionId)); }
  catch { chatStore.setMessages([]); }
  await router.push({ path: '/isas', query: { session: sessionId } });
  closeMobileDrawer();
}

function requestSessionDelete(session: ChatSession) {
  sessionToDelete.value = session;
  deleteError.value = '';
}

async function confirmSessionDelete() {
  const session = sessionToDelete.value;
  if (!session) return;
  const sessionId = session.sessionId || session.id;
  deletingSessionId.value = sessionId;
  deleteError.value = '';

  try {
    await isasApi.deleteSession(sessionId);
    chatStore.removeSession(sessionId);
    sessionToDelete.value = null;
    if (chatStore.currentSessionId === sessionId || route.query.session === sessionId) await startNewChat();
  } catch {
    deleteError.value = 'حذف گفتگو انجام نشد. دوباره تلاش کنید.';
  } finally {
    deletingSessionId.value = '';
  }
}

function requestSessionRename(session: ChatSession) {
  sessionToRename.value = session;
  renamedSummary.value = session.summary;
  renameError.value = '';
}

async function confirmSessionRename() {
  const session = sessionToRename.value;
  const summary = renamedSummary.value.trim();
  if (!session || !summary) return;
  const sessionId = session.sessionId || session.id;
  renamingSessionId.value = sessionId;
  renameError.value = '';

  try {
    chatStore.renameSession(sessionId, summary);
    sessionToRename.value = null;
  } catch {
    renameError.value = 'تغییر نام گفتگو انجام نشد.';
  } finally {
    renamingSessionId.value = '';
  }
}

function historyDate(value?: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' }).format(new Date(value));
}

function toolDescription(path?: string) {
  return path === '/isas/data-catalog'
    ? 'بررسی مدل داده و روابط جداول'
    : path === '/isas/organization-model'
      ? 'مشاهده مدیران و ماژول‌ها'
      : 'ورود به ابزار تخصصی داده';
}

onMounted(() => void loadHistory());
</script>

<template>
  <v-navigation-drawer
    :location="customizer.direction === 'rtl' ? 'right' : 'left'"
    :model-value="customizer.Sidebar_drawer"
    @update:model-value="customizer.SET_SIDEBAR_DRAWER"
    elevation="0" rail-width="78" mobile-breakpoint="lg" app
    :width="isMobileDrawer ? mobileDrawerWidth : undefined"
    :temporary="isMobileDrawer"
    :rail="!isMobileDrawer && customizer.mini_sidebar"
    :class="['rightSidebar', { 'sidebar-closed': !customizer.Sidebar_drawer }]"
  >
    <div class="sidebar-logo pa-5"><LogoDark /></div>
    <PerfectScrollbar class="sidebar-menu-scroll" :options="{ suppressScrollX: true, wheelPropagation: false }">
      <v-list class="pa-4 isas-sidebar-list">
        <v-list-item
          v-if="canShowChat"
          :prepend-icon="IconPlus"
          title="گفتگوی جدید"
          rounded="lg"
          color="primary"
          class="new-chat-item"
          :active="route.path === '/isas' && !route.query.session"
          @click="startNewChat"
        />

        <template v-if="canShowChat && historySessions.length">
          <v-list-subheader class="history-heading">گفتگوهای اخیر</v-list-subheader>
          <v-list-item
            v-for="session in historySessions"
            :key="session.sessionId || session.id"
            :prepend-icon="IconClock"
            :title="session.summary"
            :subtitle="historyDate(session.updatedAt)"
            rounded="lg"
            class="history-item"
            :active="route.query.session === (session.sessionId || session.id)"
            @click="openSession(session.sessionId || session.id)"
          >
            <template #append>
              <v-btn
                :icon="IconPencil"
                :loading="renamingSessionId === (session.sessionId || session.id)"
                size="x-small"
                variant="text"
                color="primary"
                aria-label="تغییر نام گفتگو"
                class="history-action-btn"
                @click.stop="requestSessionRename(session)"
              />
              <v-btn
                :icon="IconTrash"
                :loading="deletingSessionId === (session.sessionId || session.id)"
                size="x-small"
                variant="text"
                color="error"
                aria-label="حذف گفتگو"
                class="history-action-btn"
                @click.stop="requestSessionDelete(session)"
              />
            </template>
          </v-list-item>
        </template>

      </v-list>
    </PerfectScrollbar>
    <div v-if="customizer.Sidebar_drawer" class="sidebar-tools">
      <v-menu v-if="dataToolItems.length" location="top" :close-on-content-click="true" offset="10">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            :prepend-icon="IconDatabase"
            :append-icon="customizer.mini_sidebar && !isMobileDrawer ? undefined : IconChevronUp"
            color="secondary"
            variant="tonal"
            class="tools-launcher"
            :icon="customizer.mini_sidebar && !isMobileDrawer ? IconDatabase : undefined"
            :aria-label="customizer.mini_sidebar && !isMobileDrawer ? 'ابزار داده' : undefined"
            block
          >
            <span v-if="!customizer.mini_sidebar || isMobileDrawer">ابزار داده</span>
            <v-chip v-if="!customizer.mini_sidebar || isMobileDrawer" size="x-small" color="secondary">{{ dataToolItems.length }}</v-chip>
          </v-btn>
        </template>
        <v-card class="tools-popover" rounded="lg" elevation="10">
          <div class="tools-popover__heading">
            <v-avatar color="lightsecondary" size="38"><IconDatabase :size="20" /></v-avatar>
            <div><strong>ابزار داده</strong><span>دسترسی سریع به ابزارهای تخصصی</span></div>
          </div>
          <v-list class="pa-2">
            <v-list-item
              v-for="item in dataToolItems"
              :key="item.to"
              :to="item.to"
              :title="item.title"
              :subtitle="toolDescription(item.to)"
              :prepend-icon="item.icon as any"
              rounded="lg"
              color="secondary"
              class="tools-popover__item"
              @click="closeMobileDrawer"
            />
          </v-list>
        </v-card>
      </v-menu>
      <v-chip v-if="!customizer.mini_sidebar || isMobileDrawer" color="inputBorder" size="x-small" class="sidebar-version">نسخه 1.0.0</v-chip>
    </div>

    <v-dialog :model-value="Boolean(sessionToDelete)" max-width="420" @update:model-value="!$event && (sessionToDelete = null)">
      <v-card rounded="lg">
        <v-card-title>حذف گفتگو</v-card-title>
        <v-card-text>
          آیا از حذف «{{ sessionToDelete?.summary }}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.
          <v-alert v-if="deleteError" type="error" variant="tonal" density="compact" class="mt-4">{{ deleteError }}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="Boolean(deletingSessionId)" @click="sessionToDelete = null">انصراف</v-btn>
          <v-btn color="error" variant="flat" :loading="Boolean(deletingSessionId)" @click="confirmSessionDelete">حذف گفتگو</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog :model-value="Boolean(sessionToRename)" max-width="420" @update:model-value="!$event && (sessionToRename = null)">
      <v-card rounded="lg">
        <v-card-title>تغییر نام گفتگو</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="renamedSummary"
            label="نام گفتگو"
            maxlength="100"
            counter
            autofocus
            :error-messages="renameError"
            @keyup.enter="confirmSessionRename"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="Boolean(renamingSessionId)" @click="sessionToRename = null">انصراف</v-btn>
          <v-btn color="primary" variant="flat" :loading="Boolean(renamingSessionId)" :disabled="!renamedSummary.trim()" @click="confirmSessionRename">ذخیره</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>
<style>
.rightSidebar .v-navigation-drawer__content { display: flex; flex-direction: column; overflow: hidden; }
.sidebar-logo { flex: 0 0 auto; text-align: end; overflow: hidden; }
.sidebar-logo .logo, .sidebar-logo .logo > a { display: block; width: 133px; }
[dir='ltr'] .sidebar-logo { text-align: start; }
/* The supplied wordmark puts the symbol at its visual end. In rail mode crop
   toward that symbol, so the compact drawer never exposes only the text. */
.rightSidebar.v-navigation-drawer--rail .sidebar-logo { padding-inline: 19px !important; }
.rightSidebar.v-navigation-drawer--rail .sidebar-logo .logo { width: 40px; overflow: hidden; }
.rightSidebar.v-navigation-drawer--rail .sidebar-logo .logo > a { width: 133px; display: block; }
[dir='ltr'] .rightSidebar.v-navigation-drawer--rail .sidebar-logo .logo > a { transform: translateX(-93px); }
.sidebar-menu-scroll { flex: 1 1 auto; min-height: 0; overflow-x: hidden !important; scrollbar-width: none; -ms-overflow-style: none; }
.sidebar-menu-scroll::-webkit-scrollbar { width: 0; height: 0; }
.sidebar-menu-scroll .ps__rail-x,
.sidebar-menu-scroll .ps__rail-y { display: none !important; }
.sidebar-menu-scroll .v-list { max-width: 100%; min-width: 0; overflow-x: hidden; }
.sidebar-tools { flex: 0 0 auto; display: grid; gap: 0.65rem; padding: 0.8rem 1rem 1rem; border-top: 1px solid rgba(var(--v-theme-borderLight), 0.5); background: rgb(var(--v-theme-surface)); }
.tools-launcher { min-height: 46px; justify-content: flex-start; }
.tools-launcher .v-btn__content { flex: 1; justify-content: space-between; }
.sidebar-version { justify-self: center; opacity: 0.72; }
.tools-popover { width: min(330px, calc(100vw - 24px)); border: 1px solid rgba(var(--v-theme-borderLight), 0.7); }
.tools-popover__heading { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1rem 0.75rem; }
.tools-popover__heading > div { display: flex; flex-direction: column; }
.tools-popover__heading strong { font-size: 0.9rem; }
.tools-popover__heading span { margin-top: 0.15rem; color: rgb(var(--v-theme-lightText)); font-size: 0.68rem; }
.tools-popover__item { min-height: 62px; margin-bottom: 0.25rem; border: 1px solid transparent; }
.tools-popover__item:hover { border-color: rgba(var(--v-theme-secondary), 0.18); background: rgba(var(--v-theme-secondary), 0.07); }
.tools-popover__item .v-list-item-title { font-size: 0.8rem; font-weight: 700; }
.tools-popover__item .v-list-item-subtitle { margin-top: 0.18rem; font-size: 0.68rem; }
.new-chat-item { margin-bottom: 0.65rem; border: 1px solid rgba(var(--v-theme-primary), 0.22); background: rgba(var(--v-theme-primary), 0.08); }
.history-heading, .catalog-heading { min-height: 32px; padding-inline: 12px !important; font-size: 0.68rem; font-weight: 700; opacity: 0.62; }
.history-item { min-height: 48px; margin-bottom: 2px; }
.history-item .v-list-item-title { overflow: hidden; font-size: 0.78rem; text-overflow: ellipsis; white-space: nowrap; }
.history-item .v-list-item-subtitle { margin-top: 2px; font-size: 0.65rem; opacity: 0.58; }
.history-item .v-list-item__prepend { opacity: 0.62; }
.history-action-btn { opacity: 0; transition: opacity 0.18s ease; }
.history-item:hover .history-action-btn, .history-action-btn:focus-visible { opacity: 1; }
.rightSidebar.v-navigation-drawer--rail .history-action-btn { display: none; }
@media (hover: none) { .history-action-btn { opacity: 1; } }
/* Completely hide text when sidebar is closed */
.rightSidebar.sidebar-closed .v-list-item-title,
.rightSidebar.sidebar-closed .v-list-item-subtitle,
.rightSidebar.sidebar-closed .v-list-subheader {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Also hide when in rail mode */
.rightSidebar.v-navigation-drawer--rail .v-list-item-title,
.rightSidebar.v-navigation-drawer--rail .v-list-item-subtitle,
.rightSidebar.v-navigation-drawer--rail .v-list-subheader {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Rail mode keeps the navigation target centered in the 78px drawer. Vuetify's
   normal prepend/content spacing is useful when expanded, but offsets icons when
   labels are intentionally hidden. */
.rightSidebar.v-navigation-drawer--rail .v-list-item {
  position: relative;
  padding-inline: 0 !important;
}

.rightSidebar.v-navigation-drawer--rail .v-list-item__prepend {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  top: 50%;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin: 0 !important;
  transform: translateY(-50%);
}

.rightSidebar.v-navigation-drawer--rail .v-list-item__prepend > .v-icon,
.rightSidebar.v-navigation-drawer--rail .v-list-item__prepend > svg {
  margin: 0 !important;
  /* Vuetify anchors the zero-width prepend slot to the RTL edge in rail mode. */
  transform: translateX(-23px) !important;
}

[dir='ltr'] .rightSidebar.v-navigation-drawer--rail .v-list-item__prepend > .v-icon,
[dir='ltr'] .rightSidebar.v-navigation-drawer--rail .v-list-item__prepend > svg {
  transform: translateX(23px) !important;
}

.rightSidebar.v-navigation-drawer--rail .v-list-item__content {
  display: none !important;
}
</style>

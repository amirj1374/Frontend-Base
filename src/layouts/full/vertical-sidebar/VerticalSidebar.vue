<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { IconClock, IconPlus } from '@tabler/icons-vue';
import { getFilteredSidebarItems, type menu } from './sidebarItem';
import { useIsasChatStore } from '@/features/isas/stores/chat.store';
import { isasApi } from '@/features/isas/services/isasApi';
import { mockChatSessions, mockSessionMessages } from '@/features/isas/mocks/chatHistory';

import LogoDark from '../logo/LogoDark.vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const customizer = useCustomizerStore();
const route = useRoute();
const router = useRouter();
const chatStore = useIsasChatStore();
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
    const sessions = await isasApi.getSessions();
    chatStore.sessions = sessions.length ? sessions : mockChatSessions;
  } catch {
    chatStore.sessions = mockChatSessions;
  }
}

async function startNewChat() {
  chatStore.reset();
  await router.push('/isas');
  closeMobileDrawer();
}

async function openSession(sessionId: string) {
  chatStore.currentSessionId = sessionId;
  const preview = mockSessionMessages[sessionId];
  if (preview) chatStore.setMessages(structuredClone(preview));
  else {
    try { chatStore.setMessages(await isasApi.getSessionMessages(sessionId)); }
    catch { chatStore.setMessages([]); }
  }
  await router.push({ path: '/isas', query: { session: sessionId } });
  closeMobileDrawer();
}

function historyDate(value?: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' }).format(new Date(value));
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
          />
        </template>

        <template v-if="dataToolItems.length">
          <v-divider class="catalog-divider" />
          <v-list-subheader class="catalog-heading">ابزار داده</v-list-subheader>
          <v-list-item
            v-for="item in dataToolItems"
            :key="item.to"
            :to="item.to"
            :title="item.title"
            :prepend-icon="item.icon as any"
            rounded="lg"
            color="secondary"
            class="catalog-item"
            @click="closeMobileDrawer"
          />
        </template>
      </v-list>
    </PerfectScrollbar>
    <div v-if="customizer.Sidebar_drawer" class="sidebar-footer pa-4 text-center"><v-chip color="inputBorder" size="small">1.0.0</v-chip></div>
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
.sidebar-footer { flex: 0 0 auto; }
.new-chat-item { margin-bottom: 0.65rem; border: 1px solid rgba(var(--v-theme-primary), 0.22); background: rgba(var(--v-theme-primary), 0.08); }
.history-heading, .catalog-heading { min-height: 32px; padding-inline: 12px !important; font-size: 0.68rem; font-weight: 700; opacity: 0.62; }
.history-item { min-height: 48px; margin-bottom: 2px; }
.history-item .v-list-item-title { overflow: hidden; font-size: 0.78rem; text-overflow: ellipsis; white-space: nowrap; }
.history-item .v-list-item-subtitle { margin-top: 2px; font-size: 0.65rem; opacity: 0.58; }
.history-item .v-list-item__prepend { opacity: 0.62; }
.catalog-divider { margin: 0.9rem 0 0.45rem; }
.catalog-item { border: 1px solid rgba(var(--v-theme-secondary), 0.14); }
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

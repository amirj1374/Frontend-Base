<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { useCustomerInfoStore } from '@/stores/customerInfo';
import sidebarItems, { getFilteredSidebarItems, type menu } from './sidebarItem';

import LogoDark from '../logo/LogoDark.vue';
import { useRoute } from 'vue-router';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const customizer = useCustomizerStore();
const route = useRoute();
const customerInfo = useCustomerInfoStore();
const { width: viewportWidth } = useDisplay();
const isMobileDrawer = computed(() => viewportWidth.value < 1280);
const mobileDrawerWidth = computed(() => Math.max(0, Math.min(viewportWidth.value - 16, 400)));

function closeMobileDrawer() {
  if (isMobileDrawer.value) customizer.SET_SIDEBAR_DRAWER(false);
}

interface CustomMenuItem {
  title: string;
  to?: string;
  icon?: any;
  disabled?: boolean;
  items?: CustomMenuItem[];
  chipContent?: string;
  chipColor?: string;
}

function toMenuItems(items: menu[]): CustomMenuItem[] {
  return items.map((it) => ({
    title: it.title || '',
    to: it.to,
    icon: it.icon as unknown as any,
    disabled: it.disabled,
    items: it.children ? toMenuItems(it.children) : undefined,
    chipContent: it.chip,
    chipColor: it.chipColor || 'primary',
  }));
}

// Menu is filtered by API access (token-derived). getFilteredSidebarItems reads
// the access store, so this recomputes once the token is processed.
const rawMenu = computed<menu[]>(() => getFilteredSidebarItems());

const sidebarMenu = computed<CustomMenuItem[]>(() => toMenuItems(rawMenu.value));

function hasActiveChild(children: menu[]): boolean {
  return children.some((child) => {
    if (!child.to) return false;
    return route.path === child.to || route.path.startsWith(child.to + '/');
  });
}
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
    <PerfectScrollbar class="sidebar-menu-scroll">
      <v-list class="pa-4">
        <template v-for="item in rawMenu" :key="item.title">
          <v-list-group v-if="item.children" :value="item.title">
            <template #activator="{ props }"><v-list-item v-bind="props" :title="item.title" :prepend-icon="item.icon as any" /></template>
            <v-list-item v-for="child in item.children" :key="child.title" :to="child.to" :title="child.title" :prepend-icon="child.icon as any" @click="closeMobileDrawer" />
          </v-list-group>
          <v-list-item v-else :to="item.to" :title="item.title" :prepend-icon="item.icon as any" rounded="lg" color="secondary" class="mb-1" @click="closeMobileDrawer" />
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
.sidebar-menu-scroll { flex: 1 1 auto; min-height: 0; overflow-x: hidden !important; }
.sidebar-menu-scroll .ps__rail-x { display: none !important; }
.sidebar-menu-scroll .v-list { max-width: 100%; min-width: 0; overflow-x: hidden; }
.sidebar-footer { flex: 0 0 auto; }
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

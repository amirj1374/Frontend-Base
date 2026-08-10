<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { useCustomerInfoStore } from '@/stores/customerInfo';
import { getFilteredSidebarItems } from '../vertical-sidebar/sidebarItem';
import { AppHeader } from '@amirjalili1374/ui-kit';
// Icon Imports
import { IconBell, IconSettings } from '@tabler/icons-vue';

// dropdown imports
import NotificationDD from './NotificationDD.vue';
import ProfileDD from './ProfileDD.vue';

const customizer = useCustomizerStore();
const customerInfo = useCustomerInfoStore();
const showSearch = ref(false);

function searchbox() {
  showSearch.value = !showSearch.value;
}

// Use filtered menu items based on user permissions
// Only show menu items in header when menu orientation is horizontal
const headerMenu = computed(() => {
  // Only show menu items in header when orientation is horizontal
  if (customizer.menuOrientation !== 'horizontal') {
    return [];
  }
  // Use the same token-derived filter as the sidebar. Returning the raw menu
  // during profile loading exposed protected entries only in horizontal mode.
  return getFilteredSidebarItems();
});
</script>

<template>
  <AppHeader
    :menuOrientation="customizer.menuOrientation"
    :miniSidebar="customizer.mini_sidebar"
    :userInfoLoaded="customerInfo.isUserInfoLoaded"
    :sidebarDrawer="customizer.Customizer_drawer"
    :headerMenu="headerMenu"
    :onToggleMiniSidebar="() => customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
    :onToggleCustomizer="() => customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
    :onToggleSidebarDrawer="() => customizer.SET_SIDEBAR_DRAWER()"
  >
    <template #notifications>
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn icon class="text-secondary mx-3" color="lightsecondary" rounded="sm" size="small" variant="flat" v-bind="props">
            <IconBell stroke-width="1.5" size="22" />
          </v-btn>
        </template>
        <v-sheet rounded="md" width="330" elevation="12">
          <NotificationDD />
        </v-sheet>
      </v-menu>
    </template>

    <template #profile>
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn class="profileBtn text-primary" color="lightprimary" variant="flat" rounded="pill" v-bind="props">
            <IconSettings stroke-width="2" />
          </v-btn>
        </template>
        <v-sheet rounded="md" width="330" elevation="12">
          <ProfileDD />
        </v-sheet>
      </v-menu>
    </template>
  </AppHeader>
</template>

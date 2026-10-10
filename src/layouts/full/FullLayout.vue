<script setup lang="ts">
import { RouterView } from 'vue-router';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import Customizer from './customizer/CustomizerPanel.vue';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { Loading } from '@amirjalili1374/ui-kit';

const customizer = useCustomizerStore();

</script>

<template>
  <v-locale-provider :rtl="customizer.direction === 'rtl'">
    <v-app
      :theme="customizer.actTheme"
      :class="[customizer.fontTheme, `surface-${customizer.surfaceStyle}`, customizer.mini_sidebar ? 'mini-sidebar' : '', customizer.inputBg ? 'inputWithbg' : '', customizer.compactHeader ? 'compact-header' : '']"
    >
      <Customizer />
      <!-- Show sidebar when menu orientation is vertical -->
      <VerticalSidebarVue v-if="customizer.menuOrientation === 'vertical'" />
      <VerticalHeaderVue />
      <v-main>
        <Loading />
        <v-container fluid class="page-wrapper">
          <div>
            <RouterView />
            <!-- <v-btn
              class="customizer-btn"
              size="small"
              variant="flat"
              color="secondary"
              @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
            >
              <IconSettings/>
            </v-btn> -->
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
<style lang="scss">
// Ensure sidebar and main content are positioned correctly below fixed header
.v-navigation-drawer.rightSidebar {
  /* SAMAP layout: the drawer owns the full right edge; only main content starts below the header. */
  top: 0 !important;
  height: 100vh !important;
}

.v-main {
  /* v-main owns the RTL page scrollbar. Keep its scroll rail below the fixed
     80px header instead of allowing it to run behind the app bar. */
  height: calc(100vh - var(--app-header-height, 80px));
  margin-top: var(--app-header-height, 80px);
  padding-top: 0 !important;
}

.v-application {
  --app-header-height: 80px;
}

.v-application.compact-header {
  --app-header-height: 56px;
}

@media (max-width: 600px) {
  .v-application {
    --app-header-height: 56px;
  }
}

.v-application.compact-header .app-header.topbar,
.v-application.compact-header .app-header.topbar.v-toolbar {
  height: var(--app-header-height) !important;
  min-height: var(--app-header-height) !important;
}

.v-application.compact-header .app-header.topbar {
  padding-block: 0 !important;
}

.v-application.compact-header .app-header.topbar .v-toolbar__content {
  height: var(--app-header-height) !important;
}
</style>

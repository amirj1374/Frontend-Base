<script setup lang="ts">
import { ref, computed } from 'vue';
import { IconSettings, IconLogout, IconUser } from '@tabler/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { useCustomerInfoStore } from '@/stores/customerInfo';
import { GreetingUtils } from '@amirjalili1374/ui-kit';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { useI18n } from 'vue-i18n';

const swt2 = ref(false);
const authStore = useAuthStore();
const customerInfoStore = useCustomerInfoStore();
const customizer = useCustomizerStore();
const { t } = useI18n();
const displayName = computed(() => authStore.claims?.name ?? '—');
const position = computed(() => authStore.claims?.position ?? '—');
// Get dynamic greeting based on server time
const greeting = computed(() => {
  return GreetingUtils.getGreeting(customerInfoStore.userInfo?.authTime);
});
function toggleLanguage() {
  const next = customizer.language === 'fa' ? 'en' : 'fa';
  customizer.SET_LANGUAGE(next);
}
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <h3 class="mb-2 text-secondary">
      {{ greeting }} , <span class="font-weight-regular">{{ displayName }}</span>
    </h3>
    <h3 class="text-subtitle-2 text-medium-emphasis">{{ position }}</h3>

    <v-text-field persistent-placeholder :placeholder="t('profile.search')" class="my-3" color="primary" variant="outlined" hide-details>
      <!--      <template v-slot:prepend-inner>-->
      <!--        <SearchIcon stroke-width="1.5" size="20" class="text-lightText SearchIcon" />-->
      <!--      </template>-->
    </v-text-field>

    <v-divider></v-divider>
    <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 515px">
      <div class="bg-lightprimary rounded-md px-5 py-3 my-3">
        <div class="d-flex align-center justify-space-between">
          <h5 class="text-h5">{{ t('profile.notifications') }}</h5>
          <div>
            <v-switch v-model="swt2" color="primary" hide-details></v-switch>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-list class="mt-3">
        <v-list-item color="secondary" rounded="md">
          <template v-slot:prepend>
            <IconSettings size="20" class="ml-2" />
          </template>

          <v-list-item-title class="text-subtitle-2">{{ t('profile.settings') }}</v-list-item-title>
        </v-list-item>

        <v-list-item color="secondary" rounded="md">
          <template v-slot:prepend>
            <IconUser size="20" class="ml-2" />
          </template>

          <v-list-item-title class="text-subtitle-2">{{ t('profile.account') }}</v-list-item-title>

          <template v-slot:append>
            <v-chip color="warning" class="text-white" text="02" variant="flat" size="small" />
          </template>
        </v-list-item>

        <v-list-item color="secondary" rounded="md" @click="toggleLanguage">
          <template #prepend><span class="text-subtitle-2 font-weight-bold mx-1">A/آ</span></template>
          <v-list-item-title class="text-subtitle-2">{{ t('profile.switchLanguage') }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="authStore.logout()" color="secondary" rounded="md">
          <template v-slot:prepend>
            <IconLogout size="20" class="ml-2" />
          </template>

          <v-list-item-title class="text-subtitle-2">{{ t('profile.logout') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
</template>

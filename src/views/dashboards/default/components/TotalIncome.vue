<script setup lang="ts">
import { computed } from 'vue';
import { IconBuildingStore, IconTableShare } from '@tabler/icons-vue';

import { useAuthStore } from '@/stores/auth';
import { useBaseStore } from '@/stores/base';
import { useI18n } from 'vue-i18n';

// 🟢 store
const authStore = useAuthStore();
const baseStore = useBaseStore();
const { t } = useI18n();

const displayName = computed(() => authStore.claims?.name ?? '—');
const position = computed(() => authStore.claims?.position ?? '—');
const branchCode = computed(() => authStore.claims?.branchCode ?? '—');

const branchName = computed(() => {
  return branchCode.value ? baseStore.getBranchNameByCode(branchCode.value) : '—';
});
</script>

<template>
  <div class="total-income">
    <!-- Role / Position -->
    <v-card elevation="0" class="bubble-shape-sm overflow-hidden bubble-warning">
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-4">
          <v-btn color="lightsecondary" icon rounded="sm" variant="flat" class="ti-btn-secondary">
            <IconBuildingStore stroke-width="1.5" width="25" class="ti-icon" />
          </v-btn>

          <div>
            <!-- اگر "نقش" منظور business role است از translatedRoles استفاده کن
                 اگر "سمت" منظورته از position -->
            <h3 class="text-h3 font-weight-medium">
              {{ position }}
              <!-- یا: {{ translatedRoles }} -->
            </h3>
            <span class="text-subtitle-1 text-disabled font-weight-medium">{{ t('dashboard.role') }}</span>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Full Name (از auth) -->
    <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape-sm bubble-primary">
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-4">
          <v-btn color="darkprimary" icon rounded="sm" variant="flat" class="ti-btn-primary">
            <IconTableShare stroke-width="1.5" width="25" class="ti-icon" />
          </v-btn>

          <div>
            <h3 class="text-h3">
              {{ displayName }}
            </h3>
            <span class="text-subtitle-1 text-medium-emphasis text-white">{{ t('dashboard.fullName') }}</span>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Branch (کد از auth، نام از customerInfo) -->
    <v-card elevation="0" class="bubble-shape-sm overflow-hidden bubble-warning">
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-4">
          <v-btn color="lightsecondary" icon rounded="sm" variant="flat" class="ti-btn-secondary">
            <IconBuildingStore stroke-width="1.5" width="25" class="ti-icon" />
          </v-btn>

          <div>
            <h3 class="text-h3 font-weight-medium">{{ branchCode }} - {{ branchName }}</h3>
            <span class="text-subtitle-1 text-disabled font-weight-medium">{{ t('dashboard.branch') }}</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.total-income {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.total-income > .v-card {
  min-width: 0;
  border-radius: 12px !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08) !important;
}


@media (max-width: 960px) {
  .total-income {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .total-income {
    grid-template-columns: 1fr;
  }
}

.ti-icon {
  color: rgb(var(--v-theme-secondary));
}

.ti-btn-primary .ti-icon {
  color: rgb(var(--v-theme-on-primary));
}
.ti-btn-primary:hover {
  background-color: rgb(var(--v-theme-primary));
}
.ti-btn-primary:hover .ti-icon {
  color: rgb(var(--v-theme-on-primary));
}

.ti-btn-secondary .ti-icon {
  color: rgb(var(--v-theme-secondary));
}
.ti-btn-secondary:hover {
  background-color: rgb(var(--v-theme-secondary));
}
.ti-btn-secondary:hover .ti-icon {
  color: rgb(var(--v-theme-on-secondary));
}
</style>

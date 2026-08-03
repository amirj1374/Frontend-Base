<template>
  <div class="lookup-field">
    <v-text-field
      :model-value="displayValue"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :density="density"
      :variant="variant"
      :clearable="clearable"
      readonly
      @click="openDrawer"
      @click:clear="clearSelection"
      :append-inner-icon="icons.magnify"
      icon-color="primary"
    />

    <v-navigation-drawer v-model="drawer" location="right" temporary :width="drawerWidth" absolute rail-width="50">
      <div class="drawer-layout">
        <div class="drawer-sidebar">
          <v-btn icon variant="tonal" @click="closeDrawer" color="secondary" class="close-btn">
            <v-icon :icon="icons.arrowRight" color="secondary" size="large" />
          </v-btn>
        </div>

        <div class="drawer-main">
          <div>
            <CustomDataTable
              :title="props.title"
              ref="dataTableRef"
              :headers="props.header"
              :api-resource="props.apiUrl"
              :auto-fetch="false"
              :show-pagination="true"
              :height="360"
              :axiosInstance="localAxiosInstance"
              inlineFilter
              :uniqueKey="props.uniqueKey"
              selectable
              @selection-change="onSelectionChange"
            >
              <template #inline-filter-actions="{ resetFilter, hasActiveFilters }">
                <div class="d-flex ga-2">
                  <v-btn color="primary" variant="flat" @click="applyFilter">جستجو</v-btn>
                  <v-btn :disabled="pendingSelection.length === 0" color="success" variant="flat" @click="confirmSelection">انتخاب</v-btn>
                  <v-btn v-if="hasActiveFilters" color="error" variant="text" @click="resetFilter">پاک کردن</v-btn>
                </div>
              </template>
            </CustomDataTable>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { icons } from '@/plugins/mdi-icon';
import { CustomDataTable } from '@amirjalili1374/ui-kit';
import axiosInstance from '@/services/axiosInstance';

const localAxiosInstance = axiosInstance;

interface HeaderItem {
  key: string;
  searchable?: boolean;
}

interface Props {
  modelValue?: any;
  label?: string;
  title?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  density?: 'comfortable';
  variant?: 'outlined';
  valueField?: string;
  apiUrl: string;
  header: HeaderItem[];
  displayField?: string;
  uniqueKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  apiUrl: '',
  disabled: false,
  clearable: true,
  density: 'comfortable',
  variant: 'outlined',
  displayField: 'title',
  title: '',
  valueField: '',
  uniqueKey: 'id'
});

const emit = defineEmits<{
  'update:modelValue': [value: any];
  change: [value: any];
}>();

const drawer = ref(false);
const { width: viewportWidth } = useDisplay();
const drawerWidth = computed(() => Math.min(viewportWidth.value, 1450));
const dataTableRef = ref();
const selectedValue = ref(props.modelValue);
const pendingSelection = ref<any[]>([]);

const displayValue = computed(() => {
  if (!props.modelValue) return '';
  return props.modelValue[props.displayField] ?? '';
});

const openDrawer = () => {
  if (props.disabled) return;
  pendingSelection.value = [];
  drawer.value = true;
};

const closeDrawer = () => {
  drawer.value = false;
};

function buildCriteria(filters: Record<string, any>) {
  const criteria: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      criteria[`${key}.equals`] = value;
    }
  });

  return criteria;
}

const confirmSelection = () => {
  const item = pendingSelection.value?.[0] ?? null;
  selectedValue.value = item;
  emit('update:modelValue', item);
  emit('change', item);
  closeDrawer();
};

const clearSelection = () => {
  selectedValue.value = null;
  pendingSelection.value = [];
  emit('update:modelValue', null);
  emit('change', null);
};

const onSelectionChange = (items: any[]) => {
  pendingSelection.value = items;
};

const applyFilter = async () => {
  const filters = dataTableRef.value?.getFilters?.() || {};
  const criteria = buildCriteria(filters);
  dataTableRef.value?.setCriteria?.(criteria);
  await dataTableRef.value?.fetchData?.();
};

watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val;
  },
  { immediate: true }
);

defineExpose({ openDrawer, closeDrawer });
</script>

<style scoped>
.lookup-field {
  width: 100%;
}

.v-navigation-drawer--temporary {
  right: 0 !important;
  height: 100% !important;
  top: 0 !important;
  transition: transform 0.4s ease-in-out !important;
}

.drawer-layout {
  display: flex;
  height: 100%;
  flex-direction: row-reverse;
}

.drawer-sidebar {
  width: 3%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
}

.drawer-main {
  width: 100%;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

@media (max-width: 600px) {
  .drawer-main {
    padding: 12px;
  }

  .drawer-sidebar {
    min-width: 44px;
  }
}

.close-btn {
  margin: auto;
}

:deep(.data-table-container) {
  height: 20% !important;
}
</style>

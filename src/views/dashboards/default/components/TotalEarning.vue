<script setup lang="ts">
import { shallowRef } from 'vue';
import { IconArchive, IconCopy, IconDownload, IconFileExport } from '@tabler/icons-vue';

const items = shallowRef([
  { title: 'Import Card', icon: IconDownload },
  { title: 'Copy Data', icon: IconCopy },
  { title: 'Export', icon: IconFileExport },
  { title: 'Archive', icon: IconArchive }
]);
</script>

<template>
  <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-6">
        <div class="ml-auto z-1">
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn icon rounded="sm" color="secondary" variant="flat" size="small" v-bind="props">
              </v-btn>
            </template>
            <v-sheet rounded="md" width="150" class="elevation-10">
              <v-list density="compact">
                <v-list-item v-for="(item, index) in items" :key="index" :value="index">
                  <template v-slot:prepend>
                    <component :is="item.icon" stroke-width="1.5" size="20" />
                  </template>
                  <v-list-item-title class="ml-2">{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-menu>
        </div>
      </div>
      <h2 class="text-h1 font-weight-medium">
         54,546,444 <a href="#"></a>
      </h2>
      <span class="text-subtitle-1 text-medium-emphasis text-white">رسوب کل </span>
    </v-card-text>
  </v-card>
</template>

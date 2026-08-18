<script setup lang="ts">
import { useIsasErdStore } from '../../stores/erd.store';

const store = useIsasErdStore();
</script>

<template>
  <v-dialog v-model="store.catalogOpen" max-width="1050" scrollable>
    <v-card v-if="store.catalogInfo">
      <v-card-title class="d-flex align-center justify-space-between">
        <span>{{ store.catalogInfo.catalogLabel || store.catalogInfo.label }}</span>
        <v-btn icon="mdi-close" variant="text" @click="store.catalogOpen = false" />
      </v-card-title>
      <v-card-subtitle v-if="store.catalogInfo.schemaLabel">{{ store.catalogInfo.schemaLabel }}</v-card-subtitle>
      <v-card-text>
        <p v-if="store.catalogInfo.description" class="mb-5">{{ store.catalogInfo.description }}</p>
        <v-table density="compact" hover fixed-header height="460">
          <thead>
            <tr>
              <th>نام ستون</th><th>نوع</th><th>نام بیزینسی</th><th>کاربرد</th><th>توضیحات</th><th>روش تولید</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="column in store.catalogInfo.columns" :key="column.name">
              <td><code>{{ column.name }}</code></td>
              <td><v-chip size="x-small" color="primary" variant="tonal">{{ column.type }}</v-chip></td>
              <td>{{ column.label || '—' }}</td>
              <td>{{ column.usage || '—' }}</td>
              <td>{{ column.description || '—' }}</td>
              <td>{{ column.source || '—' }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

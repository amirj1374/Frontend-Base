<template>
  <v-locale-provider :rtl="customizer.direction === 'rtl'">
    <v-app>
      <v-row no-gutters class="h-screen">
        <v-col class="d-flex align-center justify-center">
      <div class="text-center">
        <div class="CardMediaWrapper">
          <img src="@/assets/images/maintenance/img-error-bg.svg" alt="grid" class="w-100" />
          <img src="@/assets/images/maintenance/img-error-blue.svg" alt="grid" class="CardMediaParts" />
          <img src="@/assets/images/maintenance/img-error-purple.svg" alt="build" class="CardMediaBuild" />
          <div class="AuthErrorIcon">
            <IconAlertCircle size="120" color="#f44336"/>
          </div>
        </div>
        <h1 class="text-h1 mb-4">{{ t('errors.auth') }}</h1>
        <p class="text-h6 mb-4 text-medium-emphasis">
          {{ t('errors.authUnavailable') }}
        </p>
        <p class="text-body-2 mb-6 text-medium-emphasis">
          {{ t('errors.authHelp') }}
        </p>
        <v-btn 
          variant="flat" 
          color="primary" 
          size="large"
          @click="handleRetry" 
          prepend-icon="$refresh"
          class="me-2"
        > 
          {{ t('errors.retry') }}
        </v-btn>
        <v-btn 
          variant="outlined" 
          color="primary" 
          size="large"
          @click="handleGoHome" 
          prepend-icon="$home"
        > 
          {{ t('errors.backHome') }}
        </v-btn>
        <div class="mt-6">
          <v-alert 
            type="error" 
            variant="tonal" 
            class="text-start"
            max-width="600"
            style="margin: 0 auto;"
          >
            <div class="text-caption font-weight-bold mb-1">{{ t('errors.details') }}</div>
            <div class="text-body-2">{{ errorMessage || t('errors.unknownAuth') }}</div>
          </v-alert>
        </div>
      </div>
    </v-col>
  </v-row>
    </v-app>
  </v-locale-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconAlertCircle } from '@tabler/icons-vue';
import { useI18n } from 'vue-i18n';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';

const { t } = useI18n();
const customizer = useCustomizerStore();

interface Props {
  error?: string | Error | unknown;
}

const props = withDefaults(defineProps<Props>(), {
  error: undefined
});

const errorMessage = computed(() => {
  console.log('🔍 Error401Page received error prop:', props.error);
  if (!props.error) {
    console.log('⚠️ No error prop provided');
    return '';
  }
  if (typeof props.error === 'string') {
    console.log('✅ Error is a string:', props.error);
    return props.error;
  }
  if (props.error instanceof Error) {
    console.log('✅ Error is an Error object:', props.error.message);
    return props.error.message;
  }
  const strError = String(props.error);
  console.log('✅ Error converted to string:', strError);
  return strError;
});

const handleRetry = () => {
  window.location.reload();
};

const handleGoHome = () => {
  window.location.href = '/';
};
</script>

<style lang="scss">
.CardMediaWrapper {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
}

.CardMediaBuild {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  animation: 5s bounce ease-in-out infinite;
}

.CardMediaParts {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  animation: 10s blink ease-in-out infinite;
}

.AuthErrorIcon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: 3s pulse ease-in-out infinite;
  z-index: 10;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

.text-medium-emphasis {
  opacity: 0.7;
}
</style>


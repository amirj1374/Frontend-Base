<template>
  <v-row no-gutters class="h-screen">
    <v-col class="d-flex align-center justify-center">
      <div class="text-center">
        <div class="CardMediaWrapper">
          <img src="@/assets/images/maintenance/img-error-bg.svg" alt="grid" class="w-100" />
          <img src="@/assets/images/maintenance/img-error-blue.svg" alt="grid" class="CardMediaParts" />
          <img src="@/assets/images/maintenance/img-error-purple.svg" alt="build" class="CardMediaBuild" />
          <div class="AccessDeniedIcon">
            <IconShieldCancel size="120" color="#f44336"/>
          </div>
        </div>
        <h1 class="text-h1 mb-4">403 - دسترسی غیرمجاز</h1>
        <p class="text-h6 mb-4 text-medium-emphasis">
          شما مجوز دسترسی به این صفحه را ندارید
        </p>
        <p class="text-body-2 mb-6 text-medium-emphasis">
          لطفاً با مدیر سیستم تماس بگیرید یا به صفحه اصلی برگردید
        </p>
        <v-btn 
          variant="flat" 
          color="primary" 
          size="large"
          @click="$router.push('/')" 
          prepend-icon="$home"
        > 
          بازگشت به صفحه اصلی
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { IconShieldCancel } from '@tabler/icons-vue';
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

.AccessDeniedIcon {
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
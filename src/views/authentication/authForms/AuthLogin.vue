<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
import { useCustomizerStore } from '@/stores/customizer';
import { useRouter } from 'vue-router';

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const password = ref('admin123');
const username = ref('info@codedthemes.com');
const router = useRouter();
const customizer = useCustomizerStore();
const passwordRules = ref([
  (v: string) => !!v || 'رمز عبور وارد نشده است',
  (v: string) => (v && v.length <= 10) || 'رمز عبور باید کمتر از 10 کاراکتر باشد'
]);
/* eslint-disable @typescript-eslint/no-explicit-any */

const emailRules = ref([(v: string) => !!v || 'نام کاربری را وارد نمایید', (v: string) => /.+@.+\..+/.test(v) || 'نام کاربری صحیح نمی باشد']);
function validate(values: any, { setErrors }: any) {
  router.push('/approval');
  // const authStore = useAuthStore();
  // return authStore.login(username.value, password.value).catch((error) => setErrors({ apiError: error }));
}
</script>

<template>
  <h5 class="text-h5 text-center my-4 mb-8"></h5>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <v-text-field
      v-model="username"
      :rules="emailRules"
      label="نام کاربری"
      class="mt-4 mb-8"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="رمز عبور"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
    ></v-text-field>
<!--    :append-icon="show1 ? '$eye' : '$eyeOff'"-->


    <div class="d-flex align-center justify-lg-space-between">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="ذخیره رمز عبور"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <div class="">
        <a href="javascript:void(0)" class="text-primary text-decoration-none">فراموشی رمز عبور</a>
      </div>
    </div>
    <v-btn color="secondary" :loading="isSubmitting" block class="mt-2" variant="flat" size="large" :disabled="valid" type="submit">
      وارد شوید</v-btn
    >
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
<!--  <div class="mt-5 text-right">-->
<!--    <v-divider />-->
<!--    <v-btn variant="plain" to="/auth/register" class="mt-2 text-capitalize ml-n2">Don't Have an account?</v-btn>-->
<!--  </div>-->
</template>
<style lang="scss" scoped>
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Google from '@/assets/images/auth/social-google.svg';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const checkbox = ref(false);
const show1 = ref(false);
const password = ref('');
const email = ref('');
const Regform = ref();
const firstname = ref('');
const lastname = ref('');
const passwordRules = computed(() => [(v: string) => !!v || t('register.passwordRequired'), (v: string) => (v && v.length <= 10) || t('register.passwordLength')]);
const emailRules = computed(() => [(v: string) => !!v || t('register.emailRequired'), (v: string) => /.+@.+\..+/.test(v) || t('register.emailInvalid')]);

function validate() {
  Regform.value.validate();
}
</script>

<template>
  <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn">
    <img :src="Google" alt="google" />
    <span class="ml-2">{{ t('register.google') }}</span></v-btn
  >
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-btn variant="outlined" class="orbtn" rounded="md" size="small">{{ t('register.or') }}</v-btn>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">{{ t('register.emailSignup') }}</h5>
  <v-form ref="Regform" lazy-validation action="/dashboards/analytical" class="mt-7 loginForm">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="firstname"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="primary"
          :label="t('register.firstName')"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="lastname"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="primary"
          :label="t('register.lastName')"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      :label="t('register.email')"
      class="mt-4 mb-4"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      :label="t('register.password')"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? '$eye' : '$eyeOff'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput"
    ></v-text-field>

    <div class="d-sm-inline-flex align-center mt-2 mb-7 mb-sm-0 font-weight-bold">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        :label="t('register.agree')"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <a href="#" class="ml-1 text-lightText">{{ t('register.terms') }}</a>
    </div>
    <v-btn color="secondary" block class="mt-2" variant="flat" size="large" @click="validate()">{{ t('register.submit') }}</v-btn>
  </v-form>
  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/auth/login" class="mt-2 text-capitalize ml-n2">{{ t('register.existing') }}</v-btn>
  </div>
</template>
<style lang="scss">
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
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(50%);
  }
}
.v-field__field {
  flex-direction: row-reverse !important;
}
</style>

<template>
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="onRegister"
    :title="$t('rns.register-domain')"
    content-size="xlarge"
    :close="close"
  >
    <mew-stepper :items="stepperItems" :on-step="onStep">
      <template #stepperContent1
        ><request
          v-if="onStep === 1"
          class="mt-3"
          :name="name"
          :loading="checkingDomainAvail"
          :get-rent-price="getRentPrice"
          @onRequest="onRequest"
      /></template>
      <template #stepperContent2>
        <register
          v-if="onStep === 2"
          class="mt-3"
          :name="name"
          :duration="duration"
          :register="register"
          :not-enough-funds="notEnoughFunds"
          :no-funds-for-reg-fees="noFundsForRegFees"
          :commit-fee-in-eth="commitFeeInEth"
          :commit-fee-in-wei="commitFeeInWei"
          :commit-fee-usd="commitFeeUsd"
          :waiting-for-reg="waitingForReg"
          :commit="commit"
          :committed="committed"
          :minimum-age="minimumAge"
          :loading-commit="loadingCommit"
          :loading-reg="loadingReg"
      /></template>
      <template #stepperContent3><complete v-if="onStep === 3" /></template>
    </mew-stepper>
  </mew-overlay>
</template>

<script setup>
import { defineAsyncComponent, ref, watch, onMounted } from 'vue';

import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { useRouter } from 'vue-router/composables';

const Request = defineAsyncComponent(() =>
  import('../components/register/RegisterRequest')
);
const Register = defineAsyncComponent(() =>
  import('../components/register/Register')
);

// injections/use
const router = useRouter();

// props
defineProps({
  getRentPrice: {
    default: function () {
      return {};
    },
    type: Function
  },
  commit: {
    default: function () {
      return {};
    },
    type: Function
  },
  onRegister: { default: false, type: Boolean },
  close: {
    default: function () {
      return {};
    },
    type: Function
  },
  register: {
    default: function () {
      return {};
    },
    type: Function
  },
  waitingForReg: {
    default: false,
    type: Boolean
  },
  notEnoughFunds: {
    default: false,
    type: Boolean
  },
  noFundsForRegFees: {
    default: false,
    type: Boolean
  },
  commitFeeInWei: {
    type: String,
    default: ''
  },
  commitFeeInEth: {
    type: String,
    default: ''
  },
  commitFeeUsd: {
    type: String,
    default: ''
  },
  loadingCommit: {
    default: false,
    type: Boolean
  },
  loadingReg: {
    default: false,
    type: Boolean
  },
  committed: {
    default: false,
    type: Boolean
  },
  minimumAge: {
    default: '',
    type: String
  },
  name: {
    default: '',
    type: String
  },
  checkingDomainAvail: {
    default: false,
    type: Boolean
  }
});

// data
const stepperItems = [
  {
    step: 1,
    name: 'STEP 1. Select Duration'
  },
  {
    step: 2,
    name: 'STEP 2. Create Commitment'
  },
  {
    step: 3,
    name: 'STEP 3. Complete registration'
  }
];
const duration = ref(1);
const onStep = ref(1);

// watch
watch(
  () => onStep,
  newStep => {
    if (newStep == 2) {
      router.push({ name: ROUTES_WALLET.ENS_2.NAME });
    } else if (newStep == 3) {
      router.push({ name: ROUTES_WALLET.ENS_3.NAME });
    } else {
      router.push({ name: ROUTES_WALLET.ENS_MANAGER.NAME });
    }
  }
);

onMounted(() => {
  if (onStep.value == 1) router.push({ name: ROUTES_WALLET.ENS_1.NAME });
});

// method
const onRequest = val => {
  duration.value = val;
  onStep.value += 1;
};
</script>

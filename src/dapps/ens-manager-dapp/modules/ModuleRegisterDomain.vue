<template>
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="onRegister"
    :title="t('ens.register-domain')"
    content-size="xlarge"
    :close="close"
  >
    <mew-stepper :items="stepperItems" :on-step="onStep">
      <template #stepperContent1
        ><request
          v-if="onStep === 1"
          class="mt-3"
          :name="name"
          :host-name="parsedHostName"
          :loading="checkingDomainAvail"
          :get-rent-price="getRentPrice"
          @onRequest="onRequest"
      /></template>
      <template #stepperContent2>
        <register-component
          v-if="onStep === 2"
          class="mt-3"
          :name="name"
          :duration="duration"
          :register="registerClick"
          :not-enough-funds="notEnoughFunds"
          :no-funds-for-reg-fees="noFundsForRegFees"
          :commit-fee-in-eth="commitFeeInEth"
          :commit-fee-in-wei="commitFeeInWei"
          :commit-fee-usd="commitFeeUsd"
          :total-cost="totalCost"
          :total-cost-usd="totalCostUsd"
          :waiting-for-reg="waitingForReg"
          :commit="commit"
          :committed="committed"
          :minimum-age="minimumAge"
          :loading-commit="loadingCommit"
          :loading-reg="loadingReg"
      /></template>
      <template #stepperContent3
        ><complete-registration v-if="onStep === 3" :close="close"
      /></template>
    </mew-stepper>
  </mew-overlay>
</template>

<script setup>
import {
  defineAsyncComponent,
  defineProps,
  ref,
  watch,
  onMounted,
  defineEmits
} from 'vue';

import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { useRouter } from 'vue-router/composables';
import { useI18n } from 'vue-i18n-composable';

const Request = defineAsyncComponent(() =>
  import('../components/register/RegisterRequest')
);
const RegisterComponent = defineAsyncComponent(() =>
  import('../components/register/RegisterComponent')
);
const CompleteRegistration = defineAsyncComponent(() =>
  import('../components/register/CompleteRegistration')
);

// emit
const emit = defineEmits(['getCommitFeeOnly']);

// injections/use
const router = useRouter();
const { t } = useI18n();

// props
const props = defineProps({
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
  generateKeyPhrase: {
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
  totalCost: {
    type: String,
    default: ''
  },
  totalCostUsd: {
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
  parsedHostName: {
    default: '',
    type: String
  },
  checkingDomainAvail: {
    default: false,
    type: Boolean
  }
});

// data
const stepperItems = ref([
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
]);
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

// mounted
onMounted(() => {
  if (onStep.value == 1) router.push({ name: ROUTES_WALLET.ENS_1.NAME });
});

// methods
const onRequest = val => {
  duration.value = val;
  props.generateKeyPhrase();
  emit('getCommitFeeOnly');
  onStep.value += 1;
};
const registerClick = duration => {
  props.register(duration).on('receipt', () => {
    onStep.value += 1;
  });
};
</script>

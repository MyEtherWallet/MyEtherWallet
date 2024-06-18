<template>
  <div class="pa-3">
    <!--
    ===================================================
    Staked MEW Stepper
    ===================================================
    -->
    <mew-stepper :items="stepperItems" :on-step="onStep" @onContinue="nextStep">
      <!--
    ===================================================
    Step 1: Select Amount 
    ===================================================
    -->
      <template v-if="onStep === 1" #stepperContent1>
        <step-one-amount :current-apr="currentApr" @onContinue="nextStep" />
      </template>
      <!--
    ===================================================
    Step 2: Generate ETH2 Address
    ===================================================
    -->
      <template v-if="onStep === 2" #stepperContent2>
        <step-two-generate
          :skipped="skipped"
          @onContinue="nextStep"
          @back="back"
        />
      </template>
      <!--
    ===================================================
    Step 3: Review & Stake
    ===================================================
    -->
      <template v-if="onStep === 3" #stepperContent3>
        <step-three-review
          :amount="amount"
          :eth2-address="address"
          :start-provision="startProvision"
          :polling-status="pollingStatus"
          @readyToStake="readyToStake"
          @back="back"
        />
      </template>
    </mew-stepper>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router/composables';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

// emits
const emits = defineEmits(['readyToStake']);

// injections
const { router } = useRouter();
const { route } = useRoute();

// props
defineProps({
  currentApr: {
    type: String,
    default: ''
  },
  startProvision: {
    type: Function,
    default: () => {}
  },
  pollingStatus: {
    type: Object,
    default: () => {}
  }
});

// data
const stepperItems = [
  {
    step: 1,
    name: 'Stake Amount'
  },
  {
    step: 2,
    name: 'Provide Address'
  },
  {
    step: 3,
    name: 'Review & Stake'
  }
];

const skipped = ref(false);
const address = ref('');
const amount = ref(0);
const onStep = ref(1);

// watch
watch(
  () => onStep,
  newStep => {
    if (newStep == 2) {
      router.push({ name: ROUTES_WALLET.STAKED_2.NAME });
    } else if (newStep == 3) {
      router.push({ name: ROUTES_WALLET.STAKED_3.NAME });
    } else if (newStep == 4) {
      router.push({ name: ROUTES_WALLET.STAKED_4.NAME });
    } else {
      router.push({ name: ROUTES_WALLET.STAKED.NAME });
    }
  }
);

// mounted
onMounted(() => {
  if (route.name == ROUTES_WALLET.STAKED.NAME)
    router.push({ name: ROUTES_WALLET.STAKED_1.NAME });
});

// methods
const nextStep = obj => {
  switch (obj.onStep) {
    case 1:
      amount.value = obj.amount;
      break;
    case 2:
      address.value = obj.address;
      skipped.value = obj.isSkipped;
      break;
    case 3:
      address.value = obj.address;
      break;
    default:
      break;
  }
  onStep.value += 1;
};

const back = () => {
  onStep.value -= 1;
};

const readyToStake = () => {
  emits('readyToStake', amount.value);
};

// const reset = () => {
//   onStep.value = 1;
//   amount.value = 0;
//   skipped.value = false;
// };
</script>

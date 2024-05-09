<template>
  <div class="full-width">
    <v-row justify="space-around" no-gutters dense>
      <v-col cols="12" md="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          :subtitle="leftSideValues.subTitle"
          :title="leftSideValues.title"
          :caption="leftSideValues.caption"
          class="text-left height--full"
        />
      </v-col>
      <v-col cols="12" md="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          :subtitle="rightSideValues.subTitle"
          :title="rightSideValues.title"
          :caption="rightSideValues.caption"
          class="text-left height--full"
        />
      </v-col>
    </v-row>
    <div class="mt-5">
      <p class="mew-heading-3 text-left">{{ formText.title }}</p>
      <p class="mew-body pt-1 text-left">
        {{ formText.caption }}
      </p>
    </div>
    <div class="mt-5">
      <mew-input
        :value="amount"
        label="Amount"
        :right-label="selectedToken.token"
        :hide-clear-btn="true"
        :rules="checkIfNumerical"
        :error-messages="errorMessages"
        @input="setAmount"
      />
      <mew-toggle
        v-if="showToggle"
        :button-group="group"
        button-type="percentage"
        :on-toggle-btn-idx="startingIdx"
        @onBtnClick="onToggle"
      />
    </div>

    <div class="mt-12 justify-center d-flex">
      <mew-button
        :title="buttonTitle.action"
        color-theme="primary"
        btn-style="background"
        btn-size="xlarge"
        :disabled="disabled"
        @click.native="emitValues"
      />
      <mew-button
        :title="buttonTitle.cancel"
        color-theme="error"
        btn-style="transparent"
        class="ml-2"
        btn-size="xlarge"
        @click.native="cancel"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted, defineEmits } from 'vue';
import BigNumber from 'bignumber.js';
import { isEmpty } from 'lodash';

import { ACTION_TYPES } from '@/dapps/aave-dapp/handlers/helpers';
import hasValidDecimals from '@/core/helpers/hasValidDecimals';

// emits
const emit = defineEmits(['cancel', 'emitValues']);

// props
const props = defineProps({
  tokenDecimal: {
    type: Number,
    default: 18
  },
  selectedToken: {
    type: Object,
    default: () => {}
  },
  showToggle: {
    type: Boolean,
    default: false
  },
  leftSideValues: {
    type: Object,
    default: () => {
      return {
        title: '',
        caption: '',
        subTitle: ''
      };
    }
  },
  rightSideValues: {
    type: Object,
    default: () => {
      return { title: '', caption: '', subTitle: '' };
    }
  },
  formText: {
    type: Object,
    default: () => {
      return { title: '', caption: '' };
    }
  },
  buttonTitle: {
    type: Object,
    default: () => {
      return { action: '', cancel: '' };
    }
  },
  tokenBalance: {
    type: String,
    default: '0'
  },
  aaveBalance: {
    type: String,
    default: '0'
  }
});

// data
const group = ['25%', '50%', '75%', 'MAX'];
const amount = ref('0');
const startingIdx = ref(0);

// computed
const hasAmount = computed(() => {
  return (
    BigNumber(amount.value).gt(0) &&
    BigNumber(amount.value).lte(actualTokenBalance)
  );
});

const checkIfNumerical = computed(() => {
  const regex = new RegExp('^-?\\d+[.]?\\d*$');
  const test = regex.test(amount.value);
  return [test || 'Please enter a valid value!'];
});

const errorMessages = computed(() => {
  if (isEmpty(amount.value)) return 'Amount is required!';
  if (BigNumber(actualTokenBalance).lte(0)) return 'Not enough token balance';
  if (!hasValidDecimals(amount.value, props.tokenDecimal))
    return 'Too many decimal places';
  if (BigNumber(amount.value).isNegative()) return 'Amount cannot be negative';
  if (BigNumber(amount.value).lte(0))
    return 'Please enter an amount greater than 0';
  if (BigNumber(amount.value).gt(actualTokenBalance))
    return 'Amount exceeds available balance';
  return '';
});

const disabled = computed(() => {
  return !hasAmount.value || errorMessages.value !== '';
});

const actualTokenBalance = computed(() => {
  return props.buttonTitle.action.toLowerCase() === ACTION_TYPES.withdraw
    ? props.aaveBalance
    : props.tokenBalance;
});

// watch
watch(
  () => props.selectedToken,
  () => {
    setToggle();
  }
);

// mounted
onMounted(() => {
  setToggle();
});

// methods
const setToggle = () => {
  if (props.showToggle) {
    setTimeout(() => {
      onToggle(group[1]);
    }, 100);
  }
};

const setAmount = e => {
  amount.value = e;
};

const onToggle = e => {
  switch (e) {
    case group[0]:
      startingIdx.value = 0;
      amount.value = calculatedAmt(0.25);
      break;
    case group[1]:
      startingIdx.value = 1;
      amount.value = calculatedAmt(0.5);
      break;
    case group[2]:
      startingIdx.value = 2;
      amount.value = calculatedAmt(0.75);
      break;
    default:
      startingIdx.value = 3;
      amount.value = calculatedAmt(1);
  }
};

const cancel = () => {
  emit('cancel');
};

const emitValues = () => {
  emit('emitValues', amount.value);
};

const calculatedAmt = per => {
  let amt = actualTokenBalance;
  if (isNaN(amt)) amt = 0;
  return BigNumber(amt).times(per).decimalPlaces(props.tokenDecimal).toFixed();
};
</script>

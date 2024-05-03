<template>
  <div>
    <!--
      =====================================================================================
        Values
      =====================================================================================
    -->
    <confirmation-values-container :items="valueItems" is-swap />
    <!--
      =====================================================================================
        Summary
      =====================================================================================
    -->
    <confirmation-summary-block
      v-if="summaryItems.length <= 2"
      :items="summaryItems"
    >
      <template #rightColItem0>
        <div class="mew-body">
          1 <span class="greyPrimary--text">{{ fromType }}</span> =
          {{ formattedRate }}
          <span class="greyPrimary--text">{{ toType }}</span>
        </div>
      </template>
      <template #rightColItem1>
        <div class="mew-body">
          {{ convertedFees.value }}
          <span class="greyPrimary--text">{{ network.type.currencyName }}</span>
          ~{{ txFeeUSD }}
        </div>
      </template>
    </confirmation-summary-block>
    <confirmation-summary-block
      v-if="summaryItems.length == 3"
      :items="summaryItems"
    >
      <template #rightColItem0>
        <div class="mew-body d-flex justify-end">
          <mew-tooltip hide-icon :text="toAddress">
            <template #activatorSlot="{ on, attrs }">
              <div class="d-flex">
                <mew-blockie :address="toAddress" width="20px" height="20px" />
                <span v-bind="attrs" class="searchText--text ml-2" v-on="on">{{
                  toAddressShortened
                }}</span>
              </div>
            </template>
          </mew-tooltip>
        </div>
      </template>
      <template #rightColItem1>
        <div class="mew-body">
          1 <span class="searchText--text">{{ fromType }}</span> =
          {{ formattedRate }}
          <span class="searchText--text">{{ toType }}</span>
        </div>
      </template>
      <template #rightColItem2>
        <div class="mew-body">
          {{ convertedFees.value }}
          <span class="searchText--text">{{ toCurrency }}</span>
          ~{{ txFeeUSD }}
        </div>
      </template>
    </confirmation-summary-block>
  </div>
</template>

<script setup>
import { defineAsyncComponent, defineProps, computed } from 'vue';
import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';

import {
  formatFloatingPointValue,
  formatGasValue
} from '@/core/helpers/numberFormatHelper';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

const ConfirmationSummaryBlock = defineAsyncComponent(() =>
  import('./ConfirmationSummaryBlock')
);
const ConfirmationValuesContainer = defineAsyncComponent(() =>
  import('./ConfirmationValuesContainer')
);

// injections/use
const { network, getFiatValue } = useGlobalStore();
const { fiatValue } = useExternalStore();
const { hasGasPriceOption } = useWalletStore();

const props = defineProps({
  provider: {
    type: Object,
    default: () => {
      return {
        exchangeInfo: {
          img: ''
        },
        amount: '0',
        rate: '0'
      };
    }
  },
  fromVal: {
    type: String,
    default: '0'
  },
  toVal: {
    type: String,
    default: '0'
  },
  fromImg: {
    type: String,
    default: ''
  },
  toImg: {
    type: String,
    default: ''
  },
  fromType: {
    type: String,
    default: ''
  },
  toType: {
    type: String,
    default: ''
  },
  fromUsd: {
    type: String,
    default: ''
  },
  toUsd: {
    type: String,
    default: ''
  },
  txFee: {
    type: String,
    default: '0'
  },
  isToNonEth: {
    type: Boolean,
    default: false
  },
  toCurrency: {
    type: String,
    default: 'ETH'
  },
  toAddress: {
    type: String,
    default: ''
  }
});

// computed
const convertedFees = computed(() => {
  return formatGasValue(props.txFee);
});
const txFeeUSD = computed(() => {
  const feeETH = BigNumber(fromWei(props.txFee));
  return getFiatValue(feeETH.times(fiatValue));
});
const summaryItems = computed(() => {
  const newArr = [
    'Exchange rate',
    hasGasPriceOption ? 'Estimated fee' : 'Transaction fee'
  ];
  if (props.isToNonEth) {
    newArr.unshift(`Receive ${props.toCurrency} to`);
  }
  return newArr;
});
const formattedToVal = computed(() => {
  return formatFloatingPointValue(props.toVal).value;
});
const formattedFromVal = computed(() => {
  return formatFloatingPointValue(props.fromVal).value;
});
const formattedRate = computed(() => {
  return formatFloatingPointValue(props.provider.rate).value;
});
const valueItems = computed(() => {
  return [
    {
      title: 'You Swap',
      icon: props.fromImg,
      value: formattedFromVal.value,
      type: props.fromType,
      address: props.from,
      amount: formatFloatingPointValue(props.fromVal).value,
      usd: formatFloatingPointValue(props.fromUsd).value
    },
    {
      title: 'You will get',
      icon: props.toImg,
      value: formattedToVal.value,
      type: props.toType,
      address: props.to,
      amount: formatFloatingPointValue(props.toVal).value,
      usd: getFiatValue(props.toUsd)
    }
  ];
});
const toAddressStart = computed(() => {
  return props.toAddress.substring(0, 20);
});
const toAddressEnd = computed(() => {
  return props.toAddress.substring(props.toAddress.length - 4);
});
const toAddressShortened = computed(() => {
  return props.toAddress.length > 30
    ? `${toAddressStart.value}... ${toAddressEnd.value}`
    : props.toAddress;
});
</script>

<template>
  <v-sheet color="transparent" max-width="600px">
    <!--
      =====================================================================================
        Values
      =====================================================================================
    -->
    <confirmation-values-container :items="valueItems" class="mb-5" />
    <!--
    =====================================================================================
      Summary
    =====================================================================================
    -->
    <confirmation-summary-block :items="summaryItems">
      <template #rightColItem0>
        <div class="mew-body">
          {{ feeFormatted }}
          <span class="greyPrimary--text"
            >{{ network.type.currencyName }}/</span
          >
          ~{{ txFeeUsd }}
        </div>
      </template>
      <template #rightColItem1>
        <div class="mew-body">
          {{ totalFee }}
          <span class="greyPrimary--text"
            >{{ network.type.currencyName }}/</span
          >
          ~{{ totalFeeUSD }}
        </div>
      </template>
    </confirmation-summary-block>
  </v-sheet>
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';
import BigNumber from 'bignumber.js';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { toChecksumAddress } from '@/core/helpers/addressUtils';

import { useGlobalStore } from '@/core/store/global';
import { useExternalStore } from '@/core/store/external';

const ConfirmationSummaryBlock = defineAsyncComponent(() =>
  import('./ConfirmationSummaryBlock')
);
const ConfirmationValuesContainer = defineAsyncComponent(() =>
  import('./ConfirmationValuesContainer')
);

// injections/use
const { fiatValue } = useExternalStore();
const { getFiatValue } = useGlobalStore();

// props
const props = defineProps({
  to: {
    type: String,
    default: ''
  },
  network: {
    type: Object,
    default: () => {}
  },
  txFee: {
    type: String,
    default: '0'
  },
  txFeeUsd: {
    type: String,
    default: '0'
  },
  value: {
    type: String,
    default: '0'
  },
  toDetails: {
    type: Object,
    default: () => {}
  },
  sendCurrency: {
    type: Object,
    default: () => {}
  },
  avatar: {
    type: String,
    default: ''
  }
});

const currency = computed(() => {
  const obj = Object.assign({}, props.sendCurrency);
  if (!obj.hasOwnProperty('amount')) obj['amount'] = props.value;
  if (!obj.hasOwnProperty('priceRaw'))
    obj['priceRaw'] = BigNumber(props.sendCurrency.price).toNumber();
  return obj;
});
const isNetworkCurrency = computed(() => {
  return props.currency.symbol === props.network.type.currencyName;
});
const feeFormatted = computed(() => {
  return formatFloatingPointValue(props.txFee).value;
});
const totalFee = computed(() => {
  if (currency.value.symbol === props.network.type.currencyName) {
    return formatFloatingPointValue(BigNumber(props.value).plus(props.txFee))
      .value;
  }
  return feeFormatted;
});
const totalFeeUSD = computed(() => {
  const ethFeeToUsd = BigNumber(props.txFee).times(props.value);
  if (currency.value.symbol === props.network.type.currencyName) {
    return getFiatValue(BigNumber(totalFee).times(fiatValue.value).toFixed(2));
  }
  const tokenPrice = BigNumber(currency.value.priceRaw).times(props.value);
  return getFiatValue(tokenPrice.plus(ethFeeToUsd));
});
const usdAmount = computed(() => {
  return getFiatValue(BigNumber(props.value).times(currency.value.priceRaw));
});
const summaryItems = computed(() => {
  return isNetworkCurrency.value
    ? ['Transaction Fee', 'Total']
    : ['Transaction Fee'];
});
const valueItems = computed(() => {
  return [
    {
      amount: formatFloatingPointValue(currency.value.amount).value,
      icon: currency.value.img,
      usd: usdAmount,
      type: currency.value.symbol
    },
    {
      avatar: props.avatar,
      address: props.to ? toChecksumAddress(props.to) : '',
      nickname:
        props.toDetails && props.toDetails.nickname
          ? props.toDetails.nickname
          : '',
      ensName:
        props.toDetails && props.toDetails.ensName
          ? props.toDetails.ensName
          : ''
    }
  ];
});
</script>
